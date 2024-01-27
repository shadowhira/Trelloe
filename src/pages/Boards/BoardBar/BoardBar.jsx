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

function index({ board }) {
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
        <Chip
          sx={MENU_STYLES}
          icon={<DashboardIcon />}
          label={capitalizeFirstLetter(board?.title)}
          clickable
        />
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
        <Button
          variant="outlined"
          startIcon={<PersonAddIcon />}
          sx={{
            color: 'white',
            borderColor: 'white',
            '&:hover': { borderColor: 'white' }
          }}
        >
          Invite
        </Button>
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

export default index