/* eslint-disable no-useless-catch */
import { userModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import bcrypt from 'bcrypt'

// Phần này sẽ đụng nhiều vào bất đồng bộ nên ta thêm async
const createNew = async (reqBody) => {
  try {
    // Check if the user already exists by email
    const existingUser = (await userModel.findByEmail(reqBody.email)) || null

    if (existingUser) {
      throw new ApiError(StatusCodes.CONFLICT, 'Email already exists')
    }

    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(reqBody.password.toString(), 10)

    // Prepare the new user data
    const newUser = {
      ...reqBody,
      password: hashedPassword
    }

    // Create the new user
    const createdUser = await userModel.createNew(newUser)

    // Fetch the newly created user to verify successful creation
    const getNewUser = await userModel.findOneById(createdUser.insertedId)

    if (!getNewUser) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'User creation failed!')
    }

    return getNewUser // Return the created user
  } catch (error) {
    // Return the error with an appropriate status code
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Error creating user: ${error.message}`)
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

const getAllUsers = async () => {
  try {
    const allUsers = await userModel.getAllUsers() // Bạn cần triển khai phương thức này trong `userModel`
    return allUsers
  } catch (error) {
    throw error
  }
}

const findByEmail = async (email) => {
  try {
    const user = await userModel.findByEmail(email) // Gọi hàm từ userModel
    if (!user) {
      throw new ApiError(404, `No user found with email: ${email}`) // Nếu không tìm thấy người dùng
    }
    return user // Trả về người dùng nếu tìm thấy
  } catch (error) {
    throw new ApiError(500, `Error finding user by email: ${error.message}`) // Xử lý lỗi
  }
}

export const userService = {
  createNew,
  update,
  deleteItem,
  getDetails,
  getAllUsers,
  findByEmail
}