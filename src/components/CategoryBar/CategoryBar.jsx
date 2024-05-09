/* eslint-disable no-dupe-keys */
import * as React from 'react'
import { styled, useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import MuiDrawer from '@mui/material/Drawer'
import MuiAppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import List from '@mui/material/List'
import CssBaseline from '@mui/material/CssBaseline'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import InboxIcon from '@mui/icons-material/MoveToInbox'
import MailIcon from '@mui/icons-material/Mail'
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard'
import HomeIcon from '@mui/icons-material/Home'
import ListAltIcon from '@mui/icons-material/ListAlt'
import AddBoxIcon from '@mui/icons-material/AddBox'
import CreateNewBoard from '../AppBar/Menus/CreateNewBoard'

let drawerWidth = 360

const openedMixin = (theme) => ({
  '@media (min-width: 807px)': { // Thêm media query để điều chỉnh số cột trên mỗi hàng cho các kích thước màn hình lớn hơn 768px
    drawerWidth: 120,
    width: 200
  },
  '@media (min-width: 997px)': { // Thêm media query để điều chỉnh số cột trên mỗi hàng cho các kích thước màn hình lớn hơn 768px
    drawerWidth: 180,
    width: 240
  },
  '@media (min-width: 1221px)': { // Thêm media query để điều chỉnh số cột trên mỗi hàng cho các kích thước màn hình lớn hơn 992px
    drawerWidth: 240,
    width: 280
  },
  '@media (min-width: 1600px)': { // Thêm media query để điều chỉnh số cột trên mỗi hàng cho các kích thước màn hình lớn hơn 1200px
    drawerWidth: 360,
    width: 360
  },
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen
  }),
  overflowX: 'hidden'
})

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`
  },
})

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar
}))

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '@media (min-width: 807px)': { // Thêm media query để điều chỉnh số cột trên mỗi hàng cho các kích thước màn hình lớn hơn 768px
      drawerWidth: 120,
      width: 200
    },
    '@media (min-width: 997px)': { // Thêm media query để điều chỉnh số cột trên mỗi hàng cho các kích thước màn hình lớn hơn 768px
      drawerWidth: 180,
      width: 240
    },
    '@media (min-width: 1221px)': { // Thêm media query để điều chỉnh số cột trên mỗi hàng cho các kích thước màn hình lớn hơn 992px
      drawerWidth: 240,
      width: 280
    },
    '@media (min-width: 1600px)': { // Thêm media query để điều chỉnh số cột trên mỗi hàng cho các kích thước màn hình lớn hơn 1200px
      drawerWidth: 360,
      width: 360
    },
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme)
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme)
    })
  })
)


function CategoryBar(nameActive) {
  const theme = useTheme()
  const [open, setOpen] = React.useState(false)
  const [openDialog, setOpenDialog] = React.useState('')
  const [newBoardInfo, setNewBoardInfo] = React.useState({
    title: ''
  });

  const handleDrawerOpen = () => {
    setOpen(true)
  }

  const handleDrawerClose = () => {
    setOpen(false)
  }

  const handleOpenDiaglog = () => {
    setOpenDialog(true)
  }

  const handleCloseDiaglog = () => {
    setOpenDialog(false)
  }

  const handleOpenLink = (text) => {
    if (text === 'Boards') {
      window.location.href = '/boards'
    } else if (text === 'Create a new board') {
      handleOpenDiaglog()
      console.log(text);
    }
  }

  
  const handleSaveNewBoard = () => {
    // Xử lý lưu thông tin bảng mới, ví dụ: gửi thông tin lên server
    console.log('New board info:', newBoardInfo);
    // Sau khi xử lý xong, đóng dialog
    setOpenDialog(false);
    
  };
  

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495E' : '#fff') }}>

      <Drawer variant="permanent" open={open}
        sx={{
          '& .MuiDrawer-paper': {
            bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495E' : '#fff'),
            // width: open ? "100%" : 64,
            boxSizing: 'border-box',
            position: 'relative'
          },
        }}
      >
        <DrawerHeader
          sx={{
            border: 'none'
          }}
        >
          <IconButton onClick={() => { setOpen(!open) }}>
            {!open ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {[
            { text: 'Boards', icon: <SpaceDashboardIcon /> },
            { text: 'Templates', icon: <ListAltIcon /> },
            { text: 'Home', icon: <HomeIcon /> },
            { text: 'Create a new board', icon: <AddBoxIcon /> }
          ].map(({ text, icon }, index) =>
            (
              <ListItem key={text} disablePadding onClick={handleOpenLink ? () => handleOpenLink(text) : null}
                sx={{
                  display: 'block',
                  color: (theme) => (theme.palette.mode === 'dark' ? '#fff' : '#333'),
                  color: text === nameActive ? '#1976d2' : 'inherit',
                  bgcolor: text === nameActive ? '#e3f2fd' : 'inherit',
                  '&:hover': {
                    color: (theme) => (theme.palette.mode === 'dark' ? '#1976d2' : '#1976d2'),
                    cursor: 'pointer',
                    bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#e3f2fd' : '#e3f2fd')
                  }
                }}
              >
                <ListItemButton
                  sx={{
                    minHeight: 60,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                    color: (theme) => (theme.palette.mode === 'dark' ? '#fff' : '#333'),
                    color: text === nameActive ? '#1976d2' : 'inherit',
                    bgcolor: text === nameActive ? '#e3f2fd' : 'inherit',
                    '&:hover': {
                      color: (theme) => (theme.palette.mode === 'dark' ? '#1976d2' : '#1976d2'),
                      cursor: 'pointer',
                      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#e3f2fd' : '#e3f2fd')
                    }
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : 'auto',
                      justifyContent: 'center',
                      color: (theme) => (theme.palette.mode === 'dark' ? '#fff' : '#333'),
                      color: text === nameActive ? '#1976d2' : 'inherit',
                      '&:hover': {
                        color: (theme) => (theme.palette.mode === 'dark' ? '#1976d2' : '#1976d2'),
                        cursor: 'pointer',
                        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#e3f2fd' : '#e3f2fd')
                      }
                    }}
                  >
                    {icon}
                  </ListItemIcon>
                  <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
              </ListItem>
            ))}
        </List>
        {openDialog && (<CreateNewBoard />)}
      </Drawer>
    </Box>
  )
}

export default CategoryBar
