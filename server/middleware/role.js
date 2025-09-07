module.exports = function (roles = []) {
  if (typeof roles === 'string') roles = [roles];
  return (req, res, next) => {
    if (!roles.length || roles.includes(req.user.role)) {
      return next();
    }
    return res.status(403).json({ message: 'Forbidden: insufficient role' });
  };
};
