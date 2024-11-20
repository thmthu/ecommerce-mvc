"use strict";

const AccessService = require("../services/access.service");
const bcrypt = require('bcrypt');
const Customer = require('../models/customer.model');
const { OK, CREATED, SuccessResponse } = require("../core/success.response");
class AccessController {
  logout = async (req, res, next) => {
    console.log("logout controller");
    console.log(req.keyStore);
    new SuccessResponse({
      message: "logout success",
      metadata: await AccessService.logout({ keyStore: req.keyStore }), // Truyền đối tượng keyStore đúng cách
    }).send(res);
  };
  signIn = async (req, res, next) => {
    try {
      const { email, password } = req.body;

      // Validate the input
      if (!email || !password) {
        return res.status(400).render('login', { error: 'All fields are required' });
      }

      // Find the user by email
      const user = await Customer.findOne({ email });
      if (!user) {
        return res.status(400).render('login', { error: 'Invalid email or password' });
      }

      // Compare the password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).render('login', { error: 'Invalid email or password' });
      }

      res.redirect('./home');
    } catch (error) {
      console.error(error);
      res.status(500).render('login', { error: 'Server error. Please try again later.' });
    }
  };
  signUp = async (req, res, next) => {
    try {
      const { username, email, password } = req.body;

      const passwordHash = await bcrypt.hash(password, 10);
  
      // Validate the input (you can add more validation as needed)
      if (!username || !email || !password) {
        res.status(400).render('register', { error: 'All field required' });
      }
  
      // Create a new user
      const newUser = new Customer({ name: username, email, password: passwordHash });
  
      // Save the user to the database
      await newUser.save();
  
      // Redirect to a success page or login page
      res.redirect('./login');
    } catch (error) {
      console.error(error);
      res.status(500).render('register', { error: 'Server error. Please try again later.' });
    }
  };
}
module.exports = new AccessController();
