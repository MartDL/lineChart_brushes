export const def = {
    qInfo: {
      qType: "qHyperCube"
    },
    qHyperCubeDef: {
        qDimensions: [
            { qDef: { qFieldDefs: ["Product Group Desc"]}},
        ],
        qMeasures: [
          { qDef: { qDef: 'Sum ([Sales Quantity])', qLabel: 'Sales Quantity'}}
         ]
    },
    qInitialDataFetch: [
      {
        qTop: 0,
        qLeft: 0,
        qWidth: 2,
        qHeight: 100,
      }
    ],
}