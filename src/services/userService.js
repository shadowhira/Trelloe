/* eslint-disable no-useless-catch */
import { userModel } from '~/models/userModel'
import { cardModel } from '~/models/cardModel'
import { boardModel } from '~/models/boardModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'

// Phần này sẽ đụng nhiều vào bất đồng bộ nên ta thêm async
const createNew = async (reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const newUser = {
      ...reqBody
    }

    const createdUser = await userModel.createNew(newUser)
    const getNewUser = await userModel.findOneById(createdUser.insertedId)

    return getNewUser
  } catch (error) {
    throw error
  }
}

const update = async (userId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }
    const updatedUser = await userModel.update(userId, updateData)

    return updatedUser
  } catch (error) { throw error }
}

const deleteItem = async (userId) => {
  try {
    const targetUser = await userModel.findOneById(userId)
    if (!targetUser) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found!')
    }

    // Xóa cái id owner trong board tương ứng

    // Xóa user
    await userModel.deleteOneById(userId)

    return { deleteResult: `User ${targetUser.username} deleted successfully!` }
  } catch (error) { throw error }
}

const getDetails = async (userId) => {
  try {
    const user = await userModel.getDetails(userId)
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
    }
    return user
  } catch (error) {
    throw error
  }
}

export const userService = {
  createNew,
  update,
  deleteItem,
  getDetails
}