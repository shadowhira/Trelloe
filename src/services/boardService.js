import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { slugify } from '~/utils/formatters'

// Phần này sẽ đụng nhiều vào bất đồng bộ nên ta thêm async
const createNew = async (reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }

    // Gọi tới tằng Model để xử lý lưu bản ghi newBoard vào trong Database
    // ...

    // Làm thêm các xử lý logic khác với các Collection khác tùy đặc thù dự án ... Vv
    // Bắn email, notification về cho admin khi có 1 cái board mới dược tạo ... vv

    // Trả kết quả về, trong Service luôn phải có return, nếu không nó sẽ request liên tục
    return newBoard
  } catch (error) {
    throw error
  }
}

export const boardService = {
  createNew
}