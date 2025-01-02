const app = require("./src/app");
const config = require("./src/configs/config.mongo");
const PORT = config.app.port;
const fs = require("fs");
const https = require("https");

const httpsOptions = {
  key: fs.readFileSync("/path/to/your/private.key"),
  cert: fs.readFileSync("/path/to/your/certificate.crt"),
};
console.log(PORT);
const server = https.createServer(httpsOptions, app).listen(PORT, () => {
  console.log(`hello ${PORT}`);
});
