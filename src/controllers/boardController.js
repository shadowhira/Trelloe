import { StatusCodes } from 'http-status-codes'
import { boardService } from '~/services/boardService'

const createNew = async (req, res, next) => {
  try {
    // console.log(req.body)

    // Điều hướng dữ liệu sang tầng Service
    const createdBoard = await boardService.createNew(req.body)

    // Có kết quả thì trả về phía Client
    res.status(StatusCodes.CREATED).json(createdBoard)
  } catch (error) {
    next(error)
    // Mã 500
    // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    //   errors: error.message
    // })
  }
}

const getDetails = async (req, res, next) => {
  try {
    const boardId = req.params.id

    // Điều hướng dữ liệu sang tầng Service
    // Sau này ở khóa Advance sẽ có thêm userId nữa để chỉ lấy board thuộc về user đó chằng hạn...
    const board = await boardService.getDetails(boardId)

    // Có kết quả thì trả về phía Client
    res.status(StatusCodes.OK).json(board)
  } catch (error) { next(error) }
}

const update = async (req, res, next) => {
  try {
    const boardId = req.params.id
    const updatedBoard = await boardService.update(boardId, req.body)

    // Có kết quả thì trả về phía Client
    res.status(StatusCodes.OK).json(updatedBoard)
  } catch (error) { next(error) }
}

export const boardController = {
  createNew,
  getDetails,
  update
}