import { slugify } from '~/utils/formatters'
import { boardModel } from '~/models/boardModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'

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

    // Trả kết quả về, trong Service luôn phải có return, nếu không nó sẽ request liên tục
    return board
  } catch (error) { throw error }
}

export const boardService = {
  createNew,
  getDetails
}