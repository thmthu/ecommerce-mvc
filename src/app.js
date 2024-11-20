require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const compression = require("compression");
const cors = require("cors");
const configViewEngine = require('./configs/viewEngine');

const {default : helmet} = require("helmet");
const app = express();

app.use(morgan("dev"));
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"], // Restrict everything else to self
      imgSrc: ["*"],          // Allow images from all sources
    },
  })
);
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: true, // Tự động cho phép tất cả nguồn gốc dựa vào yêu cầu
    methods: ["GET", "POST", "OPTIONS", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "x-api-key", "Authorization"],
    credentials: true,

  })
);

require("./dbs/init.mongodb");
configViewEngine(app);
app.use("/", require("./routes"));
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});
app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  return res.status(statusCode).json({
    status: "error",
    code: statusCode,
    message: `${error.message}` || "Internal server error",
  });
});

module.exports = app;
