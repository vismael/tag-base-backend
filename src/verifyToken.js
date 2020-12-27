// import config from './config';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

module.exports = async (req, res, next) => {
  const token = req.headers['x-access-token'];
  
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
  try {
    await jwt.verify(token, process.env.TOKEN_SECRET);
    next();
  } catch (error) {
    res.status(400).send('Invalid Token');
  }
}
