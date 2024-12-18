"use strict";
const ProductService = require("../services/product.service");
const { product } = require("../models/product.model");
class ProductController {
  getCart = (req, res) => {
    return res.render("cart.ejs", {
      page: "cart",
      isAuthenticated: req.isAuthenticated(),
    });
  };
  getHome = async (req, res) => {
    try {
      const products = await ProductService.getRandomProducts(4);
      const latestProducts = await ProductService.getLatestProducts(4);

      // Render the index page with the random products
      res.render("index.ejs", {
        page: "home",
        featuredProducts: products,
        latestProducts: latestProducts,
        isAuthenticated: req.isAuthenticated(),
      });
    } catch (error) {
      console.error(error);
      res.redirect("./home");
    }
  };
  getContact = (req, res) => {
    return res.render("contact.ejs", {
      page: "contact",
      isAuthenticated: req.isAuthenticated(),
    });
  };
  getCheckOut = (req, res) => {
    return res.render("checkout.ejs", {
      page: "checkout",
      isAuthenticated: req.isAuthenticated(),
    });
  };
  getShop = async (req, res) => {
    const currentPage = parseInt(req.query.currentPage) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (currentPage - 1) * limit;
    const searchQuery = req.query.search || "";
    const price = req.query.price || "";
    const color = req.query.color || "";
    const size = req.query.size || "";
    const gender = req.query.gender || "";
    const sortBy = req.query.sortBy || "";

    try {
      // Build the query object
      let query = {};

      if (searchQuery) {
        query.$or = [
          { product_name: { $regex: searchQuery, $options: "i" } },
          { product_description: { $regex: searchQuery, $options: "i" } },
        ];
      }
      
      if (price) {
        const priceRanges = Array.isArray(price) ? price : [price];
        const priceFilter = priceRanges.map((range) => {
          const [min, max] = range.split("-").map(Number);
          return { product_price: { $gte: min, $lte: max } };
        });
  
        if (query.$or) {
          query.$and = [{ $or: query.$or }, { $or: priceFilter }];
          delete query.$or;
        } else {
          query.$or = priceFilter;
        }
      }
  
      if (color) {
        query.product_color = { $in: Array.isArray(color) ? color : [color] };
      }
  
      if (size) {
        query.product_size = { $in: Array.isArray(size) ? size : [size] };
      }
  
      if (gender) {
        query.product_type = { $in: Array.isArray(gender) ? gender : [gender] };
      }

      let sort = {};
      if (sortBy === "latest") {
        sort = { createdAt: -1 };
      } else if (sortBy === "lPrice") {
        sort = { product_price: 1 }; 
      } else if (sortBy === "hPrice") {
        sort = { product_price: -1 };
      }

      const [products, total] = await Promise.all([
        product.find(query).sort(sort).skip(skip).limit(limit), // Fetch products for the current page
        product.countDocuments(query), // Get the total count of products
      ]);

      const totalPages = Math.ceil(total / limit);

      if (req.xhr || req.headers.accept.indexOf('json') > -1) {
        // If the request is an AJAX request, return JSON data
        return res.json({ products, totalPages, currentPage });
      } else {
        // Otherwise, render the shop view
        res.render("shop.ejs", {
          page: "shop",
          isAuthenticated: req.isAuthenticated(),
          products,
          totalPages,
          currentPage,
          searchQuery,
          price,
          color,
          size,
          gender,
          sortBy,
        });
      }
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  };
  getDetail = async (req, res) => {
    const product = await ProductService.getProductById(req.params.id);
    const relatedProducts = await ProductService.getRelatedProducts(
      product.type,
      product._id,
      4
    );
    return res.render("detail.ejs", {
      product: product,
      relatedProducts: relatedProducts,
      page: "detail",
      isAuthenticated: req.isAuthenticated(),
    });
  };
  getAllProduct = async (req, res) => {
    const products = await ProductService.getAllProducts();
    console.log(products[0]);
    // return res.render("shop.ejs", {
    //   products: products,
    //   isAuthenticated: req.isAuthenticated(),
    // });
    return res.json({ products: products });
  };
}
module.exports = new ProductController();
