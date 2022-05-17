const YAML = require('yaml')
const os = require('os')
const path = require('path')
const fs = require('fs')
module.exports = async () => {
  const str = await fs.promises.readFile(path.resolve(__dirname, "docker-compose.yml"), "utf8")
  const parsed = YAML.parse(str)
  const nuronConfig = parsed.services.nuron.volumes[0]
  const home = nuronConfig.source.replace("${HOME}", os.homedir())
  const nuronHome = path.resolve(home, "home")
  console.log(nuronHome)
}
