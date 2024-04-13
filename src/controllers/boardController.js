import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const createNew = async (req, res, next) => {
  try {
    console.log(req.body)

    // Điều hướng dữ liệu sang tầng Service

    throw new ApiError(StatusCodes.BAD_GATEWAY, 'test error')
    // Có kết quả thì trả về phía Client
    // res.status(StatusCodes.CREATED).json({ message: 'POST from Validation: API create new board.' })
  } catch (error) {
    next(error)
    // Mã 500
    // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    //   errors: error.message
    // })
  }
}

export const boardController = {
  createNew
}