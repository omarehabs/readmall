const { unaAuthorizedError } = require("../utils/errorHandler");

async function isMe(req, res, next) {
  const tokenUserId = req.userId;
  const targetUserId = req.params.id;

  if (tokenUserId === targetUserId) {
    return next();
  }

  return unaAuthorizedError(res);
}

module.exports = isMe;
