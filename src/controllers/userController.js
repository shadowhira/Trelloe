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

export const userController = {
  createNew,
  update,
  deleteItem
}