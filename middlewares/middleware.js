const jwt = require('jsonwebtoken');
const SECRET_KEY = "NOTESAPI";

const verifyToken = (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (token) {
      token = token.split(' ')[1];
      console.log('Received token:', token);
      let user = jwt.verify(token, SECRET_KEY); // Use the actual SECRET_KEY variable
      console.log('Decoded user:', user);
      req.userId = user.userId;
    } else {
      return res.status(401).json({ message: 'Unauthorized user' });
    }
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized user' });
  }
};

module.exports = verifyToken;
