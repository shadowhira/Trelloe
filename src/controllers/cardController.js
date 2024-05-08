import { StatusCodes } from 'http-status-codes'
import { cardService } from '~/services/cardService'
import { columnModel } from '~/models/columnModel'
import { cardModel } from '~/models/cardModel'

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
    const result = await cardService.deleteItem(cardId) // Xóa thẻ từ cardService

    res.status(StatusCodes.OK).json(result) // Trả về thông báo thành công
  } catch (error) {
    next(error)
  }
}


export const cardController = {
  createNew,
  update,
  deleteItem
}