const Joi = require("joi");
const AccessService = require("../services/access.service");

const signUpValidationSchema = Joi.object({
  username: Joi.string().required().messages({
    "string.empty": "Username is required",
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Invalid email format",
  }),
  password: Joi.string().min(8).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 8 characters long",
  }),
  terms: Joi.boolean().valid(true).required().messages({
    "any.only": "You must accept the terms and conditions",
  }),
});

const validateSignUp = async (req, res, next) => {
  req.body.terms = req.body.terms === 'true' || req.body.terms === 'on';
  const avatar = await AccessService.getAvatar(req.session.userId);
  const { error } = signUpValidationSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return res.status(400).render("register", { avatar, error: errorMessages });
  }
  next();
};
const signInValidationSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Invalid email format",
  }),
  password: Joi.string().min(8).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 8 characters long",
  }),
  remember: Joi.boolean().optional(),
});

const validateSignIn = async (req, res, next) => {
  delete req.body.terms;
  const avatar = await AccessService.getAvatar(req.session.userId);
  const { error } = signInValidationSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return res.status(400).render("login", { avatar, error: errorMessages});
  }
  next();
};
module.exports = { validateSignUp, validateSignIn };
