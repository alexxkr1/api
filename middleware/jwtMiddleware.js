const jwt = require('jsonwebtoken');

const dotenv = require('dotenv');

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

function verifyToken(req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: 'Authorization token is required' });
  }
  try {
    result = token.slice(7);
    console.log(result)
    const decoded = jwt.verify(result, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.log(err)
    return res.status(401).json({ message: 'Invalid token' });
  }
}

const checkUser = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: 'Authorization token is required' });
  }
  try {
    result = token.slice(7);
    console.log(result)
    const decoded = jwt.verify(result, process.env.JWT_SECRET);
    req.user = decoded;
    res.json(decoded.email);
    next();
  } catch (err) {
    console.log(err)
    return res.status(401).json({ message: 'Invalid token' });
  }
};


module.exports = verifyToken, checkUser;
