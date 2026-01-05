// middleware/requireRole.js
export const requireRole = (allowedRoles) => {
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  return (req, res, next) => {
    try {
      if (!req.user) return res.status(401).json({ ok: false, message: 'Not authenticated' });
      const userRole = req.user.role || '';
      if (!roles.includes(userRole)) {
        return res.status(403).json({ ok: false, message: 'Insufficient permissions' });
      }
      next();
    } catch (err) {
      console.error('requireRole error', err);
      res.status(500).json({ ok: false, message: 'Authorization failed' });
    }
  };
};
