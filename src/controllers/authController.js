import { StatusCodes } from 'http-status-codes'
import { authService } from '~/services/authService'
import { userService } from '~/services/userService'

const signup = async (req, res, next) => {
  try {
    const newUser = await userService.createNew(req.body)
    res.status(StatusCodes.CREATED).json(newUser)
  } catch (error) {
    next(error)
  }
}

const login = async (req, res, next) => {
  try {
    const { email, password, username } = req.body
    const accessToken = await authService.login(email, password, username)

    // Trả về người dùng Token
    res.status(StatusCodes.OK).json({ accessToken })
  } catch (error) {
    next(error)
  }
}

const logout = async (req, res, next) => {
  try {
    // Thực hiện các logic đăng xuất ở đây, chẳng hạn như hủy token của người dùng từ hệ thống.

    // Sau khi đăng xuất thành công, trả về thông báo hoặc mã trạng thái tùy chỉnh.
    res.status(StatusCodes.OK).json({ message: 'Logout successfully.' })
  } catch (error) {
    next(error)
  }
}

export const authController = {
  signup,
  login,
  logout
}
