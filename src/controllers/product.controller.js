"use strict";
const ProductService = require("../services/product.service");
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
    const products = await ProductService.getAllProducts();
    return res.render("shop.ejs", {
      products: products,
      page: "shop",
      isAuthenticated: req.isAuthenticated(),
    });
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
  getProductByNameOrDescription = async (req, res) => {
    try {
      const { query } = req.query;

      // Validate the input
      if (!query) {
        res.redirect("./home");
      }

      const products = await ProductService.findProductByNameOrDescript(query);

      // Render the results
      res.render("shop.ejs", {
        products: products,
        page: "shop",
        isAuthenticated: req.isAuthenticated(),
      });
    } catch (error) {
      console.error(error);
      res.redirect("./home");
    }
  };

  getFilter = async (req, res) => {
    try {
      const { query, price, color, size, gender } = req.query;

      const products = await ProductService.findProductByFilter(
        query,
        price,
        color,
        size,
        gender
      );

      // Render the shop page with the filtered products
      res.render("shop.ejs", {
        products: products,
        page: "shop",
        isAuthenticated: req.isAuthenticated(),
      });
    } catch (error) {
      console.error(error);
      res.status(500).render("shop.ejs", {
        error: "Server error. Please try again later.",
        isAuthenticated: req.isAuthenticated(),
      });
    }
  };
}
module.exports = new ProductController();
