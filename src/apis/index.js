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

// Change api_root
let api_root = API_ROOT // http://localhost:8017
console.log('🐛: ➡️ api_root:', api_root)
// api_root = 'https://trello-api-z8ri.onrender.com'

/* Board */
// Hậu tố là API để đánh dấu
export const createNewBoarrdAPI = async (title, description, type) => {
  const response = await axios.post(`${api_root}/v1/boards/`, { title, description, type })
  // Lưu ý: axios sẽ trả kết quả về qua property của nó là data
  return response.data
}

export const fetchBoardDetailsAPI = async (boardId) => {
  const response = await axios.get(`${api_root}/v1/boards/${boardId}`)
  // Lưu ý: axios sẽ trả kết quả về qua property của nó là data
  return response.data
}

export const fetchListBoardAPI = async () => {
  const response = await axios.get(`${api_root}/v1/boards`)
  // Lưu ý: axios sẽ trả kết quả về qua property của nó là data
  return response.data
}

export const updateBoardDetailsAPI = async (boardId, updateData) => {
  const response = await axios.put(`${api_root}/v1/boards/${boardId}`, updateData)
  return response.data
}

export const moveCardToDifferentColumnAPI = async (updateData) => {
  const response = await axios.put(`${api_root}/v1/boards/supports/moving_card`, updateData)
  return response.data
}

/* Column */
export const createNewColumnAPI = async (newColumnData) => {
  const response = await axios.post(`${api_root}/v1/columns`, newColumnData)
  return response.data
}

export const updateColumnDetailsAPI = async (columnId, updateData) => {
  const response = await axios.put(`${api_root}/v1/columns/${columnId}`, updateData)
  // Lưu ý: axios sẽ trả kết quả về qua property của nó là data
  return response.data
}

export const deleteColumnDetailsAPI = async (columnId) => {
  const response = await axios.delete(`${api_root}/v1/columns/${columnId}`)
  // Lưu ý: axios sẽ trả kết quả về qua property của nó là data
  return response.data
}

/* Cards */
export const createNewCardAPI = async (newCardData) => {
  const response = await axios.post(`${api_root}/v1/cards`, newCardData)
  return response.data
}

export const deleteCardDetailsAPI = async (cardId) => {
  const response = await axios.delete(`${api_root}/v1/cards/${cardId}`)
  return response.data
}

/* Auth */
export const checkLoginAPI = async (email, password) => {
  const response = await axios.post(`${api_root}/v1/auth/login`, { email, password })
  return response.data
}

export const checkSignupAPI = async (email, password, username) => {
  const response = await axios.post(`${api_root}/v1/auth/signup`, { email, password, username })
  return response.data
}

export const checkAuthAPI = async () => {
  const response = await axios.get(`${api_root}/v1/auth/checkAuth`)
  return response.data
}