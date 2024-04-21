import axios from 'axios'
import { API_ROOT } from '~/utils/constants'

/*
* Lưu ý: Đồi với việc sử dụng axios
* Tất cả các function bên dưới các bạn sẽ thấy mình chỉ request và lẩy data từ response luôn, mà không có try catch hay
then catch gì đề bắt lỗi.
* Lý do là vì ở phía Front-end chúng ta không cần thiết làm như vậy đồi với mọi request bởi nó sẽ gây ra việc
dư thừa code catch lỗi quá nhiều.
* Giải pháp Clean Code gọn gàng đó là chúng ta sẽ catch lỏi tập trung tại một nơi bằng cách tận dụng một thứ
cực kỳ mạnh mẽ trong axios đó là Interceptors
* Hiểu đơn giản Interceptors là cách mà chúng ta sẽ đánh chặn vào giữa request hoặc response để xử lý Logic mà
chúng ta muôn.
* (Và ở học phần MERN Stack Advance năng cao học trực tiếp mình sẽ dạy cực kỳ đầy đủ cách xử lý, áp dụng phần
này chuần chình cho các bạn. )
*/

/* Board */
// Hậu tố là API để đánh dấu
export const fetchBoardDetailsAPI = async (boardId) => {
  const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`)
  // Lưu ý: axios sẽ trả kết quả về qua property của nó là data
  return response.data
}

export const updateBoardDetailsAPI = async (boardId, updateData) => {
  const response = await axios.put(`${API_ROOT}/v1/boards/${boardId}`, updateData)
  // Lưu ý: axios sẽ trả kết quả về qua property của nó là data
  return response.data
}

/* Column */
export const createNewColumnAPI = async (newColumnData) => {
  const response = await axios.post(`${API_ROOT}/v1/columns`, newColumnData)
  return response.data
}

/* Cards */
export const createNewCardAPI = async (newCardData) => {
  const response = await axios.post(`${API_ROOT}/v1/cards`, newCardData)
  return response.data
}