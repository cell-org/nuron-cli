const YAML = require('yaml')
const { spawn } = require("child_process");
const os = require('os')
const fs = require('fs')
const path = require('path')
module.exports = async (f) => {
  const str = await fs.promises.readFile(path.resolve(__dirname, "docker-compose.yml"), "utf8")
  const parsed = YAML.parse(str)
  const nuronConfig = parsed.services.nuron.volumes[0]
  const home = nuronConfig.source.replace("${HOME}", os.homedir())
  const nuronHome = path.resolve(home, "home")
  const appHome = path.resolve(nuronHome, "workspace", f)
  if (fs.existsSync(appHome)) {
    const child = spawn('npx', ['http-server', appHome], { shell: true })
    child.stdout.pipe(process.stdout)
  } else {
    console.log(`Nuron File System : ${appHome} does not exist`)
  }
}
