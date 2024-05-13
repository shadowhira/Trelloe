import CloseIcon from '@mui/icons-material/Close'
import DashboardIcon from '@mui/icons-material/Dashboard'
import SearchIcon from '@mui/icons-material/Search'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import TextField from '@mui/material/TextField'
import axios from 'axios'
import { useEffect, useState } from 'react'

function SearchBar({ updateBoardUpdated }) {
  const [searchValue, setSearchValue] = useState('')
  const [boardList, setBoardList] = useState([])
  const [filteredBoardList, setFilteredBoardList] = useState([])
  const [userId, setUserId] = useState(null)

  const [boardUpdated, setBoardUpdated] = useState(false)

  // const [isFavorite, setIsFavorite] = useState(board.favorite)!isFavorite

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
    } catch (error) {
      console.log('Error fetching userId')
    }
  }

  useEffect(() => {
    // Gọi hàm API để lấy danh sách bảng khi component được render
    // const fetchBoardList = async () => {
    //   try {
    //     const boards = await fetchListBoardAPI()
    //     setBoardList(boards)
    //     setFilteredBoardList(boards)
    //   } catch (error) {
    //     console.error('Error fetching board list: ', error)
    //   }
    // }

    fetchUserId()
    // console.log(userId)
    // fetchListBoardAPI()
    if (userId) { // Kiểm tra xem userId đã có giá trị hay chưa
      // getListBoardByUserId(userId)
      fetch(`http://localhost:8017/v1/boards/userId/${userId}`)
        .then(res => res.json())
        .then(listBoard => {
          setBoardList(listBoard)
          // console.log('🐛: ➡️ useEffect ➡️ listBoard:', listBoard)
        })
        .catch(error => {
          console.error('Error fetching boards:', error)
        })
    }

    // fetchBoardList()
  }, [userId])

  const handleSearchChange = (e) => {
    const { value } = e.target
    setSearchValue(value)
    filterBoardList(value)
  }

  const filterBoardList = (searchText) => {
    const filteredList = boardList.filter((board) =>
      board.title.toLowerCase().includes(searchText.toLowerCase())
    )
    setFilteredBoardList(filteredList)
  }

  const clearSearch = () => {
    setSearchValue('')
    setFilteredBoardList([])
  }

  const handleOpenBoard = (boardId) => {
    // Chuyển hướng đến địa chỉ của bảng với boardId
    window.location.href = `/boards/${boardId}`
  }

  // const handleToggleFavorite = async () => {
  //   try {
  //     // Gọi API để cập nhật trạng thái "yêu thích" của board
  //     // Ví dụ: Sử dụng axios để gửi request POST tới backend
  //     console.log('🐛: ➡️ handleToggleFavorite ➡️ board._id:', board._id)
  //     const response = await axios.put(`http://localhost:8017/v1/boards/boardId/${board._id}`, {
  //       ...board,
  //       favorite: !isFavorite
  //     })

  //     // Nếu API trả về thành công, cập nhật trạng thái "yêu thích" của board trên frontend
  //     if (response.status === 200) {
  //       setIsFavorite(!isFavorite)
  //       // console.log('điiid')
  //       setBoardUpdated(true)
  //       updateBoardUpdated()
  //     }
  //     // console.log('🐛: ➡️ handleToggleFavorite ➡️ isFavorite:', isFavorite)
  //   } catch (error) {
  //     console.error('Error toggling favorite:', error)
  //   }
  // }

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
        <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
          <TextField
            id="outlined-search"
            label="Search..."
            type="text"
            size="small"
            value={searchValue}
            onChange={handleSearchChange}
            sx={{
              '& label': { color: 'white' },
              '& input': { color: 'white' },
              '& label.Mui-focused': { color: 'white' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'white' },
                '&:hover fieldset': { borderColor: 'white' },
                '&.Mui-focused fieldset': { borderColor: 'white' }
              }
            }}
            InputProps={{
              startAdornment: <SearchIcon sx={{ color: 'white', paddingRight: '5px' }}/>,
              endAdornment: (
                <IconButton
                  size="small"
                  sx={{ visibility: searchValue ? 'visible' : 'hidden', color: 'white' }}
                  onClick={clearSearch}
                >
                  <CloseIcon />
                </IconButton>
              )
            }}
          />
        </Box>
      </Box>
      {searchValue && (
        <Box sx={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 999, marginTop: 2 }}>
          <List sx={{ width: '100%', maxWidth: 500, bgcolor: '#f4f4f4', borderRadius: '8px', boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)' }} aria-label="search-results">
            {filteredBoardList.map((board) => (
              <ListItem
                disablePadding
                key={board._id}
                sx={{
                  transition: 'background-color 0.3s',
                  '&:hover': {
                    backgroundColor: '#e0e0e0'
                  }
                }}
              >
                <ListItemButton>
                  <IconButton >
                    <DashboardIcon sx = {{ color: 'black', backgroundColor: 'white' }} />
                  </IconButton>
                  <ListItemText
                    primary={board.title}
                    sx={{
                      color: '#333',
                      fontFamily: 'Arial, sans-serif',
                      fontWeight: 'bold',
                      fontSize: '16px',
                      paddingLeft: '8px'
                    }}
                    onClick={() => handleOpenBoard(board._id)}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

        </Box>
      )}
    </Box>
  )
}

export default SearchBar
