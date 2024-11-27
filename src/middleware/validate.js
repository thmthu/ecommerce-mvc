const Joi = require("joi");

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
});

const validateSignUp = (req, res, next) => {
  delete req.body.terms;
  const { error } = signUpValidationSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return res.status(400).render("register", { error: errorMessages.join(", ") });
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
});

const validateSignIn = (req, res, next) => {
  delete req.body.terms;
  const { error } = signInValidationSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return res.status(400).render("login", { error: errorMessages.join(", ") });
  }
  next();
};
module.exports = { validateSignUp, validateSignIn };
