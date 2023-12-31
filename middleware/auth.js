const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  let token = req.header('Authorization');
  token = token && token.replace('Bearer ', '');

  if (!token) {
    return res.status(400).json({
      error: true,
      message: 'token is required!',
    });
  }

  try {
    const decode = jwt.verify(token, process.env.SECRET);
    req.user = decode;
  } catch (error) {
    return res.status(401).json({
      error: true,
      message: 'Invalid token',
    });
  }

  return next();
};

module.exports = auth;
