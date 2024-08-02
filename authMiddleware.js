const jwt = require("jsonwebtoken");
require('dotenv').config()

exports.verifyToken = (req, res, next) => {
  try {
    const token = req.headers["authorization"]?.split(' ')[1];;

    if (!token) {
      const err = new Error("No token provided");
      err.statusCode = 401;
      throw err;
    }

    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
      if (error) {
        const err = new Error("Failed to authenticate token");
        err.statusCode = 500;
        throw err;
      }

      req.user = decoded;
      next();
    });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};
