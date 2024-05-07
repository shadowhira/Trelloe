// Boards list

import { Stack, Box, Typography, Link } from '@mui/material'
import AppBar from '~/components/AppBar/AppBar'
import CategoryBar from '~/components/CategoryBar/CategoryBar'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import {
  fetchListBoardAPI
} from '~/apis'
import { useEffect, useState } from 'react'

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

const BoardCardVisual = props => (
  <Box
    sx={{
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : '#fff'),
      boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
      borderRadius: '10px'
    }}
  >
    <Box
      sx={{
        height: '50px',
        bgcolor: props.color,
        borderTopLeftRadius: '10px', // Áp dụng bo tròn cho góc trên bên trái
        borderTopRightRadius: '10px' // Áp dụng bo tròn cho góc trên bên phải
      }}
    ></Box>
    <Typography
      sx={{
        fontSize: '16px',
        ml: '16px',
        mt: '12px',
        mb: '6px',
        fontWeight: '500'
      }}
    >
      {props.title}
    </Typography>
    <Typography
      sx={{
        fontSize: '12px',
        ml: '16px',
        mt: '6px',
        mb: '6px',
        fontWeight: '400'
      }}
    >
      {props.description}
    </Typography>
    <Link
      sx={{
        display: 'flex',
        alignItems: 'center',
        mt: '6px',
        mb: '12px',
        textDecoration: 'none',
        '&:hover': {
          color: (theme) => (theme.palette.mode === 'dark' ? '#1976d2' : '#1976d2'),
          cursor: 'pointer',
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#d5e9fe' : '#d5e9fe')
        }
      }}
      to={`/boards/${props.boardId}`} // Sử dụng to để chỉ định route muốn điều hướng tới
        // href={'facebook.com'} // Sử dụng to để chỉ định route muốn điều hướng tới
    >
      <span style={{ marginLeft: 'auto' }}>Go to board</span>
      <NavigateNextIcon style={{ marginLeft: '4px', marginRight: '8px' }}></NavigateNextIcon>
    </Link>
  </Box>
)

function BoardList() {
  const [listBoard, setListBoard] = useState([])

  useEffect(() => {
    fetch('http://localhost:8017/v1/boards')
      .then(res => res.json())
      .then(listBoard => {
        setListBoard(listBoard)
      })
      .catch(error => {
        // Xử lý lỗi nếu có
        console.error('Lỗi khi lấy dữ liệu:', error);
      })
  }, [])

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
              },
            }}
          >
            {listBoard && listBoard.length > 0 ? (
              listBoard.map(board => (
                <BoardCardVisual
                  key={board._id}
                  title={board.title}
                  description={board.description}
                  color={'white'}
                  boardId = { board._id }
                />
              ))
            ) : (
              <p>Không có dữ liệu</p>
            )}
          </Box>
        </Box>
      </Stack>
    </div>
  )
}

export default BoardList