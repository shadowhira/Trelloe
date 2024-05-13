/* eslint-disable no-dupe-keys */
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import HomeIcon from '@mui/icons-material/Home'
import ListAltIcon from '@mui/icons-material/ListAlt'
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import MuiDrawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import { styled, useTheme } from '@mui/material/styles'
import * as React from 'react'
import { useParams } from 'react-router-dom'

let drawerWidth = 360

const openedMixin = (theme) => ({
  '@media (min-width: 807px)': { // Thêm media query để điều chỉnh số cột trên mỗi hàng cho các kích thước màn hình lớn hơn 768px
    drawerWidth: 120,
    width: 150
  },
  '@media (min-width: 997px)': { // Thêm media query để điều chỉnh số cột trên mỗi hàng cho các kích thước màn hình lớn hơn 768px
    drawerWidth: 180,
    width: 180
  },
  '@media (min-width: 1221px)': { // Thêm media query để điều chỉnh số cột trên mỗi hàng cho các kích thước màn hình lớn hơn 992px
    drawerWidth: 240,
    width: 210
  },
  '@media (min-width: 1600px)': { // Thêm media query để điều chỉnh số cột trên mỗi hàng cho các kích thước màn hình lớn hơn 1200px
    drawerWidth: 360,
    width: 240
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
  }
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
  })

  // const handleDrawerOpen = () => {
  //   setOpen(true)
  // }

  // const handleDrawerClose = () => {
  //   setOpen(false)
  // }

  // const handleOpenDiaglog = () => {
  //   setOpenDialog(true)
  // }

  // const handleCloseDiaglog = () => {
  //   setOpenDialog(false)
  // }

  const handleOpenLink = (text) => {
    window.location.href = '/boards'
  }

  // const handleOpenLink = (text) => {
  //   if (text === 'Boards') {
  //     window.location.href = '/boards'
  //   } else if (text === 'Create a new board') {
  //     handleOpenDiaglog()
  //     console.log(text)
  //   }
  // }

  // const isListBoard = true
  let { boardId } = useParams()

  return (
    <Box sx={{ display: 'flex',
      height: (theme) => {
        if (boardId) {
          return `calc(100vh -
            ${theme.trello.appBarHeight}
          )`
        } else {
          return `calc(100vh -
            ${theme.trello.appBarHeight}
          )`
        }
      },
      // width: '100%',
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495E' : '#fff')
    }}>

      <Drawer variant="permanent" open={open}
        sx={{
          '& .MuiDrawer-paper': {
            bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495E' : '#fff'),
            // width: open ? "100%" : 64,
            boxSizing: 'border-box',
            position: 'relative'
          }
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
            { text: 'Boards', icon: <SpaceDashboardIcon />, onClick: handleOpenLink },
            { text: 'Templates', icon: <ListAltIcon /> },
            { text: 'Home', icon: <HomeIcon />, onClick: handleOpenLink }
          ].map(({ text, icon, onClick }, index) =>
            (
              <ListItem key={text} disablePadding onClick={onClick}
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
      </Drawer>
    </Box>
  )
}

export default CategoryBar
