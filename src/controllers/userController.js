import { StatusCodes } from 'http-status-codes'
import { userService } from '~/services/userService'
import ApiError from '~/utils/ApiError'

const createNew = async (req, res, next) => {
  try {
    const createdUser = await userService.createNew(req.body)
    res.status(StatusCodes.CREATED).json( { createdUser, status:'Success' } )
  } catch (error) {
    next(error)
  }
}

const update = async (req, res, next) => {
  try {
    const userId = req.params.id
    const updatedUser = await userService.update(userId, req.body)

    // Có kết quả thì trả về phía Client
    res.status(StatusCodes.OK).json({ updatedUser, status: 'Success' })
  } catch (error) { next(error) }
}

const deleteItem = async (req, res, next) => {
  try {
    const userId = req.params.id
    const result = await userService.deleteItem(userId)

    res.status(StatusCodes.OK).json({ result, status: 'Success' })
  } catch (error) { next(error) }
}

const getDetails = async (req, res, next) => {
  try {
    const userId = req.params.id

    // Điều hướng dữ liệu sang tầng Service
    // Sau này ở khóa Advance sẽ có thêm userId nữa để chỉ lấy user thuộc về user đó chằng hạn...
    const user = await userService.getDetails(userId)

    // Có kết quả thì trả về phía Client
    res.status(StatusCodes.OK).json(user)
  } catch (error) { next(error) }
}

const getAllUsers = async (req, res, next) => {
  try {
    const allUsers = await userService.getAllUsers()
    res.status(StatusCodes.OK).json({ users: allUsers, status: 'Success' })
  } catch (error) {
    next(error)
  }
}

const findByEmail = async (req, res, next) => {
  try {
    const { email } = req.query // Lấy email từ query parameters
    const user = await userService.findByEmail(email) // Gọi hàm trong userService

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' })
    }

    res.status(StatusCodes.OK).json(user) // Trả về người dùng nếu tìm thấy
  } catch (error) {
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Error finding user by email: ${error.message}`))
  }
}

const pushBoardToBoardOrderIds = async (req, res, next) => {
  try {
    const { userId, boardId } = req.body // Lấy userId và boardId từ req.body
    await userService.pushBoardToBoardOrderIds(userId, boardId)
    res.sendStatus(StatusCodes.OK)
  } catch (error) {
    next(error)
  }
}

const checkPassword = async (req, res, next) => {
  try {
    const userId = req.params.id
    const password = req.body.currentPassword
    await userService.checkPassword(userId, password)
    res.status(StatusCodes.OK).json({ status: 'Success' })
  } catch (error) {
    next(error)
  }
}

export const userController = {
  createNew,
  update,
  deleteItem,
  getDetails,
  getAllUsers,
  findByEmail,
  pushBoardToBoardOrderIds,
  checkPassword
}