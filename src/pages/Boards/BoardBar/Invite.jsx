import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { TextField } from '@mui/material'
import { fetchBoardDetailsAPI, getUserByIdAPI } from '~/apis'

function Invite({ board }) {
  const [showInput, setShowInput] = useState(false) // Kiểm soát việc hiển thị input
  const [email, setEmail] = useState('') // Lưu trữ email nhập vào
  const [invitee, setInvitee] = useState([])
  const [inviteeId, setInviteeId] = useState(null) // ID của người được mời
  const [userId, setUserId] = useState(null)
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Kiểm tra xem click có bên ngoài vùng chứa hay không
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowInput(false) // Ẩn khi click ra bên ngoài
      }
    }

    // Thêm trình nghe sự kiện để phát hiện click bên ngoài
    document.addEventListener('click', handleClickOutside)

    // Xóa trình nghe sự kiện khi component bị hủy
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, []) // Chỉ chạy một lần khi component được tạo

  // Trong React, bạn có thể lấy token từ cookie hoặc local storage
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
      return
    }
  }

  // Xử lý khi nút "Invite" được nhấp
  const handleInviteClick = async () => {
    setShowInput(true) // Hiển thị thanh input khi nhấp "Invite"
  }

  // Gọi API để lấy ID của người dùng theo email
  const fetchInviteeId = async () => {
    try {
      const response = await axios.get(`http://localhost:8017/v1/users/email?email=${email}`)
      setInviteeId(response.data._id) // Lấy ID từ phản hồi
    } catch (error) {
      toast.error('Error fetching invitee ID:', error.message)
    }
  }

  const fetchMemberIds = async () => {
    try {
      const response = await fetchBoardDetailsAPI(board._id)
      setInvitee([])
      // Tiếp tục lấy dữ liệu mới nếu cần
      response.ownerIds.map(async (item) => {
        const response = await getUserByIdAPI(item)
        const newInvitee = {
          username: response.username,
          avatar: response.avatar
        }
        setInvitee(prevInvitees => [...prevInvitees, newInvitee])
      })
    } catch (error) {
      console.error('Error fetching member details:', error)
    }
  }

  useEffect(() => {
    fetchMemberIds()
  }, [inviteeId])
  useEffect(() => {
    fetchUserId()
  }, [userId])

  const getUser = async () => {
    if (userId) {
      try {
        const user = await getUserByIdAPI(userId)
      } catch (err) {
        return
      }
    }
  }

  getUser()

  const handleSendInvite = async () => {
    // Lấy inviteeId trước khi gửi lời mời
    await fetchInviteeId()

    if (inviteeId && userId) {
      try {
        const response = await axios.post('http://localhost:8017/v1/invitation', {
          inviterId: userId, // ID của người dùng hiện tại
          inviteeId, // Sử dụng ID đã lấy
          type: 'board_invitation',
          boardInvitation: {
            boardId: board._id,
            status: 'pending'
          }
        })

        if (response.status === 201) {
          toast.success(`Invite ${email} success`)
          setEmail('')
        } else {
          toast.error(response.status.message)
          setEmail('')
        }
      } catch (error) {
        toast.error('Error sending invitation')
        setEmail('')
      }

      setShowInput(false) // Ẩn thanh input sau khi gửi
    }
  }

  return (
    <Box
      ref = {menuRef}
      sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
            size='small'
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Cập nhật email khi nhập
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
          />
          <Button variant="contained" onClick={handleSendInvite}>
            Send
          </Button>
        </Box>
      )}
      {/* Snackbar để thông báo kết quả */}
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
        {invitee.map((person, index) => (
          <Tooltip key={index} title={person.username}>
            <Avatar alt={person.username} src={person.avatar} />
          </Tooltip>
        ))}
        {/* <Tooltip title="user2">
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
        </Tooltip> */}
      </AvatarGroup>
    </Box>
  )
}
export default Invite