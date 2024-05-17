import Cloud from '@mui/icons-material/Cloud'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import * as React from 'react'

function Workspaces() {
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
        id="basic-button-workspaces"
        aria-controls={open ? 'basic-menu-workspaces' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        endIcon={<ExpandMoreIcon />}
      >
        Workspaces
      </Button>
      <Menu
        id="basic-menu-workspaces"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button-workspaces'
        }}
      >
        <MenuItem>
          <ListItemIcon>
            <Cloud fontSize="small" />
          </ListItemIcon>
          {/* <ListItemText>Your Space</ListItemText> */}
          <a href="/boards/" style={{ textDecoration: 'none', color: 'black' }}>Your Space</a>
        </MenuItem>
      </Menu>
    </Box>
  )
}

export default Workspaces