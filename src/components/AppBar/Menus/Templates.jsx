import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
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
      >
        <MenuItem>
          <a href="/boards/6642abf8f5ce444f1c33a836" style={{ textDecoration: 'none' }}>Phân chia công việc</a>
        </MenuItem>
        <MenuItem>
          <a href="/boards/6642b11ff5ce444f1c33a846" style={{ textDecoration: 'none' }}>Project Management</a>
        </MenuItem>
        <MenuItem>
          <a href="/boards/6642b622f5ce444f1c33a850" style={{ textDecoration: 'none' }}>Design Huddle</a>
        </MenuItem>
        <MenuItem>
          <a href="/boards/6642b689f5ce444f1c33a856" style={{ textDecoration: 'none' }}>Dự án phần mềm</a>
        </MenuItem>
      </Menu>
    </Box>
  )
}

export default Templates