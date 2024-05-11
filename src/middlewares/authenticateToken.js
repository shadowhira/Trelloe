import jwt from 'jsonwebtoken'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

// Middleware để xác thực JWT và gắn thông tin người dùng vào request
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'] // Lấy token từ header
  const token = authHeader && authHeader.split(' ')[1] // Tách token từ "Bearer <token>"

  if (!token) {
    return next(new ApiError(StatusCodes.UNAUTHORIZED, 'No token provided'))
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) // Giải mã token
    req.user = decoded // Gắn thông tin người dùng vào request
    next() // Tiếp tục
  } catch (error) {
    next(new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid token'))
  }
}

export default authenticateToken
