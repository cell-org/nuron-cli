#!/usr/bin/env node
process.removeAllListeners('warning')
const config = require('./config')
const start = require('./start')
const stop = require('./stop')
const home = require('./home')
const serve = require('./serve')
const tunnel = require('./tunnel')
const ls = require('./ls')
if (process.argv.length >= 3) {
  let command = process.argv[2].toLowerCase()
  if (command === "start") {
    start()
  } else if (command === "stop") {
    stop()
  } else if (command === "config") {
    config()
  } else if (command === "home") {
    home()
  } else if (command === "serve") {
    if (process.argv.length >= 4) {
      serve(process.argv[3])
    } else {
      console.log("folder name missing (ex: 'nuron serve mynft')")
    }
  } else if (command === "tunnel") {
    if (process.argv.length >= 4) {
      tunnel(parseInt(process.argv[3]))
    } else {
      console.log("port missing (ex: 'nuron tunnel 8080')")
    }
  } else if (command === "ls") {
    ls()
  } else {
    console.log("Nuron - please enter a command (start|stop|config|home)")
  }
} else {
  console.log("Nuron - please enter a command (start|stop|config|home)")
}
