import Logout from '@mui/icons-material/Logout'
import PersonAdd from '@mui/icons-material/PersonAdd'
import Settings from '@mui/icons-material/Settings'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'
import axios from 'axios'
import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { checkLogoutAPI, getUserByIdAPI } from '~/apis'

function Profiles() {
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [avatar, setAvatar] = React.useState('')
  const open = Boolean(anchorEl)
  const [userId, setUserId] = React.useState(null)

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

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleAccount = () => {
    const newTab = window.open('/user', '_blank')
    if (newTab) {
      newTab.focus()
    } else {
      navigate('/user')
    }
  }

  const handleLogout = async () => {
    checkLogoutAPI()
      .then(res => {
        if (res.status === 'Success') {
          navigate('/login')
        } else {
          toast.error('Logout Failed!')
        }
      })
      .catch ( () => {
        toast.error('Logout failed. Please try again later.') // Thông báo lỗi
      })
  }

  const getAvatar = async () => {
    try {
      const response = await getUserByIdAPI(userId)
      setAvatar(response.avatar)

    } catch (err) {
      return
    }
  }
  React.useEffect(() => {
    fetchUserId()
    if (userId) getAvatar()
  }, [userId])


  return (
    <Box>
      <Tooltip title="Account settings">
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ padding: 0 }}
          aria-controls={open ? 'basic-menu-profiles' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <Avatar
            sx={{ width: 36, height: 36 }}
            src= {avatar}
          />
        </IconButton>
      </Tooltip>
      <Menu
        id="basic-menu-profiles"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button-profiles'
        }}
      >
        <MenuItem>
          <Avatar sx={{ width: 28, height: 28, mr: 2 }}/> Profile
        </MenuItem>
        <MenuItem onClick={handleAccount}>
          <Avatar sx={{ width: 28, height: 28, mr: 2 }}/> My account
        </MenuItem>
        <Divider />
        {/* <MenuItem>
          <ListItemIcon>
            <PersonAdd fontSize="small" />
          </ListItemIcon>
          Add another account
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem> */}
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

    </Box>
  )
}

export default Profiles