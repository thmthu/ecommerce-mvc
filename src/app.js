require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const compression = require("compression");
const cors = require("cors");
const configViewEngine = require("./configs/viewEngine");
const authMiddleware = require("./middleware/authMiddleware"); // Import the auth middleware
const session = require("express-session");
const MongoStore = require("connect-mongo"); // Import MongoStore
const passport = require("passport");
const flash = require("connect-flash");
const config = require("./configs/config.mongo"); // Adjust the path as necessary
const cookieParser = require("cookie-parser");
const path = require("path");
const fileUpload = require("express-fileupload");
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { getCloudinaryUrl } = require('./utils/cloudinary');
const { MongoClient } = require("mongodb");
const fs = require("fs");
const { searchInAlgolia } = require("./utils/searchInAlgolia");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME, // Your Cloud Name
  api_key: process.env.CLOUDINARY_API_KEY,       // Your API Key
  api_secret: process.env.CLOUDINARY_API_SECRET, // Your API Secret
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads', // Folder name in Cloudinary
    format: async (req, file) => 'jpeg', // Optional: auto-format to JPEG
    public_id: (req, file) => file.originalname.split('.')[0], // Optional: Use original file name
  },
});

// Sử dụng cookie-parser
const { default: helmet } = require("helmet");
const app = express();

const upload = multer({ storage });

app.post('/upload', upload.single('image'), (req, res) => {
  try {
    res.status(200).json({ message: 'File uploaded successfully!', file: req.file });
  } catch (error) {
    res.status(500).json({ error: 'File upload failed.', details: error.message });
  }
});

app.post('/upload-multiple', upload.array('images', 5), (req, res) => {
  try {
    res.status(200).json({ message: 'Files uploaded successfully!', files: req.files });
  } catch (error) {
    res.status(500).json({ error: 'File upload failed.', details: error.message });
  }
});

app.locals.getCloudinaryUrl = getCloudinaryUrl;

const exportFilePath = "./exported_data.json"; // Path to save exported data

async function exportAllCollectionsToSingleFile() {
  const client = new MongoClient(process.env.PRO_DB_URL);

  try {
    // Connect to the database
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db("test");

    // Get the list of all collections in the database
    const collections = await db.listCollections().toArray();

    console.log(db);

    // Object to hold all collections' data
    const combinedData = {};

    // Iterate over each collection
    for (let collectionInfo of collections) {
      const collectionName = collectionInfo.name;
      console.log(`Exporting collection: ${collectionName}`);

      const collection = db.collection(collectionName);

      // Fetch all data from the collection
      const data = await collection.find({}).toArray();

      // Add the collection's data to the combined object
      combinedData[collectionName] = data;
    }

    // Write the combined data to a single JSON file
    fs.writeFileSync(exportFilePath, JSON.stringify(combinedData, null, 2));
    console.log(`Exported all collections to ${exportFilePath}`);
  } catch (err) {
    console.error("Error during export:", err);
  } finally {
    await client.close();
    console.log("Connection closed");
  }
}

exportAllCollectionsToSingleFile();

app.locals.searchInAlgolia = searchInAlgolia;

const dbUrl = config.db.url;
app.use((req, res, next) => {
  res.set("Cache-Control", "no-cache");
  next();
});
app.use(morgan("dev"));
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"], // Restrict everything else to self
      scriptSrc: ["*", "'unsafe-inline'"], // Allow scripts from self and code.jquery.com
      imgSrc: ["'self'", "data:", "*"], // Allow images from all sources
      scriptSrcAttr: ["*", "'unsafe-inline'"],
      connectSrc: ["'self'", "http://localhost:8000"],
    },
  })
);

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Serve static files from the "uploads" directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(cookieParser());
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

// Use express-fileupload middleware
app.use(fileUpload());

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 14 * 24 * 60 * 60 * 1000, httpOnly: true }, // Match TTL in milliseconds
    store: MongoStore.create({
      mongoUrl: dbUrl,
      collectionName: "sessions", // The name of the collection where sessions will be stored
      ttl: 14 * 24 * 60 * 60, // Optional: Session expiration time in seconds (default is 14 days)
    }),
  })
);
app.use(flash()); // Use connect-flash

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate("session"));
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

// app.use(authMiddleware);

module.exports = app;
