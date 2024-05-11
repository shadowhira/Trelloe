import { Box, Typography, Link } from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'
import SecurityIcon from '@mui/icons-material/Security'
import AppBar from '~/components/AppBar/AppBar'

function UserBarItem({ icon: Icon, text, active }) {
  return (
    <Link
      sx={{
        textDecoration: 'none',
        width: '150px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        // color: (theme) => (theme.palette.mode === 'dark' ? '#fff' : '#333'),
        color: active ? '#1976d2' : 'inherit',
        borderBottom: active ? '2px solid #1976d2' : 'none',
        height: '100%',
        '&:hover': {
          '& .text': {
            color: '#1976d2'
          },
          '& .icon': {
            color: '#1976d2'
          },
          cursor: 'pointer',
          borderBottom: '2px solid #1976d2'
        },
      }}
    >
      <Icon className="icon" />
      <Typography
        className="text"
        sx={{
          fontSize: '16px',
          ml: '4px'
        }}
      >{text}</Typography>
    </Link>
  )
}

function UserBar({ activeText, handleTabChange }) {
  return (
    <Box
      sx={{
        display: 'flex',
        height: '70px',
        width: '100%',
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495E' : '#fff'),
        boxShadow: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px'
      }}
    >
      <UserBarItem
        icon={PersonIcon}
        text="Account"
        active={activeText === 'Account'}
        onClick={() => handleTabChange('Account')}
      />
      <UserBarItem
        icon={SecurityIcon}
        text="Security"
        active={activeText === 'Security'}
        onClick={() => handleTabChange('Security')}
      />
    </Box>
  )
}

export default UserBar