import { Box, Stack, Typography } from '@mui/material'
import Pagination from '@mui/material/Pagination'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  checkAuthAPI,
  getListBoardByUserId,
  getUserIdByTokenAPI
} from '~/apis'
import { mockData } from '~/apis/mock-data'
import AppBar from '~/components/AppBar/AppBar'
import BoardCardVisual from '~/components/BoardCardVisual/BoardCardVisual'
import CategoryBar from '~/components/CategoryBar/CategoryBar'

const ListBoard = mockData.boards

function getRandomColor() {
  const r = Math.floor(Math.random() * 256)
  const g = Math.floor(Math.random() * 256)
  const b = Math.floor(Math.random() * 256)
  const color = `rgb(${r}, ${g}, ${b})`
  return color
}

function BoardList() {
  const [listBoard, setListBoard] = useState([])
  const [userId, setUserId] = useState(null)
  const [page, setPage] = useState(1)
  const boardsPerPage = 8
  const gap = 20 // khoảng cách giữa các thẻ

  const indexOfLastBoard = page * boardsPerPage
  const indexOfFirstBoard = indexOfLastBoard - boardsPerPage
  const currentBoards = listBoard.slice(indexOfFirstBoard, indexOfLastBoard)
  const [auth, setAuth] = useState(false)
  const navigate = useNavigate()
  axios.defaults.withCredentials = true

  const [boardUpdated, setBoardUpdated] = useState(false)

  const updateBoardUpdated = () => {
    setBoardUpdated(prevState => !prevState)
  }

  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('token='))
    ?.split('=')[1]

  const fetchUserId = async () => {
    try {
      const response = await getUserIdByTokenAPI({
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setUserId(response.userId)
    } catch (error) {
      console.log('Error fetching userId')
    }
  }

  // useEffect(() => {
  //   checkAuthAPI()
  //     .then((res) => {
  //       if (res.status === 'Success') {
  //         setAuth(true)
  //       } else {
  //         navigate('/login')
  //         setAuth(false)
  //       }
  //     })
  //     .catch(() => {
  //       navigate('/login')
  //       setAuth(false)
  //     })
  // }, [navigate])

  useEffect(() => {
    fetchUserId()
    if (userId) {
      getListBoardByUserId(userId)
        .then(listBoard => {
          setListBoard(listBoard)
        })
        .catch(error => {
          console.error('Error fetching boards:', error)
        })
    }
  }, [userId, boardUpdated])

  const boardsPerRow = {
    807: 2,
    997: 3,
    1221: 4,
    1600: 5
  }

  return (
    <div>
      <AppBar updateBoardUpdated={updateBoardUpdated}></AppBar>
      <Box display="flex" flexDirection="row"
        sx={{
          minHeight: (theme) => `calc(${theme.trello.boardBarHeight} + ${theme.trello.boardContentHeight})`,
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495E' : '#fff')
        }}>
        <CategoryBar
          nameActive="Boards"
          boardCount={listBoard.length}
          boardsPerRow={boardsPerRow}
          gap={gap}
        />
        <Box
          flex={1}
          sx={{
            pt: 2,
            pl: 5,
            pr: 5,
            bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495E' : '#fff'),
            overflowY: 'auto',
            margin: '0 5px',
            '&::-webkit-scrollbar-track': { m: 2 },
            maxHeight: 'calc(100vh)' // Đặt chiều cao tối đa để có khoảng trống cho thanh cuộn
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
              gap: `${gap}px`,
              '@media (min-width: 807px)': {
                gridTemplateColumns: 'repeat(2, 1fr)'
              },
              '@media (min-width: 997px)': {
                gridTemplateColumns: 'repeat(3, 1fr)'
              },
              '@media (min-width: 1221px)': {
                gridTemplateColumns: 'repeat(4, 1fr)'
              },
              '@media (min-width: 1600px)': {
                gridTemplateColumns: 'repeat(5, 1fr)'
              }
            }}
          >
            {currentBoards.map(board => (
              <BoardCardVisual
                key={board._id}
                title={board.title}
                description={board.description}
                type={board.type}
                color={getRandomColor()}
                boardId={board._id}
                updateBoardUpdated={updateBoardUpdated} 
                board={board}
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
      </Box>
    </div>
  )
}

export default BoardList
