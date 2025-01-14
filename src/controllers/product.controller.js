"use strict";
const ProductService = require("../services/product.service");
const AccessService = require("../services/access.service");
const CartService = require("../services/cart.service");
const { product } = require("../models/product.model");
class ProductController {
  getCart = async (req, res) => {
    const userId = req.user == undefined ? null : req.user.id;
    const avatar = await AccessService.getAvatar(userId);
    const numProducts = await CartService.getCartProductsSize(userId);
    return res.render("cart.ejs", {
      page: "cart",
      avatar,
      numProducts,
      isAuthenticated: req.isAuthenticated(),
    });
  };
  getHome = async (req, res) => {
    try {
      console.log("my query", req.query);
      const products = await ProductService.getRandomProducts(4);
      const latestProducts = await ProductService.getLatestProducts(4);
      const userId = req.user == undefined ? null : req.user.id;
      const avatar = await AccessService.getAvatar(userId);
      const numProducts = await CartService.getCartProductsSize(userId);
      console.log("userId: ", userId);
      console.log("numProducts: ", numProducts);
      res.render("index.ejs", {
        page: "home",
        avatar,
        numProducts,
        featuredProducts: products,
        latestProducts: latestProducts,
        isAuthenticated: req.isAuthenticated(),
      });
    } catch (error) {
      console.error(error);
      res.redirect("./home");
    }
  };
  getContact = async (req, res) => {
    const userId = req.user == undefined ? null : req.user.id;
    const avatar = await AccessService.getAvatar(userId);
    const numProducts = await CartService.getCartProductsSize(userId);
    return res.render("contact.ejs", {
      page: "contact",
      avatar,
      numProducts,
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
    const status = req.query.status || "";
    const cate = req.query.cate || "";
    const manu = req.query.manu || "";
    const sortBy = req.query.sortBy || "";
    console.log("==============", req.user);
    const userId = req.user == undefined || null ? null : req.user.id;
    console.log(userId);
    try {
      let options = {};
      options.sortBy = sortBy === "createdAt" ? "createdAt" : "product_price";
      options.sortOrder = sortBy === "product_price1" ? "asc" : "desc";
      options.skip = skip;
      options.limit = limit;
      options.filters = {
        product_price: price,
        product_color: color,
        product_size: size,
        product_status: status,
        product_type: cate,
        product_attributes: {
          brand: manu,
        }
      };
      const searchInAlgolia = req.app.locals.searchInAlgolia;

      const { products, totalPages } = await searchInAlgolia(searchQuery, options);

      const numProducts = await CartService.getCartProductsSize(userId);

      console.log(products);

      if (req.xhr || req.headers.accept.indexOf("json") > -1) {
        // If the request is an AJAX request, return JSON data
        return res.json({
          products,
          totalPages,
          currentPage,
          sortBy,
          numProducts,
        });
      } else {
        const avatar = await AccessService.getAvatar(userId);
        // Otherwise, render the shop view
        res.render("shop.ejs", {
          page: "shop",
          avatar,
          numProducts,
          isAuthenticated: req.isAuthenticated(),
          products,
          totalPages,
          currentPage,
          searchQuery,
          price,
          color,
          size,
          cate,
          manu,
          status,
          sortBy,
        });
      }
    } catch (err) {
      res
        .status(500)
        .json({ error: "Failed to fetch products", err: err.message });
    }
  };
  getDetail = async (req, res) => {
    const product = await ProductService.getProductById(req.params.id);
    const relatedProducts = await ProductService.getRelatedProducts(
      product.product_type,
      product._id,
      4
    );
    const userId = req.user == undefined ? null : req.user.id;
    const avatar = await AccessService.getAvatar(userId);
    const numProducts = await CartService.getCartProductsSize(userId);
    return res.render("detail.ejs", {
      productId: req.params.id,
      product: product,
      relatedProducts: relatedProducts,
      page: "detail",
      avatar,
      numProducts,
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
