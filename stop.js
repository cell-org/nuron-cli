const compose = require('docker-compose')
const path = require('path')
const stop = async () => {
  console.log("stopping nuron...")
  await compose.down({ cwd: __dirname, log: true })
  console.log("stopped nuron")
}
module.exports = stop
