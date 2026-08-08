const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET;
const blacklist = new Set();

function getToken(req) {
  const bearer = req.headers.authorization;
  if (bearer && bearer.startsWith('Bearer ')) return bearer.slice(7).trim();
  return req.cookies?.token ?? null;
}

module.exports = {
  verify: (token) => jwt.verify(token, secret),
  getToken,

  authenticate: (req, res, next) => {
    const token = getToken(req);
    if (!token) return res.status(401).json({ message: 'Missing or invalid token' });
    if (blacklist.has(token)) return res.status(401).json({ message: 'Token has been revoked' });
    try {
      req.user = jwt.verify(token, secret);
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  },

  verifyToken: (req, res, next) => {
    const token = req.cookies?.token;
    if (!token) return res.redirect('/');
    if (blacklist.has(token)) return res.redirect('/');
    try {
      req.user = jwt.verify(token, secret);
      next();
    } catch (err) {
      return res.redirect('/');
    }
  },

  requireRole: (roles) => {
    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    return (req, res, next) => {
      if (!req.user) return res.redirect('/auth/login');
      if (!allowedRoles.includes(req.user.role)) return res.redirect('/auth/login');
      next();
    };
  },

  requireRoleApi: (roles) => {
    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    return (req, res, next) => {
      if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
      if (!allowedRoles.includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' });
      next();
    };
  },

  redirectIfAuthenticated: (req, res, next) => {
    const token = req.cookies?.token;
    if (!token) return next();
    if (blacklist.has(token)) return next();
    try {
      jwt.verify(token, secret);
      return res.redirect('/');
    } catch (err) {
      return next();
    }
  },

  /**
   * ตรวจสอบ JWT token และ type ของ user สำหรับ frontend route
   * ถ้าไม่ตรงกับ types ที่กำหนด จะ redirect ไปยัง redirectTo
   */
  verifyType: (types, redirectTo = '/') => {
    const allowedTypes = Array.isArray(types) ? types : [types];
    return (req, res, next) => {
      const token = req.cookies?.token;
      if (!token) return res.redirect(redirectTo);
      if (blacklist.has(token)) return res.redirect(redirectTo);
      try {
        const decoded = jwt.verify(token, secret);
        if (!allowedTypes.includes(decoded.type)) return res.redirect(redirectTo);
        req.user = decoded;
        next();
      } catch (err) {
        return res.redirect(redirectTo);
      }
    };
  },

  /**
   * ตรวจสอบ JWT token และ type ของ user สำหรับ API route
   */
  requireType: (types) => {
    const allowedTypes = Array.isArray(types) ? types : [types];
    return (req, res, next) => {
      const token = getToken(req);
      if (!token) return res.status(401).json({ message: 'Unauthorized' });
      if (blacklist.has(token)) return res.status(401).json({ message: 'Token has been revoked' });
      try {
        const decoded = jwt.verify(token, secret);
        if (!allowedTypes.includes(decoded.type)) return res.status(403).json({ message: 'Forbidden' });
        req.user = decoded;
        next();
      } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
      }
    };
  },

  revoke: (req, res, next) => {
    const token = getToken(req);
    if (token) blacklist.add(token);
    next();
  },
};
