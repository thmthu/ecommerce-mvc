"use strict";
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

// MongoDB Atlas connection string
const mongoURI =
  "mongodb+srv://thuvedep:hihi@cluster0.nn3bq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Function to create schemas and models
function createModels() {
  const cartSchema = new mongoose.Schema({
    cart_products: { type: Array, default: [] },
    cart_count_products: { type: Number, default: 0 },
    cart_userId: { type: mongoose.Schema.Types.ObjectId },
  });

  const customerSchema = new mongoose.Schema({
    name: { type: String, trim: true, maxLength: 150 },
    avatar: { type: String },
    email: { type: String, unique: true, trim: true },
    password: { type: String },
    address: { type: String },
    phone: { type: String },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    lastLogin: { type: Date, default: Date.now },
    isVerified: { type: Boolean, default: false },
    role: { type: String, enum: ["Customer", "Admin"], default: "Customer" },
  });

  const productSchema = new mongoose.Schema({
    product_name: { type: String },
    product_thumb: { type: [String] },
    product_price: { type: Number },
    product_color: { type: String },
    product_size: { type: String },
    product_quantity: { type: Number },
    product_quantity_sold: { type: Number, default: 0 },
    product_type: {
      type: String,
      enum: ["MaleClothe", "FemaleClothe", "KidClothe"],
 
    },
  });

  const orderSchema = new mongoose.Schema({
    orderId: { type: mongoose.Schema.Types.ObjectId },
    userId: { type: mongoose.Schema.Types.ObjectId },
    userName: { type: String },
    userAddress: { type: String },
    userPhone: { type: String },
    userEmail: { type: String },
    totalPrice: { type: Number },
    createdDate: { type: Date, default: Date.now },
    order_products: { type: Array, default: [] },
    status: { type: String, default: "Pending" },
  });

  const reviewSchema = new mongoose.Schema({
    product_id: { type: mongoose.Schema.Types.ObjectId },
    email: { type: String, trim: true },
    user_name: { type: String, trim: true },
    star: { type: Number, min: 1, max: 5 },
    comment: { type: String, trim: true },
  });

  return {
    Cart: mongoose.model("Cart", cartSchema),
    Customer: mongoose.model("Customer", customerSchema),
    Product: mongoose.model("Product", productSchema),
    Order: mongoose.model("Order", orderSchema),
    Review: mongoose.model("Review", reviewSchema),
  };
}

// Function to insert data
async function migrateCollections(models, data) {
  if (data.Carts) {
    await models.Cart.insertMany(data.Carts);
    console.log(`Inserted ${data.Carts.length} carts`);
  }
  if (data.Customers) {
    await models.Customer.insertMany(data.customers);
    console.log(`Inserted ${data.Customers.length} customers`);
  }
  if (data.Products) {
    await models.Product.insertMany(data.products);
    console.log(`Inserted ${data.Products.length} products`);
  }
  if (data.Orders) {
    await models.Order.insertMany(data.orders);
    console.log(`Inserted ${data.Orders.length} orders`);
  }
  if (data.Reviews) {
    await models.Review.insertMany(data.reviews);
    console.log(`Inserted ${data.Reviews.length} reviews`);
  }
}

// Connect to MongoDB Atlas
mongoose
  .connect(mongoURI)
  .then(async () => {
    console.log("Successfully connected to MongoDB Atlas");

    try {
      // Read data from JSON file
      const dataPath = path.join(__dirname, "data.json");
      const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
      console.log(data.Carts);
      // Create models
      const models = createModels();

      // Migrate data
      await migrateCollections(models, data);

      console.log("Migration completed successfully!");
    } catch (error) {
      console.error("Migration failed:", error);
    } finally {
      mongoose.connection.close();
    }
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB Atlas:", error);
    process.exit(1);
  });
