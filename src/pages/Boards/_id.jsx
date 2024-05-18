// Board details page

import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import { mapOrder } from '~/utils/sorts'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'

import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import { Typography } from '@mui/material'
import axios from 'axios'
import { isEmpty } from 'lodash'
import { useNavigate, useParams } from 'react-router-dom'
import {
  checkAuthAPI,
  createNewCardAPI,
  createNewColumnAPI,
  deleteCardDetailsAPI,
  deleteColumnDetailsAPI,
  fetchBoardDetailsAPI,
  moveCardToDifferentColumnAPI,
  updateBoardDetailsAPI,
  updateColumnDetailsAPI
} from '~/apis'
import CategoryBar from '~/components/CategoryBar/CategoryBar'
import { generatePlaceholderCard } from '~/utils/formatters'
import { mockData } from '~/apis/mock-data'

function Board() {
  const [board, setBoard] = useState(null)
  let { boardId } = useParams()
  const [auth, setAuth] = useState(false)
  const navigate = useNavigate()
  const [isCategoryBarOpen, setCategoryBarOpen] = useState(false)
  axios.defaults.withCredentials = true

  useEffect(() => {
    // Check authentication on component mount
    checkAuthAPI()
      .then((res) => {
        if (res.status === 'Success' && res.role === 'user') {
          setAuth(true)
        } else {
          navigate('/login')
          setAuth(false)
        }
      })
      .catch(() => {
        navigate('/login')
        setAuth(false)
      })
  }, [navigate])

  useEffect(() => {
    // Tạm thời fix cứng boardId, phần nâng cao sẽ sử dụng react-router-dom để lấy chuẩn boardId từ URL
    // const boardId = '66211a046153d6ad75302de9'

    // Call API
    fetchBoardDetailsAPI(boardId).then(board => {
      // Sắp xếp thứ tự Column luôn từ đây để tránh lỗi (video 71)
      board.columns = mapOrder(board.columns, board.columnOrderIds, '_id')

      board.columns.forEach(column => {
        // (Sau khi F5 trang web) Xử lý vấn đề kéo thả vào một column rỗng bằng cách thêm một card display:none
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)]
          column.cardOrderIds = [generatePlaceholderCard(column)._id]
        }
        // Nếu column có card
        else {
          // Sắp xếp thứ tự Card luôn từ đây để tránh lỗi (video 71)
          column.cards = mapOrder(column.cards, column.cardOrderIds, '_id')
        }
      })
      setBoard(board)
    })
  }, [])

  // Function này có nhiệm vụ gọi API tạo mới Column và làm lại dữ liệu State Board
  const createNewColumn = async (newColumnData) => {
    const createdColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id
    })

    // (Khi tạo mới column và không dùng F5) Khi tạo column mới thì nó sẽ chưa có card, cần xử lý vẫn đề kéo thả vào một column rồng
    createdColumn.cards = [generatePlaceholderCard(createdColumn)]
    createdColumn.cardOrderIds = [generatePlaceholderCard(createdColumn)._id]

    // Cập nhật lại state board
    // Phía Front-end chúng ta phải tự làm đúng lại state data board (thay vì phải gọi lại apifetchBoardDetailsAPI)
    // Lưu ý: cách Làm này phụ thuộc vào tùy lựa chọn và đặc thù dự án, có nơi thì BE sẽ hỗ trợ trả về luôn
    // toàn bộ Board dù đây có là api tạo Column hay Card di chang nữa. => Luc nay FE se nhàn hơn.
    const newBoard = { ...board }
    newBoard.columns.push(createdColumn)
    newBoard.columnOrderIds.push(createdColumn._id)
    setBoard(newBoard)
  }

  // Function này có nhiệm vụ gọi API tạo mới Card và làm lại dữ liệu State Board
  const createNewCard = async (newCardData) => {
    const createdCard = await createNewCardAPI({
      ...newCardData,
      boardId: board._id
    })

    // Cập nhật lại state board
    // Phia Front-end chung ta phải tự lam dung lại state data board (thay vi phai goi lại api fetchBoardDetailsAPI)
    // Lưu ý: cách làm này phụ thuộc vào tùy lựa chọn và đặc thù dự án, có nơi thì BE sẽ hỗ trợ trả về Luôn
    // toàn bộ Board dừ đay có la api tạo Column hay Card đi chang nữa. > Luc nay FE se nhan hơn.
    const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find(column => column._id === createdCard.columnId)
    if (columnToUpdate) {
      // Nếu column rỗng: bản chất là đang chứa một cái placeholder card
      if (columnToUpdate.cards.some(card => card.FE_PlaceholderCard)) {
        columnToUpdate.cards = [createdCard]
        columnToUpdate.cardOrderIds = [createdCard._id]
      } else {
        // Ngược lại Column đã có data thì push vào cuối mảng
        columnToUpdate.cards.push(createdCard)
        columnToUpdate.cardOrderIds.push(createdCard._id)
      }
    }
    setBoard(newBoard)
  }

  // Func này có nhiệm vụ gọi API và xử lý khi kéo thả Column xong (giữ lại trạng thái, vị trí của card, column trước đó sau khi tạo mới column/card)
  // Chỉ cần gọi API để cập nhật mảng columnOrderIds của Board chứa nó (thay đổi vị trí trong mảng)
  const moveColumns = (dndOrderedColumns) => {
    // Update cho chuẩn dữ liệu state board
    const dndOrderedColumnsIds = dndOrderedColumns.map(column => column._id)
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    setBoard(newBoard)

    // Gọi API update board
    updateBoardDetailsAPI(newBoard._id, { columnOrderIds: dndOrderedColumnsIds })
  }

  // Khi di chuyển card trong cùng Column:
  // Chỉ cần gọi API để cập nhật mảng cardOrderIds của Column chứa nó (thay đổi vị trí trong mảng)
  const moveCardInTheSameColumn = (dndOrderedCards, dndOrderedCardIds, columnId) => {
    // Update cho chuẩn dữ liệu state board
    const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find(column => column._id === columnId)
    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards
      columnToUpdate.cardOrderIds = dndOrderedCardIds
    }
    setBoard(newBoard)

    // Gọi API update column
    updateColumnDetailsAPI(columnId, { cardOrderIds: dndOrderedCardIds })
  }

  /*
  * Khi di chuyển card sang Column khác:
  * B1: Cập nhật mảng cardOrderIds của Column ban đầu chứa nó (Hiều bản chất là xóa cái _id của Card ra khỏi mảng)
  * B2: Cập nhật mảng cardOrderIds của Column tiếp theo (Hiều bản chất là thêm _id của Card vào mảng)
  * B3: Cập nhật lại trường columnId mới của cái Card đã kéo
  * => Làm một API support riêng cho 3 bước trên
  */
  const moveCardToDifferentColumn = (currentCardId, prevColumnId, nextColumnId, dndOrderedColumns) => {
    // Update cho chuẩn dữ liệu state board
    const dndOrderedColumnsIds = dndOrderedColumns.map(column => column._id)
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    setBoard(newBoard)

    // Gọi API xử lý phía BE
    let prevCardOrderIds = dndOrderedColumns.find(column => column._id === prevColumnId)?.cardOrderIds
    // console.log(prevCardOrderIds)
    // Xử lý vấn đề khi kéo card cuối cùng ra khỏi column, column rỗng sẽ tự sinh ra placeholder card, cần xóa nó đi trước khi gửi lên BE để tránh lỗi id
    if (prevCardOrderIds[0].includes('placeholder-card')) prevCardOrderIds = []
    // console.log(prevCardOrderIds)

    // console.log(prevCardOrderIds)
    // console.log(dndOrderedColumns.find(column => column._id === prevColumnId)?.cardOrderIds)

    moveCardToDifferentColumnAPI({
      currentCardId,
      prevColumnId,
      prevCardOrderIds,
      nextColumnId,
      nextCardOrderIds: dndOrderedColumns.find(column => column._id === nextColumnId)?.cardOrderIds
    })
  }

  // Xử lý xóa một Column và Cards bên trong nó
  const deleteColumnDetails = (columnId) => {
    // Update cho chuẩn dữ liệu state board
    const newBoard = { ...board }
    newBoard.columns = newBoard.columns.filter(column => column._id !== columnId)
    newBoard.columnOrderIds = newBoard.columnOrderIds.filter(_id => _id !== columnId)
    setBoard(newBoard)

    // Gọi API xử lý phía BE
    deleteColumnDetailsAPI(columnId).then(res => {
      toast.success(res?.deleteResult)
    })
  }

  // Xử lý xóa một Card và CardOrderIds trên column chứa nó
  const deleteCardDetails = (cardId) => {
    // Tìm column chứa card cần xóa
    const updatedColumns = board.columns.map(column => {
      // Nếu column chứa card cần xóa
      if (column.cardOrderIds.includes(cardId)) {
        // Loại bỏ card cần xóa khỏi mảng cards của column
        column.cards = column.cards.filter(card => card._id !== cardId)
        // Loại bỏ id của card cần xóa khỏi mảng cardOrderIds của column
        column.cardOrderIds = column.cardOrderIds.filter(_id => _id !== cardId)
      }
      return column
    })

    // Cập nhật lại board với các thay đổi
    const newBoard = {
      ...board,
      columns: updatedColumns
    }

    // Cập nhật state của board
    setBoard(newBoard)

    // Gọi API xử lý phía BE (nếu cần)
    deleteCardDetailsAPI(cardId).then(res => {
      toast.success(res?.deleteResult)
    })
  }

  const updateColumnDetails = async (columnId, dataToUpdate) => {
    try {
      // Gọi API để cập nhật thông tin cột
      const response = await updateColumnDetailsAPI(columnId, dataToUpdate)

      // Kiểm tra xem API đã trả về dữ liệu mới cho cột hay không
      if (response) {
        // Sao chép dữ liệu cũ của bảng
        const updatedBoard = { ...board }

        // Tìm và cập nhật thông tin của cột trong bảng
        updatedBoard.columns = updatedBoard.columns.map(column => {
          if (column._id === columnId) {
            return {
              ...column,
              ...dataToUpdate // Cập nhật thông tin mới
            }
          }
          return column
        })

        // Cập nhật state của bảng với thông tin cột mới
        setBoard(updatedBoard)

        // Hiển thị thông báo cập nhật thành công
        toast.success('Column details updated successfully')
      } else {
        // Hiển thị thông báo lỗi nếu không thành công
        toast.error('Failed to update column details')
      }
    } catch (error) {
      // Hiển thị thông báo lỗi nếu có lỗi trong quá trình gọi API
      toast.error('Error updating column details: ' + error.message)
    }
  }

  if (!board) {
    return (
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2, width: '100vw',
        height:'100vh'
      }}>
        <CircularProgress />
        <Typography>Loading Content...</Typography>
      </Box>
    )
  }

  return (
    <Container disableGutters maxWidth={false}
      sx={{ height: (theme) => theme.trello.boardContentHeight, backgroundColor: 'primary.main' }}
    >
      <AppBar />
      <Box sx={{ display: 'flex' }}>
        <CategoryBar nameActive="Boards"/>
        <Box sx={{ width: '100%' }}>
          {/* <BoardBar board={mockData.board} /> */}
          <BoardBar board={board} />
          <BoardContent
            // board={mockData.board}
            board={board}
            createNewColumn={createNewColumn}
            createNewCard={createNewCard}
            moveColumns={moveColumns}
            moveCardInTheSameColumn={moveCardInTheSameColumn}
            moveCardToDifferentColumn={moveCardToDifferentColumn}
            deleteColumnDetails={deleteColumnDetails}
            deleteCardDetails={deleteCardDetails}
            updateColumnDetails={updateColumnDetails}
          />
        </Box>
      </Box>
    </Container>
  )
}

export default Board