const app = require("./src/app");
const config = require("./src/configs/config.mongo");
const PORT = config.app.port;
const fs = require("fs");
const https = require("https");

const httpsOptions = {
  key: fs.readFileSync("./cert/server.key"),
  cert: fs.readFileSync("./cert/server.crt"),
};
console.log(PORT);
const server = https.createServer(httpsOptions, app).listen(PORT, () => {
  console.log(`hello ${PORT}`);
});
