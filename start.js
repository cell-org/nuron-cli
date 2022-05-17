const fs = require('fs')
const YAML = require('yaml')
const compose = require('docker-compose')
const os = require('os')
const path = require('path')
const start = async () => {
  const str = await fs.promises.readFile(path.resolve(__dirname, "docker-compose.yml"), "utf8")
  const parsed = YAML.parse(str)
  for(let volume of parsed.services.nuron.volumes) {
    const home = volume.source.replace("${HOME}", os.homedir())
    await fs.promises.mkdir(home, { recursive: true }).catch((e) => { })
  }
  await compose.upAll({ cwd: __dirname, log: true })
}
module.exports = start
