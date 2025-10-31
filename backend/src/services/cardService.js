/* eslint-disable no-useless-catch */
import { cardModel } from '~/models/cardModel'
import { columnModel } from '~/models/columnModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'

// Phần này sẽ đụng nhiều vào bất đồng bộ nên ta thêm async
const createNew = async (reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const newCard = {
      ...reqBody
    }

    const createdCard = await cardModel.createNew(newCard)
    const getNewCard = await cardModel.findOneById(createdCard.insertedId)

    if (getNewCard) {
      // Cập nhật mảng cardOrderIds trong collection columns
      await columnModel.pushCardOrderIds(getNewCard)
    }

    return getNewCard
  } catch (error) {
    throw error
  }
}

const update = async (cardId, updateData) => {
  try {
    const updatedCard = await cardModel.update(cardId, updateData)
    return updatedCard
  } catch (error) {
    throw new Error(error)
  }
}

const deleteItem = async (cardId) => {
  try {
    const targetCard = await cardModel.findOneById(cardId)
    if (!targetCard) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Column not found!')
    }
    // Xóa card
    await cardModel.deleteOneById(cardId)

    const boardId = targetCard.boardId // Lấy boardId từ body
    const columnId = targetCard.columnId // Lấy columnId từ body
    await columnModel.deleteCardFromColumn(boardId, columnId, cardId) // Xóa ID của thẻ khỏi mảng cardOrderIds của cột

    return { deleteResult: `Card ${targetCard.title} deleted successfully!`, card: targetCard }
  } catch (error) {
    throw new Error(error)
  }
}

const deleteCardsByBoardId = async (boardId) => {
  try {
    // Gọi phương thức xóa card từ cardModel
    await cardModel.deleteMany(boardId)
  } catch (error) {
    throw error
  }
}


export const cardService = {
  createNew,
  update,
  deleteItem,
  deleteCardsByBoardId
}