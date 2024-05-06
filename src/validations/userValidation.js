import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const createNew = async (req, res, next) => {

  const correctCondition = Joi.object({
    // userId: Joi.string ().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    email: Joi.string().required().email().trim().strict(),
    password: Joi.string().required().min(6), // Set minimum password length
    username: Joi.string().required().alphanum().min(3).max(50), // Restrict username to alphanumeric characters
    // displayName: Joi.string().optional().allow(Joi.string().empty()), // Allow empty string for displayName
    // avatar: Joi.string().optional().allow(Joi.string().empty()), // Allow empty string for avatar
    // role: Joi.string().optional().allow('', ...['client', 'admin', '...']), // Allow empty string or specific roles
    // isActive: Joi.boolean().optional() // Allow optional boolean for isActive
    // verifyToken: Joi.string().optional().allow(Joi.string().empty()), // Allow empty string for verifyToken
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

const update = async (req, res, next) => {
  // Lưu ý không dùng require() trong trường hợp update
  const correctCondition = Joi.object({
    // Nếu cần làm tính năng di chuyển Column sang Board khác thì mới cần thêm validate boardId
    // boardId: Joi.string ().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    username: Joi.string().required().alphanum().min(3).max(50),
    email: Joi.string().required().email().trim().strict(),
  })

  try {
    // Chỉ định abortEarly: false để trường hợp có nhiều lỗi validation thì trả về tất cả lỗi (video 52)
    await correctCondition.validateAsync(req.body, {
      abortEarly: false
    })

    next()
  } catch (error) {
    const errorMessage = new Error(error).message
    const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage)
    next(customError)
  }
}

const deleteItem = async (req, res, next) => {
  const correctCondition = Joi.object({
    id: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  })
  try {
    await correctCondition.validateAsync(req.params)
    next()
  } catch (error) {
    const errorMessage = new Error(error).message
    const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage)
    next(customError)
  }
}

const signup = async (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().required().email().trim().strict(),
    password: Joi.string().required().min(6), // Set minimum password length
    username: Joi.string().required().alphanum().min(3).max(50), // Restrict username to alphanumeric characters
  })

  try {
    await schema.validateAsync(req.body)
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.BAD_REQUEST, error.message))
  }
}

export const userValidation = {
  createNew,
  update,
  deleteItem,
  signup
}
