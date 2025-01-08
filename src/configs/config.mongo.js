require("dotenv").config(); // Tải các biến môi trường từ tệp .env

const dev = {
  app: {
    port: process.env.DEV_APP_PORT || 3052,
  },
  db: {
    host: process.env.DEV_APP_HOST || "localhost",
    port: process.env.DEV_APP_PORT || 27017,
    name: process.env.DEV_APP_NAME || "mitu",
    url: process.env.DEV_DB_URL || "mitu_dev",
  },
};
const pro = {
  app: {
    port: process.env.PRO_APP_PORT || 3000,
  },
  db: {
    host: process.env.PRO_APP_HOST || "localhost",
    port: process.env.PRO_APP_PORT || 27017,
    name: process.env.PRO_APP_NAME || "mitu",
    url: process.env.PRO_DB_URL || "mitu",
  },
};
const config = { dev, pro };
const env = process.env.NODE_ENV || "dev";
module.exports = config[env];
