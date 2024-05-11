import express from 'express'
import authenticateToken from '~/middlewares/authenticateToken'
import { StatusCodes } from 'http-status-codes'

const Router = express.Router()

// API để lấy userId từ token JWT
Router.get('/user-id', authenticateToken, (req, res) => {
  if (req.user) {
    res.status(StatusCodes.OK).json({ userId: req.user.userId }) // Trả lại userId
  } else {
    res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Unauthorized' }) // Nếu không có thông tin người dùng
  }
})

export const authenticateTokenRouter = Router