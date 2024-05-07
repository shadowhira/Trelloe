import { Box, Typography } from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'
import SecurityIcon from '@mui/icons-material/Security'
function UserBarItem({ icon: Icon, text }) {
  return (
    <Box
      sx = {{
        width: '150px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        '&:hover': {
          '& .text': {
            color: '#1976d2'
          },
          '& .icon': {
            color: '#1976d2'
          },
          cursor:'pointer',
          borderBottom: '2px solid #1976d2'
        }
      }}
    >
      <Icon className = "icon" />
      <Typography
        className="text"
        sx = {{
          fontSize: '16px',
          ml: '4px'
        }}
      >{text}</Typography>
    </Box>
  )
}

function UserBar() {
  return (
    <Box
      sx = {{
        display: 'flex',
        height : '70px',
        width: '100%',
        boxShadow: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px'
      }}
    >
      <UserBarItem
        icon = {PersonIcon}
        text = "Account"
      />
      <UserBarItem
        icon = {SecurityIcon}
        text = "Security"
      />
    </Box>
  )
}

export default UserBar