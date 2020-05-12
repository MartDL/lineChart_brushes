export const updateData = (layout) => {
    const { qDimensionInfo: dimensionInfo, qMeasureInfo: measureInfo } = layout.qHyperCube
    // console.log('dimensionInfo', dimensionInfo)
    // console.log('measureInfo', measureInfo)
    
    const data = layout.qHyperCube.qDataPages[0].qMatrix.map((x) => ({
      qElemNumber: x[0].qElemNumber,
      dimensions: x.slice(0, dimensionInfo.length).map((d, i) => ({
        label: dimensionInfo[0].qFallbackTitle,
        value: d.qText,
      })),
      measures: x.slice(dimensionInfo.length).map((d, i) => ({
        label: measureInfo[i].qFallbackTitle,
        value: d.qNum,
      })),
    }))
  
    return data
  }