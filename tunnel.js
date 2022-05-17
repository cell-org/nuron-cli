const localtunnel = require('localtunnel');
module.exports = async (port) => {
  const tunnel = await localtunnel({ port });
  console.log("Tunnel created: ", tunnel.url);
}
