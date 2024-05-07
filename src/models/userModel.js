import Joi from 'joi'
import { ObjectId, ReturnDocument } from 'mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { GET_DB } from '~/config/mongodb'
import { USER_TYPES } from '~/utils/constants'
import { columnModel } from './columnModel'
import { cardModel } from './cardModel'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { boardModel } from './boardModel'

// Define Collection (Name & Schema)
const USER_COLLECTION_NAME = 'users'
const USER_COLLECTION_SCHEMA = Joi.object({
//   userId: Joi.string ().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  email: Joi.string().required().email().trim().strict(),
  password: Joi.string().required().min(6), // Set minimum password length
  username: Joi.string().required().alphanum().min(3).max(50), // Restrict username to alphanumeric characters
  displayName: Joi.string().optional().allow(Joi.string().empty()), // Allow empty string for displayName
  // avatar: Joi.string().optional().allow(Joi.string().empty()), // Allow empty string for avatar
  // role: Joi.string().optional().allow('', ...['client', 'admin', '...']), // Allow empty string or specific roles
  //   isActive: Joi.boolean().optional(), // Allow optional boolean for isActive
  // verifyToken: Joi.string().optional().allow(Joi.string().empty()), // Allow empty string for verifyToken
  boards: Joi.array().items(
    Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  ).default([]),

  createAt: Joi.date().timestamp('javascript').default(Date.now),
  updateAt: Joi.date().timestamp('javascript').default(null)
})

// Chỉ định ra những Fields mà chúng ta không muốn cho phép cập nhật trong hàm update()
const INVALID_UPDATE_FIELDS = ['_id', 'createAt']

const validateBeforeCreate = async (userData) => {
  return await USER_COLLECTION_SCHEMA.validateAsync(userData, { abortEarly: false })
}

const createNew = async (userData) => {
  try {
    const validateData = await validateBeforeCreate(userData)
    const createdBoard = await GET_DB().collection(USER_COLLECTION_NAME).insertOne(validateData)
    return createdBoard
  } catch (error) {
    throw new Error(error)
  }
}

const findOneById = async (userId) => {
  try {
    const result = await GET_DB().collection(USER_COLLECTION_NAME).findOne({
      _id: new ObjectId(userId)
    })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

// Query tổng hợp (aggregate) để lấy toàn bộ Columns và Cards thuộc về Board
const getDetails = async (userId) => {
  try {
    // Hiện tại hàm này giống hệt hàm findOneById, sẽ update phần aggregate () tiếp ở các video tiếp
    // const result = await GET_DB().collection(USER_COLLECTION_NAME).findOne({
    // const result = await GET_DB().collection(USER_COLLECTION_NAME).aggregate([
    //   { $match: {
    //     _id: new ObjectId(userId),
    //     _destroy: false
    //   } },
    // { $lookup: {
    //   from: boardModel.BOARD_COLLECTION_NAME,
    //   localField: '_id',
    //   foreignField: 'userId',
    //   as: 'ownerIds'
    // } }
    // ]).toArray()

    const user = await GET_DB().collection(USER_COLLECTION_NAME).findOne({ _id: new ObjectId(userId) })

    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
    }

    return user

    // return result[0] || null
  } catch (error) {
    throw new Error(error)
  }
}

const update = async (userId, updateData) => {
  try {
    // Lọc những field mà chúng ta không cho phép cập nhật linh tinh
    Object.keys(updateData).forEach(fieldName => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
        delete updateData[fieldName]
      }
    })

    // Đối với những dữ liệu liên quan ObjectId, sẽ biến đổi ở đây
    // if (updateData.columnOrderIds) {
    //   updateData.columnOrderIds = updateData.columnOrderIds.map(_id => (new ObjectId(_id)))
    // }

    const result = await GET_DB().collection(USER_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $set: updateData },
      { returnDocument: 'after' }
    )

    if (!result) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
    }

    return result
  } catch (error) {
    throw new Error(error)
  }
}

const deleteOneById = async (userId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const deletedUser = await GET_DB().collection(USER_COLLECTION_NAME).findOneAndDelete({ _id: new ObjectId(userId) })

    if (!deletedUser) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
    }

    return deletedUser
  } catch (error) {
    throw error
  }
}

const findByEmail = async (email) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const user = await GET_DB().collection(USER_COLLECTION_NAME).findOne({ email })
    return user
  } catch (error) {
    throw error
  }
}

const getAllUsers = async () => {
  try {
    const allUsers = await GET_DB().collection(USER_COLLECTION_NAME).find({}).toArray()
    return allUsers
  } catch (error) {
    throw new Error(error)
  }
}

export const userModel = {
  USER_COLLECTION_NAME,
  USER_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  getDetails,
  update,
  deleteOneById,
  findByEmail,
  getAllUsers
}