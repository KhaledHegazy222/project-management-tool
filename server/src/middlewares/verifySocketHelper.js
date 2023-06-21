/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');

exports.verifySocket = (socket, next) => {
  const { token } = socket.handshake.query;

  if (token == null) return next(new Error('Unauthorized'));

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, userId) => {
    if (err) return next(new Error('Unauthorized'));
    socket.join(`user: ${userId}`);
    next();
  });
};
