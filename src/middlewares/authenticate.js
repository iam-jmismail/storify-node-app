const jwt = require("jsonwebtoken");
const { CONFIG } = require("../config/constants");

function authenticateJWT(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.sendUnAuthorizedResponse("Invalid token");
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' from the beginning of the token

  jwt.verify(token, CONFIG.JWT_SECRET_KEY, (err, payload) => {
    if (err) {
      return res.sendUnAuthorizedResponse("Session Expired");
    }
    req.user = {
      user_id: payload.session,
    }; // Attach the user data to the request object for further use
    next(); // Pass the request to the next middleware or route handler
  });
}

module.exports = authenticateJWT;
