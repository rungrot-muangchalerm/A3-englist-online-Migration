const jwtMiddleware = require('./jwt.middleware');

/**
 * Middleware สำหรับหน้า 1 Year Course
 * ตรวจสอบ JWT token และ redirect ถ้าไม่ใช่ 1yc user
 */

const verify1yc = jwtMiddleware.verifyType(['1yc'], '/');
const redirectIf1ycAuthenticated = (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) return next();
  try {
    const decoded = jwtMiddleware.verify(token);
    if (decoded.type === '1yc') {
      return res.redirect('/1yc');
    }
    return next();
  } catch (err) {
    return next();
  }
};

module.exports = {
  verify1yc,
  redirectIf1ycAuthenticated,
};
