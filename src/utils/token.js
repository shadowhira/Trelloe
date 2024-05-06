/* eslint-disable no-useless-catch */
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '~/config/constants'

// Hàm tạo token
const generateAccessToken = (userId) => {
  const accessToken = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' })
  return accessToken
}

// Hàm xác thực token
const verifyAccessToken = (token) => {
  try {
    const decodedToken = jwt.verify(token, JWT_SECRET)
    return decodedToken
  } catch (error) {
    throw error
  }
}

export { generateAccessToken, verifyAccessToken }
