import { cardModel } from '~/models/cardModel'
import { columnModel } from '~/models/columnModel'

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
    await cardModel.deleteOneById(cardId)
  } catch (error) {
    throw new Error(error)
  }
}


export const cardService = {
  createNew,
  update,
  deleteItem
}