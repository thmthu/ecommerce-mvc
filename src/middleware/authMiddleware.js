const authMiddleware = (req, res, next) => {
    res.locals.isAuthenticated = req.session && req.session.userId;
    console.log("res.locals.isAuthenticated", res.locals.isAuthenticated);
    next();
};
  
module.exports = authMiddleware;