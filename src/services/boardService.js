/* eslint-disable no-useless-catch */
import { slugify } from '~/utils/formatters'
import { boardModel } from '~/models/boardModel'
import { columnModel } from '~/models/columnModel'
import { cardModel } from '~/models/cardModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { clone, cloneDeep } from 'lodash'
import { invitationModel } from '~/models/invitationModel'
import { columnService } from './columnService'
import { userModel } from '~/models/userModel'


// Phần này sẽ đụng nhiều vào bất đồng bộ nên ta thêm async
const createNew = async (reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }

    // Gọi tới tằng Model để xử lý lưu bản ghi newBoard vào trong Database
    const createdBoard = await boardModel.createNew(newBoard)
    // console.log(createdBoard)

    // Lấy bản ghi board sau khi gọi (tùy mục đích dự án mà có cần bước này hoặc không)
    const getNewBoard = await boardModel.findOneById(createdBoard.insertedId)
    if (getNewBoard) {
      // Xử lý cấu trúc data ở đây trước khi trả dữ liệu về
      getNewBoard.columns = []

      // Cập nhật mảng columnOrderIds trong collection boards
      await userModel.pushBoardOrderIds(getNewBoard)
    }

    // Trả kết quả về, trong Service luôn phải có return, nếu không nó sẽ request liên tục
    return getNewBoard
  } catch (error) {
    throw error
  }
}

const getDetails = async (boardId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    // Gọi tới tằng Model để xử lý lưu bản ghi newBoard vào trong Database
    const board = await boardModel.getDetails(boardId)
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found!')
    }

    // Thay đổi CTDL board
    // responseBoard: cái Board (với CTDL khác) mà ta muốn trả về
    const resBoard = cloneDeep(board)
    // Đưa card về đúng column của nó
    resBoard.columns.forEach(column => {
      // Cách dùng .equals của mongoDB support cho việc so sánh ObjectId
      column.cards = resBoard.cards.filter(card => card.columnId.equals(column._id))

      // // Cách khác đơn giản là dùng toString để chuyển ObjectId về String và so sánh
      // column.cards = resBoard.cards.filter(card => card.columnId.toString() === column._id.toString())
    })

    // Xóa thằng cards trong Board ban đầu được tạo từ boardModel
    delete resBoard.cards

    // Trả kết quả về, trong Service luôn phải có return, nếu không nó sẽ request liên tục
    return resBoard
  } catch (error) { throw error }
}

const update = async (boardId, reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }
    const updatedBoard = await boardModel.update(boardId, updateData)

    return updatedBoard
  } catch (error) { throw error }
}

const moveCardToDifferentColumn = async (reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    // * Khi di chuyển card sang Column khác:
    // * B1: Cập nhật mảng cardOrderIds của Column ban đầu chứa nó (Hiều bản chất là xóa cái _id của Card ra khỏi mảng)
    await columnModel.update(reqBody.prevColumnId, {
      cardOrderIds: reqBody.prevCardOrderIds,
      updatedAt: Date.now()
    })

    // * B2: Cập nhật mảng cardOrderIds của Column tiếp theo (Hiều bản chất là thêm _id của Card vào mảng)
    await columnModel.update(reqBody.nextColumnId, {
      cardOrderIds: reqBody.nextCardOrderIds,
      updatedAt: Date.now()
    })


    // * B3: Cập nhật lại trường columnId mới của cái Card đã kéo
    await cardModel.update(reqBody.currentCardId, {
      columnId: reqBody.nextColumnId
    })

    return { updateResult: 'Successfully' }
  } catch (error) { throw error }
}

const getListBoard = async () => {
  // eslint-disable-next-line no-useless-catch
  try {
    // Gọi tới model để lấy danh sách các board từ database
    const boardList = await boardModel.getListBoard()

    return boardList
  } catch (error) {
    throw error
  }
}

const deleteCardsByBoardId = async (boardId) => {
  try {
    // Gọi phương thức xóa card từ cardModel
    await cardModel.deleteMany({ boardId: boardId })
  } catch (error) {
    throw error
  }
}

const deleteColumnsByBoardId = async (boardId) => {
  try {
    // Gọi phương thức xóa column từ columnModel
    await columnModel.deleteMany({ boardId: boardId })
  } catch (error) {
    throw error
  }
}

const getListBoardByUserId = async (userId) => {
  try {
    const boardList = await boardModel.getListBoardByUserId(userId)
    return boardList
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Error fetching boards by user ID: ${error.message}`);
  }
}

const deleteBoard = async (boardId) => {
  const targetBoard = await boardModel.findOneById(boardId)
  if (!targetBoard) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found!')
  }

  // Xóa các lời mời có boardId tương ứng
  await invitationModel.deleteManyItem(targetBoard._id)

  const columnOrderIds = targetBoard.columnOrderIds
  for (const columnId of columnOrderIds) {
    await columnService.deleteItem(columnId)
  }
  
  const memberIds = targetBoard.memberIds
  
  // await columnModel.deleteManyByBoardId(boardId)
  await boardModel.deleteOneById(boardId)

  // Xóa columnId trong mảng columnOrderIds của cái Board chứa nó
  await userModel.pullBoardOrderIds(targetBoard._id, targetBoard.userId)

  for (const memberId of memberIds) {
    await userModel.pullBoardOrderIds(targetBoard._id, memberId)
  }

  return { deleteResult: `Column ${targetBoard.title} deleted successfully!` }
}

export const boardService = {
  createNew,
  getDetails,
  update,
  moveCardToDifferentColumn,
  getListBoard,
  deleteCardsByBoardId,
  deleteColumnsByBoardId,
  deleteBoard,
  getListBoardByUserId
}