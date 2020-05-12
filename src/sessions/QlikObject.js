import React, { useState, useEffect } from 'react'
import { openSession } from '../qlikConnect/enigmaApp'
import { def } from '../defs/def' 
import { updateData } from'../utils/updateData'
import LineChart from '../d3/LineChart'


function QlikObject() {

    const [data, setData] = useState([])

    useEffect(() => {
        const init = async () => {
            const app = await openSession()
            const model = await app.createSessionObject(def)
            //console.log('model', model)
            const layout = await model.getLayout()
            const props = await model.getProperties()
            // console.log('layout', layout)
            // console.log('props', props)
            props.qHyperCubeDef.qInitialDataFetch = [
                {
                  qTop: 0,
                  qLeft: 0,
                  qWidth: layout.qHyperCube.qSize.qcx,
                  qHeight: layout.qHyperCube.qSize.qcy,
                }
              ]
              layout.qHyperCube.qDataPages = await model.getHyperCubeData(
                '/qHyperCubeDef',
                props.qHyperCubeDef.qInitialDataFetch
              )
              setData(updateData(layout))
            //   console.log(data)
        }
        init()
    }, [])
    return (
        <div>
         {data.length > 0 && <LineChart data={data} />}   
        </div>
    ) 
}

export default QlikObject
