import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import DashboardIcon from '@mui/icons-material/Dashboard'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import BoltIcon from '@mui/icons-material/Bolt'
import FilterList from '@mui/icons-material/FilterList'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { capitalizeFirstLetter } from '~/utils/formatters'
import { Alert, Snackbar, TextField } from '@mui/material'
import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

const MENU_STYLES = {
  color: 'white',
  bgcolor: 'transparent',
  border: 'none',
  paddingX: '5px',
  borderRadius: '4px',
  '.MuiSvgIcon-root': {
    color: 'white'
  },
  '&:hover': {
    bgcolor: 'primary.50'
  }
}

function BoardBar({ board }) {
  const [showInput, setShowInput] = useState(false) // Kiểm soát việc hiển thị input
  const [email, setEmail] = useState('') // Lưu trữ email nhập vào
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarSeverity, setSnackbarSeverity] = useState('info')
  const [inviteeId, setInviteeId] = useState(null); // ID của người được mời
  const [userId, setUserId] = useState(null);

  // Trong React, bạn có thể lấy token từ cookie hoặc local storage
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('token='))
    ?.split('=')[1];

  const fetchUserId = async () => {
    try {
      const response = await axios.get('http://localhost:8017/v1/authenticateToken/user-id', {
        headers: {
          Authorization: `Bearer ${token}` // Gửi token trong header
        }
      });
      setUserId(response.data.userId); // Lấy userId từ phản hồi
    } catch (error) {
      console.log('Error fetching userId:', error.message);
    }
  }


  // Xử lý khi nút "Invite" được nhấp
  const handleInviteClick = async () => {
    setShowInput(true); // Hiển thị thanh input khi nhấp "Invite"
  }

  // Gọi API để lấy ID của người dùng theo email
  const fetchInviteeId = async () => {
    try {
      const response = await axios.get(`http://localhost:8017/v1/users/email?email=${email}`)
      setInviteeId(response.data._id); // Lấy ID từ phản hồi
    } catch (error) {
      toast.error('Error fetching invitee ID:', error.message);
      setSnackbarMessage('Failed to find user by email.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true); // Mở Snackbar để thông báo lỗi
    }
  };

  const handleSendInvite = async () => {
    // Lấy inviteeId trước khi gửi lời mời
    await fetchInviteeId()
    await fetchUserId()

    if (inviteeId) {
      try {
        const response = await axios.post('http://localhost:8017/v1/invitation', {
          inviterId: userId, // ID của người dùng hiện tại
          inviteeId, // Sử dụng ID đã lấy
          type: 'board_invitation',
          boardInvitation: {
            boardId: board._id,
            status: 'pending'
          },
        })

        if (response.status === 201) {
          setSnackbarMessage(`Invite ${email} success`)
          setSnackbarSeverity('success')
          setEmail('')
          setSnackbarOpen(true)
        } else {
          setSnackbarMessage(response.status.message)
          setSnackbarSeverity('error')
          setEmail('')
          setSnackbarOpen(true)
        }
      } catch (error) {
        setSnackbarMessage('Error sending invitation')
        setSnackbarSeverity('error')
        setEmail('')
        setSnackbarOpen(true)
      }

      setShowInput(false) // Ẩn thanh input sau khi gửi
    }
  }
  return (
    <Box sx={{
      width: '100%',
      height: (theme) => theme.trello.boardBarHeight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2,
      paddingX: 2,
      overflowX: 'auto',
      backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#34495e': '#1976d2'),
      '&::-webkit-scrollbar-track': { m: 2 }
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Tooltip title={board?.description}>
          <Chip
            sx={MENU_STYLES}
            icon={<DashboardIcon />}
            label={capitalizeFirstLetter(board?.title)}
            clickable
          />
        </Tooltip>
        <Chip
          sx={MENU_STYLES}
          icon={<VpnLockIcon />}
          label={capitalizeFirstLetter(board?.type)}
          clickable
        />
        <Chip
          sx={MENU_STYLES}
          icon={<AddToDriveIcon />}
          label="Add To Google Drive"
          clickable
        />
        <Chip
          sx={MENU_STYLES}
          icon={<BoltIcon />}
          label="Automation"
          clickable
        />
        <Chip
          sx={MENU_STYLES}
          icon={<FilterList />}
          label="Filter"
          clickable
        />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {/* Các thành phần khác của BoardBar */}
        <Button
          variant="outlined"
          startIcon={<PersonAddIcon />}
          sx={{
            color: 'white',
            borderColor: 'white',
            '&:hover': { borderColor: 'white' }
          }}
          onClick={handleInviteClick} // Thêm sự kiện khi nhấp
        >
          Invite
        </Button>
        {/* Thanh input và nút "Send" sẽ xuất hiện bên dưới nút "Invite" */}
        {showInput && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TextField
              label="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Cập nhật email khi nhập
            />
            <Button variant="contained" onClick={handleSendInvite}>
              Send
            </Button>
          </Box>
        )}
        {/* Snackbar để thông báo kết quả */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000} // Thời gian hiển thị
          onClose={() => setSnackbarOpen(false)} // Đóng sau thời gian nhất định
        >
          <Alert severity={snackbarSeverity} onClose={() => setSnackbarOpen(false)}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
        <AvatarGroup
          sx={{
            gap: '10px',
            '& .MuiAvatar-root': {
              width: 34,
              height: 34,
              fontSize: 16,
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              '&:first-of-type': { bgcolor: '#a4b0be' }
            }
          }}
          max={7}
        >
          <Tooltip title="user1">
            <Avatar alt="user1" src="https://th.bing.com/th/id/OIP.xx5gHNyBR4UBbU5BBCCJnwHaHa?w=149&h=180&c=7&r=0&o=5&pid=1.7" />
          </Tooltip>
          <Tooltip title="user2">
            <Avatar alt="user1" src="https://th.bing.com/th/id/OIP.9UiNUGiIuhXpm6yyyurNGgHaFi?rs=1&pid=ImgDetMain" />
          </Tooltip>
          <Tooltip title="user3">
            <Avatar alt="Remy Sharp" src="https://th.bing.com/th/id/OIP.tTctGWDGFRkfYTO76U-u5wHaJ4?w=115&h=180&c=7&r=0&o=5&pid=1.7" />
          </Tooltip>
          <Tooltip title="user4">
            <Avatar alt="Remy Sharp" src="https://th.bing.com/th/id/R.37b39f4c2e4933a4691ecf22d5139458?rik=ONWOWuuSZ68qtw&pid=ImgRaw&r=0" />
          </Tooltip>
          <Tooltip title="user5">
            <Avatar alt="Remy Sharp" src="https://th.bing.com/th/id/OIP.4jrBI5GHa_mTqcdNwH-DHgHaES?w=312&h=181&c=7&r=0&o=5&pid=1.7" />
          </Tooltip>
          <Tooltip title="user1">
            <Avatar alt="user1" src="https://th.bing.com/th/id/OIP.xx5gHNyBR4UBbU5BBCCJnwHaHa?w=149&h=180&c=7&r=0&o=5&pid=1.7" />
          </Tooltip>
          <Tooltip title="user2">
            <Avatar alt="user1" src="https://th.bing.com/th/id/OIP.9UiNUGiIuhXpm6yyyurNGgHaFi?rs=1&pid=ImgDetMain" />
          </Tooltip>
          <Tooltip title="user3">
            <Avatar alt="Remy Sharp" src="https://th.bing.com/th/id/OIP.tTctGWDGFRkfYTO76U-u5wHaJ4?w=115&h=180&c=7&r=0&o=5&pid=1.7" />
          </Tooltip>
          <Tooltip title="user4">
            <Avatar alt="Remy Sharp" src="https://th.bing.com/th/id/R.37b39f4c2e4933a4691ecf22d5139458?rik=ONWOWuuSZ68qtw&pid=ImgRaw&r=0" />
          </Tooltip>
          <Tooltip title="user5">
            <Avatar alt="Remy Sharp" src="https://th.bing.com/th/id/OIP.4jrBI5GHa_mTqcdNwH-DHgHaES?w=312&h=181&c=7&r=0&o=5&pid=1.7" />
          </Tooltip>
        </AvatarGroup>
      </Box>
    </Box>
  )
}

export default BoardBar