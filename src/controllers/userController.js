import { StatusCodes } from 'http-status-codes'
import { userService } from '~/services/userService'

const createNew = async (req, res, next) => {
  try {
    const createdUser = await userService.createNew(req.body)
    res.status(StatusCodes.CREATED).json(createdUser)
  } catch (error) {
    next(error)
  }
}

const update = async (req, res, next) => {
  try {
    const userId = req.params.id
    const updatedUser = await userService.update(userId, req.body)

    // Có kết quả thì trả về phía Client
    res.status(StatusCodes.OK).json(updatedUser)
  } catch (error) { next(error) }
}

const deleteItem = async (req, res, next) => {
  try {
    const userId = req.params.id
    const result = await userService.deleteItem(userId)

    res.status(StatusCodes.OK).json(result)
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
    res.status(StatusCodes.OK).json(allUsers)
  } catch (error) {
    next(error)
  }
}

export const userController = {
  createNew,
  update,
  deleteItem,
  getDetails,
  getAllUsers
}