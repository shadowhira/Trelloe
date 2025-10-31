import DesignServicesIcon from '@mui/icons-material/DesignServices'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import SplitscreenIcon from '@mui/icons-material/Splitscreen'
import { Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import * as React from 'react'

function Templates() {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <Box>
      <Button
        sx={{ color: 'white' }}
        id="basic-button-templates"
        aria-controls={open ? 'basic-menu-templates' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        endIcon={<ExpandMoreIcon />}
      >
        Templates
      </Button>
      <Menu
        id="basic-menu-templates"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button-templates'
        }}
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <MenuItem sx={{ gap: 1 }}>
          <SplitscreenIcon />
          <a href="/boards/6642abf8f5ce444f1c33a836" style={{ textDecoration: 'none', color: (theme) => (theme.palette.mode === 'dark' ? '#fff' : '#000') }}>
            <Typography sx={{ color: (theme) => (theme.palette.mode === 'dark' ? '#fff' : '#000') }}>Phân chia công việc</Typography>
          </a>
        </MenuItem>
        <MenuItem sx={{ gap: 1 }}>
          <ManageAccountsIcon />
          <a href="/boards/6642b11ff5ce444f1c33a846" style={{ textDecoration: 'none', color: (theme) => (theme.palette.mode === 'dark' ? '#fff' : '#000') }}>
            <Typography sx={{ color: (theme) => (theme.palette.mode === 'dark' ? '#fff' : '#000') }}>Project Management</Typography>
          </a>
        </MenuItem>
        <MenuItem sx={{ gap: 1 }}>
          <DesignServicesIcon />
          <a href="/boards/6642b622f5ce444f1c33a850" style={{ textDecoration: 'none', color: (theme) => (theme.palette.mode === 'dark' ? '#fff' : '#000') }}>
            <Typography sx={{ color: (theme) => (theme.palette.mode === 'dark' ? '#fff' : '#000') }}>Design Huddle</Typography>
          </a>
        </MenuItem>
        <MenuItem sx={{ gap: 1 }}>
          <MenuBookIcon />
          <a href="/boards/6642b689f5ce444f1c33a856" style={{ textDecoration: 'none', color: (theme) => (theme.palette.mode === 'dark' ? '#fff' : '#000') }}>
            <Typography sx={{ color: (theme) => (theme.palette.mode === 'dark' ? '#fff' : '#000') }}>Dự án phần mềm</Typography>
          </a>
        </MenuItem>
      </Menu>
    </Box>
  )
}

export default Templates