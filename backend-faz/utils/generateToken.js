// utils/generateToken.js
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '1d', // ⏰ Expiry of 1 day
  });
};

export default generateToken;
