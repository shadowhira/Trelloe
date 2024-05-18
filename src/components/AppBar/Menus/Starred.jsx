import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import StarIcon from '@mui/icons-material/Star'
import { ListItem } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import ListItemText from '@mui/material/ListItemText'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import axios from 'axios'
import * as React from 'react'
import { getListBoardByUserId, getUserIdByTokenAPI } from '../../../apis'


function Starred() {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)

  const [userId, setUserId] = React.useState(null)
  const [favoriteBoards, setFavoriteBoards] = React.useState([])
  const [boardList, setBoardList] = React.useState([])

  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('token='))
    ?.split('=')[1]

  const fetchUserId = async () => {
    try {
      const response = await getUserIdByTokenAPI({
        headers: {
          Authorization: `Bearer ${token}` // Gửi token trong header
        }
      })
      setUserId(response.userId) // Lấy userId từ phản hồi
      // console.log('🐛: ➡️ fetchUserId ➡️ response.data.userId:', userId)
    } catch (error) {
      console.log('Error fetching userId')
    }
  }

  React.useEffect(() => {
    fetchUserId()
  }, [])

  const handleClick = async (event) => {
    if (favoriteBoards.length > 0) setAnchorEl(event.currentTarget)

    // Lấy danh sách các board được đánh dấu là favorite khi click vào nút "Starred"
    try {
      // const userId = await fetchUserId() // Hàm này cần được định nghĩa trong file ~/apis hoặc ở nơi khác tương ứng
      // console.log(userId)
      if (userId) {
        try {
          const listBoard = await getListBoardByUserId(userId)
          setBoardList(listBoard)
          // console.log('🐛: ➡️ useEffect ➡️ listBoard:', listBoard)
          const filteredBoards = listBoard.filter(board => board.favorite)
          setFavoriteBoards(filteredBoards)
        } catch (error) {
          console.error('Error fetching boards:', error)
        }
      }
    } catch (error) {
      console.error('Error fetching favorite boards:', error)
    }
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleOpenBoard = (boardId) => {
    // Chuyển hướng đến địa chỉ của bảng với boardId
    window.location.href = `/boards/${boardId}`
  }

  return (
    <Box>
      <Button
        sx={{ color: 'white' }}
        id="basic-button-starred"
        aria-controls={open ? 'basic-menu-starred' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        endIcon={<ExpandMoreIcon />}
      >
        Starred
      </Button>
      <Menu
        id="basic-menu-starred"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button-starred'
        }}
      >
        {favoriteBoards.map((board) => (
          <MenuItem key={board._id}>
            <ListItem
              onClick={handleOpenBoard}
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}
            >
              <StarIcon sx={{ marginRight: 1 }} />
              <ListItemText primary={board.title}/>
            </ListItem>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  )
}

export default Starred