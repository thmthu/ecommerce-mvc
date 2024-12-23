"use strict";

const AccessService = require("../services/access.service");
const bcrypt = require("bcrypt");
const path = require("path");
class AccessController {
  getRegister = async (req, res) => {
    const avatar = await AccessService.getAvatar(req.session.userId);
    return res.render("register.ejs", { avatar});
  };
  getLogin = async (req, res) => {
    const avatar = await AccessService.getAvatar(req.session.userId);
    return res.render("login.ejs", { avatar});
  };

  signUp = async (req, res, next) => {
    try {
      const { username, email, password } = req.body;
      const result = await AccessService.signUp({
        name: username,
        email,
        password,
      });
      if (result.success) {
        return res.status(201).redirect("/login");
      } else {
        const avatar = await AccessService.getAvatar(req.session.userId);
        return res.status(400).render("register", { avatar, error: result.message });
      }
    } catch (error) {
      const avatar = await AccessService.getAvatar(req.session.userId);
      return res.status(500).render("register", { avatar, error: error });
    }
  };

  getProfile = async (req, res) => {
    try {
      const user = await AccessService.getUserById(req.session.userId);
      const avatar = await AccessService.getAvatar(req.session.userId);
      return res.render("profile.ejs", { page: "profile", avatar, user: user, isAuthenticated: req.isAuthenticated() });
    } catch (error) {
      res.redirect("/home");
    }
  }

  updateProfile = async (req, res) => {
    try {
      const userId = req.session.userId; // Assuming user is authenticated and user ID is available in req.user
      const { name, address, phone } = req.body;
      let avatar = null;

      // Check if a file was uploaded
      if (req.files && req.files.avatar) {
        const avatarFile = req.files.avatar;
        avatar = `avatar-${Date.now()}${path.extname(avatarFile.name)}`;
        const uploadPath = path.join(__dirname, "../views/img", avatar);

        // Move the file to the uploads directory
        avatarFile.mv(uploadPath, (err) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to upload avatar' });
          }
        });
      }

      // Find the user by ID
      const user = await AccessService.getUserById(userId);

      // Update user information
      if (name) user.name = name;
      if (address) user.address = address;
      if (phone) user.phone = phone;
      if (avatar) user.avatar = avatar;

      // Save the updated user
      await user.save();

      res.redirect('/profile'); // Redirect to profile page after update
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update profile' });
    }
  };

  getChangePassword = async (req, res) => {
    const avatar = await AccessService.getAvatar(req.session.userId);
    return res.render('change-password.ejs', {page: "change-password", avatar, error: null, isAuthenticated: req.isAuthenticated() });  
  };

  changePassword = async (req, res) => {
    try {
      const userId = req.session.userId; // Assuming user is authenticated and user ID is available in req.user
      const { oldPassword, password, confirmPassword } = req.body;

      // Find the user by ID
      const user = await AccessService.getUserById(userId);
      const avatar = await AccessService.getAvatar(req.session.userId);

      // Verify old password
      if (!(await bcrypt.compare(oldPassword, user.password))) {
        return res.status(400).render('change-password.ejs', { page: "change-password", avatar, error: 'Old password is incorrect', isAuthenticated: req.isAuthenticated() });
      }

      // Validate new passwords
      if (password !== confirmPassword) {
        return res.status(400).render('change-password.ejs', { page: "change-password", avatar, error: 'New passwords do not match', isAuthenticated: req.isAuthenticated() });
      }

      // Update password
      user.password = await bcrypt.hash(password, 10);

      // Save the updated user
      await user.save();

      res.redirect('/profile'); // Redirect to profile page after password change
    } catch (error) {
      console.error(error);
      res.status(500).render('change-password.ejs', { page: "change-password", avatar, error: 'Failed to change password', isAuthenticated: req.isAuthenticated() });
    }
  };
}
module.exports = new AccessController();
