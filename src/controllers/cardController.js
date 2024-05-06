import { StatusCodes } from 'http-status-codes'
import { cardService } from '~/services/cardService'
import { columnModel } from '~/models/columnModel'

const createNew = async (req, res, next) => {
  try {
    const createdCard = await cardService.createNew(req.body)
    res.status(StatusCodes.CREATED).json(createdCard)
  } catch (error) {
    next(error)
  }
}

const update = async (req, res, next) => {
  try {
    const updatedCard = await cardService.update(req.params.cardId, req.body)
    res.status(StatusCodes.OK).json(updatedCard)
  } catch (error) {
    next(error)
  }
}

const deleteItem = async (req, res, next) => {
  try {
    const cardId = req.params.cardId
    const boardId = req.body.boardId // Lấy boardId từ body
    const columnId = req.body.columnId // Lấy columnId từ body

    await cardService.deleteItem(cardId) // Xóa thẻ từ cardService
    await columnModel.deleteCardFromColumn(boardId, columnId, cardId) // Xóa ID của thẻ khỏi mảng cardOrderIds của cột

    res.status(StatusCodes.OK).json({ message: 'Xóa thẻ thành công' }) // Trả về thông báo thành công
  } catch (error) {
    next(error)
  }
}


export const cardController = {
  createNew,
  update,
  deleteItem
}