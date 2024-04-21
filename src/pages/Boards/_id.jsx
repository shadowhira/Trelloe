// Board details page
import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
// import { mockData } from '~/apis/mock-data'
import { useEffect, useState } from 'react'

import {
  fetchBoardDetailsAPI,
  createNewColumnAPI,
  createNewCardAPI,
  updateBoardDetailsAPI
} from '~/apis'
import { generatePlaceholderCard } from '~/utils/formatters'
import { isEmpty } from 'lodash'

function Board() {
  const [board, setBoard] = useState(null)

  useEffect(() => {
    // Tạm thời fix cứng boardId, phần nâng cao sẽ sử dụng react-router-dom để lấy chuẩn boardId từ URL
    const boardId = '66211a046153d6ad75302de9'

    // Call API
    fetchBoardDetailsAPI(boardId).then(board => {
      board.columns.forEach(column => {
        // (Sau khi F5 trang web) Xử lý vấn đề kéo thả vào một column rỗng bằng cách thêm một card display:none
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)]
          column.cardOrderIds = [generatePlaceholderCard(column)._id]
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
      columnToUpdate.cards.push(createdCard)
      columnToUpdate.cardOrderIds.push(createdCard._id)
    }
    setBoard(newBoard)
  }

  // Func này có nhiệm vụ gọi API và xử lý khi kéo thả Column xong (giữ lại trạng thái, vị trí của card, column trước đó sau khi tạo mới column/card)
  const moveColumns = (dndOrderedColumns) => {
    const dndOrderedColumnsIds = dndOrderedColumns.map(column => column._id)

    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    setBoard(newBoard)

    // Gọi API update board
    updateBoardDetailsAPI(newBoard._id, { columnOrderIds: dndOrderedColumnsIds })
  }

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh', backgroundColor: 'primary.main' }}>
      <AppBar />
      <BoardBar board={board} />
      <BoardContent
        board={board}
        createNewColumn={createNewColumn}
        createNewCard={createNewCard}
        moveColumns={moveColumns}
      />
    </Container>
  )
}

export default Board