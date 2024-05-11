import Check from '@mui/icons-material/Check'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import StarIcon from '@mui/icons-material/Star'
import axios from 'axios'
import * as React from 'react'
import { getListBoardByUserId } from '~/apis'


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
      const response = await axios.get('http://localhost:8017/v1/authenticateToken/user-id', {
        headers: {
          Authorization: `Bearer ${token}` // Gửi token trong header
        }
      })
      setUserId(response.data.userId) // Lấy userId từ phản hồi
      // console.log('🐛: ➡️ fetchUserId ➡️ response.data.userId:', userId)
    } catch (error) {
      console.log('Error fetching userId')
    }
  }

  React.useEffect(() => {
    fetchUserId()
  }, [])

  const handleClick = async (event) => {
    setAnchorEl(event.currentTarget)

    // Lấy danh sách các board được đánh dấu là favorite khi click vào nút "Starred"
    try {
      // const userId = await fetchUserId() // Hàm này cần được định nghĩa trong file ~/apis hoặc ở nơi khác tương ứng
      // console.log(userId)
      if (userId) { // Kiểm tra xem userId đã có giá trị hay chưa
        // getListBoardByUserId(userId)
        await fetch(`http://localhost:8017/v1/boards/userId/${userId}`)
          .then(res => res.json())
          .then(listBoard => {
            setBoardList(listBoard)
            // console.log('🐛: ➡️ useEffect ➡️ listBoard:', listBoard)
          })
          .catch(error => {
            console.error('Error fetching boards:', error)
          })
        const filteredBoards = boardList.filter(board => board.favorite)
        setFavoriteBoards(filteredBoards)
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
          <MenuItem key={board._id} >
            <ListItemText onClick={handleOpenBoard}>
              <StarIcon />
              {board.title}
            </ListItemText>
          </MenuItem>
        ))}
        <Divider />
        {/* Các MenuItem khác (nếu có) */}
      </Menu>
    </Box>
  )
}

export default Starred