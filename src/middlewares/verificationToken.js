import jwt from 'jsonwebtoken'
import { config } from '../config/index.js'

export function verificationToken (req, res, next) {
  const token = req.headers.authorization
  const tokenString = JSON.stringify(token)
console.log({token});
  if (!token) {
    console.error('Unauthorized access. Token not provided1.')
    // const response = formatApiResponse({ data: null, status: 401, message: 'Unauthorized access. Token not provided.' })
    // return res.status(response.status).json(response)
  }

  try {
    const validToken = jwt.verify(token, config.jwtSecret);
    console.log({validToken});
    next()
  } catch (error) {
    console.error('Unauthorized access. Token not provided: ', error)
    // const response = formatApiResponse({ data: null, status: 401, message: 'Unauthorized access. Token not provided.' })
    // return res.status(response.status).json(response)
  }
}