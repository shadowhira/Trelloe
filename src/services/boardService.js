import { slugify } from '~/utils/formatters'
import { boardModel } from '~/models/boardModel'
import { columnModel } from '~/models/columnModel'
import { cardModel } from '~/models/cardModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { clone, cloneDeep } from 'lodash'


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
    // console.log(getNewBoard)

    // Làm thêm các xử lý logic khác với các Collection khác tùy đặc thù dự án ... Vv
    // Bắn email, notification về cho admin khi có 1 cái board mới dược tạo ... vv

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

export const boardService = {
  createNew,
  getDetails,
  update,
  moveCardToDifferentColumn
}