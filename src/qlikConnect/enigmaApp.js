const enigma = require('enigma.js')
const schema = require('enigma.js/schemas/12.20.0.json') // see 'What is a schema?'

let config = {
  host: "localhost", // if local = localhost etc
  isSecure: false, // whether it's being hosted on a local port or not
  port: 4848, // if is secure will be 443, otherwise usually 4848
  prefix: "", 
  appId: "Consumer Sales.qvf"  // name of the qvf file, or the appID if connecting to QS server
}

const session = enigma.create({
  schema, // schema see 'What is a schema?'
  url: `ws${config.isSecure ? 's' : ''}://${config.host}:${config.port}/${config.prefix ? `${config.prefix}/` : ''}app/engineData`,
}) // calculated url based on variables provided in config 

export function openSession() {
  return new Promise((resolve, reject) => {
    session.open().then(global => {
      global.openDoc(config.appId).then(doc => {
        resolve(doc)
          })
      .catch(() => {
        reject('Qlik-Enigma Error: unable to openDoc')
      })
    })
    .catch(() => {
      reject('Qlik-Enigma Error: unable to open session')
    })
  })
}