import jwt from 'jsonwebtoken'
import { config } from '../config/index.js'

export function verificationToken (req, res, next) {
  const token = req.headers.authorization
  const parsedToken = token.split('Bearer ')[1]
  
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized access.' });
  }
  try {
    const validToken = jwt.verify(parsedToken, config.jwtSecret);
    return validToken? next(): res.status(401).json({ message: 'Unauthorized access.' });
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized access.' });
  }
}