const jwt = require('jsonwebtoken');

// eslint-disable-next-line consistent-return
exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  // eslint-disable-next-line consistent-return
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, userId) => {
    if (err) return res.sendStatus(403);
    req.userId = userId;
    next();
  });
};

exports.generateAccessToken = (userId) => jwt.sign(userId, process.env.ACCESS_TOKEN_SECRET);
