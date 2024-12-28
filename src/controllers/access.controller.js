"use strict";

const AccessService = require("../services/access.service");
const bcrypt = require("bcrypt");
const path = require("path");
class AccessController {
  getRegister = async (req, res) => {
    const avatar = await AccessService.getAvatar(req.session.userId);
    return res.render("register.ejs", { avatar });
  };
  logOut = function (req, res, next) {
    console.log("Session ID (req.sessionID):", req.sessionID);
    console.log("Cookie (connect.sid):", req.cookies["connect.sid"]); // ID từ cookie

    req.logout(function (err) {
      if (err) return next(err);

      req.session.destroy((err) => {
        if (err) {
          console.error("Error destroying session:", err);
          return next(err);
        }

        for (let cookie in req.cookies) {
          if (req.cookies.hasOwnProperty(cookie)) {
            res.clearCookie(cookie, { path: "/" });
          }
        }
        res.redirect("/login");
      });
    });
  };
  getLogin = async (req, res) => {
    const error = req.session.error ? req.session.error : null;
    delete req.session.error;
    const avatar = await AccessService.getAvatar(req.session.userId);
    res.render("login.ejs", { avatar, error });
  };
  login = (req, res, next) => {
    req.session.regenerate((err) => {
      if (err) {
        console.log("Error regenerating session:", err);
        return next(err);
      }

      passport.authenticate("local", (err, user, info) => {
        if (err) {
          return next(err);
        }
        if (!user) {
          req.session.error = info.message;
          return res.redirect("/login");
        }
        req.logIn(user, (err) => {
          if (err) {
            return next(err);
          }
          req.session.userId = user._id; // Store user ID in session
          return res.redirect("/home");
        });
      })(req, res, next);
    });
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
        return res
          .status(400)
          .render("register", { avatar, error: result.message });
      }
    } catch (error) {
      const avatar = await AccessService.getAvatar(req.session.userId);
      return res.status(error.status).json({ error: error.message });
    }
  };
  verifyEmail = async (req, res, next) => {
    const { email, verificationToken } = req.body;
    console.log("verify", email, verificationToken);
    try {
      await AccessService.verifyEmail(email, verificationToken);
      return res.status(200).json({ message: "Email verified successfully" });
    } catch (error) {
      console.log("verify controller:", error, error.status, error.message);
      return res.status(error.status).json({ error: error.message });
    }
  };
  getProfile = async (req, res) => {
    try {
      const user = await AccessService.getUserById(req.session.userId);
      const avatar = await AccessService.getAvatar(req.session.userId);
      return res.render("profile.ejs", {
        page: "profile",
        avatar,
        user: user,
        isAuthenticated: req.isAuthenticated(),
      });
    } catch (error) {
      res.redirect("/home");
    }
  };

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
            return res.status(500).json({ error: "Failed to upload avatar" });
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

      res.redirect("/profile"); // Redirect to profile page after update
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update profile" });
    }
  };

  getChangePassword = async (req, res) => {
    const avatar = await AccessService.getAvatar(req.session.userId);
    return res.render("change-password.ejs", {
      page: "change-password",
      avatar,
      error: null,
      isAuthenticated: req.isAuthenticated(),
    });
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
        return res.status(400).render("change-password.ejs", {
          page: "change-password",
          avatar,
          error: "Old password is incorrect",
          isAuthenticated: req.isAuthenticated(),
        });
      }

      // Validate new passwords
      if (password !== confirmPassword) {
        return res.status(400).render("change-password.ejs", {
          page: "change-password",
          avatar,
          error: "New passwords do not match",
          isAuthenticated: req.isAuthenticated(),
        });
      }

      // Update password
      user.password = await bcrypt.hash(password, 10);

      // Save the updated user
      await user.save();

      res.redirect("/profile"); // Redirect to profile page after password change
    } catch (error) {
      console.error(error);
      res.status(500).render("change-password.ejs", {
        page: "change-password",
        avatar,
        error: "Failed to change password",
        isAuthenticated: req.isAuthenticated(),
      });
    }
  };
}
module.exports = new AccessController();
