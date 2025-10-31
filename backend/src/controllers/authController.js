import { StatusCodes } from 'http-status-codes'
import { authService } from '~/services/authService'
import { userService } from '~/services/userService'
import jwt from 'jsonwebtoken'

const signup = async (req, res, next) => {
  try {
    let newUser = await userService.createNew(req.body)
    newUser = {
      ...req.body,
      status: 'Success'
    }
    res.status(StatusCodes.CREATED).json(newUser)
  } catch (error) {
    next(error)
  }
}

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const { accessToken, role } = await authService.login(email, password, res)
    const status = 'Success'

    // Trả về người dùng Token
    res.status(StatusCodes.OK).json({ accessToken, status, role })
  } catch (error) {
    next(error)
  }
}

const logout = async (req, res, next) => {
  try {
    // Thực hiện các logic đăng xuất ở đây, chẳng hạn như hủy token của người dùng từ hệ thống.
    res.clearCookie('token', {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production' // Sử dụng secure trong môi trường production
    })
    // Sau khi đăng xuất thành công, trả về thông báo hoặc mã trạng thái tùy chỉnh.
    res.status(StatusCodes.OK).json({ status: 'Success', message: 'Logout successfully.' })
  } catch (error) {
    next(error)
  }
}

const checkAuth = async (req, res, next) => {
  try {
    if (!req.cookies) {
      // Nếu `req.cookies` là undefined
      return res.status(400).json({ error: 'Cookies are missing' })
    }
    const token = req.cookies.token
    if (!token) {
      // Nếu không có token, trả về mã trạng thái 401
      return res.status(401).json({ error: 'Bạn chưa xác thực' })
    }

    // Xác thực token với secret key
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        // Nếu token không hợp lệ hoặc có lỗi khi xác thực
        return res.status(401).json({ error: 'Token không hợp lệ' })
      }

      // Kiểm tra xem decoded có thuộc tính 'name' không
      if (!decoded.email) {
        return res.status(401).json({ error: 'Token không hợp lệ, thiếu thông tin cần thiết' })
      }

      // Đặt thông tin người dùng vào req để sử dụng ở các middleware tiếp theo
      req.email = decoded.email
      req.role = decoded.role

      // Tiếp tục đến middleware hoặc route tiếp theo
      next()
    })
    res.status(StatusCodes.OK).json({ status: 'Success', name: req.name, role: req.role })
  } catch (error) {
    next(error)
  }
}

export const authController = {
  signup,
  login,
  logout,
  checkAuth
}