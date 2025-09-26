export function adminAuth(req, res, next) {
  const { email, password } = req.body;
  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    return next();
  }
  return res.status(401).json({ error: 'Unauthorized: Invalid admin credentials' });
}
