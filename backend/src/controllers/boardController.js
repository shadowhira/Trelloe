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

const moveCardToDifferentColumn = async (req, res, next) => {
  try {
    const result = await boardService.moveCardToDifferentColumn(req.body)

    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }
}

const getListBoard = async (req, res, next) => {
  try {
    // Gọi tới service để lấy danh sách các board
    const boardList = await boardService.getListBoard()

    // Trả về danh sách board cho client
    res.status(StatusCodes.OK).json(boardList)
  } catch (error) {
    next(error)
  }
}

const deleteBoard = async (req, res, next) => {
  try {
    const boardId = req.params.id
    const result = await boardService.deleteBoard(boardId)

    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }
}

const getListBoardByUserId = async (req, res, next) => {
  try {
    const userId = req.params.userId // Lấy userId từ tham số URL

    const boardList = await boardService.getListBoardByUserId(userId)

    res.status(StatusCodes.OK).json(boardList) // Trả về danh sách các bảng
  } catch (error) {
    next(error) // Xử lý lỗi bằng middleware
  }
}

export const boardController = {
  createNew,
  getDetails,
  update,
  moveCardToDifferentColumn,
  getListBoard,
  deleteBoard,
  getListBoardByUserId
}