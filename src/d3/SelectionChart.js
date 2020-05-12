import React, { useRef, useEffect, useState } from 'react'
import '../App.css'
import { select, 
        scaleLinear,
        curveCardinal,
        line,
        axisBottom,
        axisRight,
        extent
    } from 'd3'
import useResizeObserver from '../utils/hooks/useResizeObserver'

function LineChart({ data, selection }) {

    const myPath = data.map(d => d.measures[0].value)
    const labels = data.map(d => d.dimensions[0].value) // xAxis labels

    const svgRef = useRef()
    const wrapperRef = useRef()
    const dimensions = useResizeObserver(wrapperRef)

    useEffect(() => {
        const svg = select(svgRef.current)
        const content = svg.select(".content")


        if(!dimensions) return;

        const xScale = scaleLinear()
            .domain(selection) // scale of peices of data (ticks)
            .range([0, dimensions.width]) // width of the SVG

        const yScale = scaleLinear()
            .domain([50, 240000]) // scale of data
            .range([dimensions.height, 0]) //height of the SVG

        const xAxis = axisBottom(xScale)
            .ticks(selection)
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


        content.selectAll('.line')
            .data([myPath]) 
            .join('path')
            .attr('class', 'line')
            .attr('d', myLine) 
            .attr('fill', 'none')
            .attr('stroke', 'blue') 


        content.selectAll('.myDot')
            .data(myPath)
            .join('circle')
            .attr('class', 'myDot')
            .attr('stroke', 'black')
            .attr('r', (value,index) => index >= selection[0] && index <= selection[1] ? 8 : 4 )
            .attr('fill', (value,index) => index >= selection[0] && index <= selection[1] ? 'lime' : 'yellow' )
            .attr('cx', (value, index) => xScale(index))    
            .attr('cy', yScale)
        

    }, [data, dimensions, selection, labels, myPath])


    return (
        <>
        <div ref={wrapperRef} style={{ marginBottom: "2rem" }}>
            <svg ref={svgRef}>
                <defs>
                    <clipPath id="myClipPath">
                        <rect x="0" y="0" width="100%" height="100%" />
                    </clipPath>
                </defs>
                
                <g className="content" clipPath="url(#myClipPath)" />
                <g className="x-axis" />
                <g className="y-axis" />
             </svg>
        </div>
        <br />
        <br />
        </>
    )
}

export default LineChart
