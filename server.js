const app = require("./src/app");
const config = require("./src/configs/config.mongo");
const PORT = config.app.port;
const fs = require("fs");
console.log(PORT);
const server = app.listen(PORT, () => {
  console.log(`hello ${PORT}`);
});
