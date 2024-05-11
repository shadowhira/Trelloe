// Boards list

import { Box, Stack, Typography } from '@mui/material'
import Pagination from '@mui/material/Pagination'
import { useEffect, useState } from 'react'
import AppBar from '~/components/AppBar/AppBar'
import BoardCardVisual from '~/components/BoardCardVisual/BoardCardVisual'
import CategoryBar from '~/components/CategoryBar/CategoryBar'

// const ListBoards = [
//   {
//     _id: 'board-id-01',
//     title: 'MERN Stack Board 1',
//     description: 'MERN stack Course 1',
//     color: 'red'
//   },
//   {
//     _id: 'board-id-02',
//     title: 'MERN Stack Board 2',
//     description: 'MERN stack Course 2',
//     color: 'blue'
//   },
//   {
//     _id: 'board-id-03',
//     title: 'MERN Stack Board 3',
//     description: 'MERN stack Course 3',
//     color: 'green'
//   },
//   {
//     _id: 'board-id-04',
//     title: 'MERN Stack Board 4',
//     description: 'MERN stack Course 4',
//     color: 'yellow'
//   },
//   {
//     _id: 'board-id-05',
//     title: 'MERN Stack Board 5',
//     description: 'MERN stack Course 5',
//     color: 'pink'
//   },
//   {
//     _id: 'board-id-06',
//     title: 'MERN Stack Board 6',
//     description: 'MERN stack Course 6',
//     color: 'orange'
//   }
// ]

function BoardList() {
  const [listBoard, setListBoard] = useState([])
  const [page, setPage] = useState(1)
  const boardsPerPage = 9 // Số lượng boards hiển thị trên mỗi trang

  const indexOfLastBoard = page * boardsPerPage
  const indexOfFirstBoard = indexOfLastBoard - boardsPerPage
  const currentBoards = listBoard.slice(indexOfFirstBoard, indexOfLastBoard)

  useEffect(() => {
    // fetchListBoardAPI()
    fetch('http://localhost:8017/v1/boards')
      .then(res => res.json())
      // .then(res => {
      //   console.log('🐛: ➡️ useEffect ➡️ res:', res.json())
      //   return res.json()
      // })
      .then(listBoard => {
        setListBoard(listBoard)
      })
      .catch(error => {
        // Xử lý lỗi nếu có
        console.error('Lỗi khi lấy dữ liệu:', error)
      })
  }, [listBoard])

  return (
    <div>
      <AppBar></AppBar>
      <Stack direction="row" justifyContent="space-between"
      >
        <CategoryBar
          nameActive="Boards"
        />
        <Box flex={5}
          sx={{
            pt: 2,
            pl: 5,
            pr: 5,
            bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495E' : '#fff')
          }}
        >
          <Typography variant="h6"
            sx={{
              fontSize: 40,
              mb: 5
            }}
          >
                        Your boards
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gap: '20px', // Khoảng cách giữa các thẻ
              '@media (min-width: 807px)': { // Thêm media query để điều chỉnh số cột trên mỗi hàng cho các kích thước màn hình lớn hơn 768px
                gridTemplateColumns: 'repeat(2, 1fr)' // Hiển thị 5 phần tử trên một hàng
              },
              '@media (min-width: 997px)': { // Thêm media query để điều chỉnh số cột trên mỗi hàng cho các kích thước màn hình lớn hơn 768px
                gridTemplateColumns: 'repeat(3, 1fr)' // Hiển thị 5 phần tử trên một hàng
              },
              '@media (min-width: 1221px)': { // Thêm media query để điều chỉnh số cột trên mỗi hàng cho các kích thước màn hình lớn hơn 992px
                gridTemplateColumns: 'repeat(4, 1fr)' // Hiển thị 4 phần tử trên một hàng
              },
              '@media (min-width: 1600px)': { // Thêm media query để điều chỉnh số cột trên mỗi hàng cho các kích thước màn hình lớn hơn 1200px
                gridTemplateColumns: 'repeat(5, 1fr)' // Hiển thị 3 phần tử trên một hàng
              }
            }}
          >
            {currentBoards.map(board => (
              <BoardCardVisual
                key={board._id}
                title={board.title}
                description={board.description}
                color={'white'}
                boardId={board._id}
                type={board.type}
              />
            ))}

          </Box>
          <Pagination
            count={Math.ceil(listBoard.length / boardsPerPage)}
            page={page}
            onChange={(event, value) => setPage(value)}
            sx={{ position: 'fixed', bottom: 0, right: 0, margin: '20px' }}
          />

        </Box>
      </Stack>
    </div>
  )
}

export default BoardList