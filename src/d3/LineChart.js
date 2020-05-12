import React, { useRef, useEffect, useState } from 'react'
import '../App.css'
import { select, 
        scaleLinear,
        curveCardinal,
        line,
        axisBottom,
        axisRight,
        event,
        brushX
    } from 'd3'
import usePrevious from '../utils/hooks/usePrevious'
import useResizeObserver from '../utils/hooks/useResizeObserver'

function LineChart({ data }) {

    const myPath = data.map(d => d.measures[0].value)
    const labels = data.map(d => d.dimensions[0].value) // xAxis labels

    const svgRef = useRef()
    const wrapperRef = useRef()
    const dimensions = useResizeObserver(wrapperRef)
    const [selection, setSelection] = useState([0, 1.5])
    const previousSelection = usePrevious(selection)

    useEffect(() => {
        const svg = select(svgRef.current)

        if(!dimensions) return;

        const xScale = scaleLinear()
            .domain([0, data.length - 1]) // scale of peices of data (ticks)
            .range([0, dimensions.width]) // width of the SVG

        const yScale = scaleLinear()
            .domain([50, 240000]) // scale of data
            .range([dimensions.height, 0]) //height of the SVG

        const xAxis = axisBottom(xScale)
            .ticks(data.length - 1)
            .tickFormat((d,i) => labels[i]) // xAis labels used
            
         
        svg.select('.x-axis')
            .style('transform', `translateY(${dimensions.height}px)`)
            .call(xAxis)
            .selectAll('text')  // rotate xAxis labels 60 degrees 
            .attr('transform', 'rotate(40)')
            .attr("y", 5)
            .attr("x", 50)


        const yAxis = axisRight(yScale)
        svg.select('.y-axis')
            .style('transform', `translateX(${dimensions.width}px)`)
            .call(yAxis)



        const myLine = line()
            .x((value, index) =>xScale(index)) 
            .y(value => yScale(value))
            .curve(curveCardinal)


        svg.selectAll('.line')
            .data([myPath]) 
            .join('path')
            .attr('class', 'line')
            .attr('d', myLine) 
            .attr('fill', 'none')
            .attr('stroke', 'blue') 


        svg.selectAll('.myDot')
            .data(myPath)
            .join('circle')
            .attr('class', 'myDot')
            .attr('stroke', 'black')
            .attr('r', (value,index) => index >= selection[0] && index <= selection[1] ? 8 : 4 )
            .attr('fill', (value,index) => index >= selection[0] && index <= selection[1] ? 'lime' : 'yellow' )
            .attr('cx', (value, index) => xScale(index))    
            .attr('cy', yScale)

        const brush = brushX().extent([
            [0,0], 
            [dimensions.width, dimensions.height]
        ])
        .on('start brush end', () => {
            if (event.selection) {
            const indexSelection = event.selection.map(xScale.invert)
            setSelection(indexSelection)
            console.log(indexSelection)
            }
        })

        if (previousSelection === selection) {
            svg.select('.brush')
            .call(brush)
            .call(brush.move, selection.map(xScale))
        }

    }, [data, dimensions, selection])


    return (
        <>
        <div ref={wrapperRef} style={{ marginBottom: "2rem" }}>
            <svg ref={svgRef} width="600" height="400">
                <g className="x-axis" />
                <g className="y-axis" />
                <g className="brush" />
             </svg>
        </div>
        <br />
        <br />
        <small style={{ marginBottom: "1rem"}}>
            selected values: [
                {myPath.filter(
                    (value, index) => index >= selection[0] && index <= selection[1]
                )
                .join('  /  ')}
            ]
        </small>
        </>
    )
}

export default LineChart


