import jwt from 'jsonwebtoken'
import { config } from '../config/index.js'

export function verificationToken (req, res, next) {
  const token = req.headers.authorization
  
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized access.' });
  }
  const parsedToken = token.split('Bearer ')[1]
  try {
    const validToken = jwt.verify(parsedToken, config.jwtSecret);
    return validToken? next(): res.status(401).json({ message: 'Unauthorized access.' });
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized access.' });
  }
}

export function isAdmin (req, res, next) {
  const token = req.headers.authorization
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized access.' });
  }
  const parsedToken = token.split('Bearer ')[1]
  try {
    const validToken = jwt.verify(parsedToken, config.jwtSecret);
    if (validToken.role === "admin" ) {
      return next()
    }
    return res.status(401).json({ message: 'Unauthorized access.' });
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized in access.' });
  }
}