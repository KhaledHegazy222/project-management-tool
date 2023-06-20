/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');

exports.verifySocket = (socket, next) => {
  const { token, projectId } = socket.handshake.query;

  if (token == null) return next(new Error('Unauthorized'));
  if (projectId == null) return next(new Error('Bad Request'));

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err) => {
    if (err) return next(new Error('Unauthorized'));
    socket.projectId = projectId;
    socket.join(projectId);
    next();
  });
};
