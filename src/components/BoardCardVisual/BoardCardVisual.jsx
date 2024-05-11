import AddCardIcon from '@mui/icons-material/AddCard'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import { Box, Typography } from '@mui/material'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import FormControlLabel from '@mui/material/FormControlLabel'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import { useConfirm } from 'material-ui-confirm'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { updateBoardDetailsAPI, deleteBoardAPI } from '~/apis'

function BoardCardVisual({ title, description, color, boardId, type, updateBoardUpdated }) {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => { setAnchorEl(event.currentTarget) }
  const handleClose = () => { setAnchorEl(null) }
  const [boardUpdated, setBoardUpdated] = useState(false)


  const [openForm, setOpenForm] = useState(false)

  const handleOpenForm = () => {
    setOpenForm(true)
  }

  const handleCloseForm = () => {
    setOpenForm(false)
  }

  const toggleOpenNewBoardForm = () => setOpenForm(!openForm)

  const confirmDeleteBoard = useConfirm()
  const handleDeleteBoard = () => {
    confirmDeleteBoard({
      title: 'DELETE BOARD',
      description: 'This action will permanetly delete! Are you ready?',
      // content: 'Are you sure?',
      confirmationText: 'Confirm',
      cancellationText: 'Cancel'

      // allowClose: false,
      // dialogProps: { maxWidth: 'xs' },
      // cancellationButtonProps: { color: 'inherit' },
      // confirmationButtonProps: { color: 'secondary', variant: 'outlined' }

      // description: 'Are you sure? Type "Ok" to Confirm',
      // confirmationKeyword: 'Ok'
    }).then(() => {
      deleteBoardAPI(boardId)
    }).catch(() => {})
  }


  return ( <Box
    sx={{
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : '#fff'),
      boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
      borderRadius: '10px'
    }}
  >
    <Box
      sx={{
        height: '50px',
        bgcolor: color,
        borderTopLeftRadius: '10px', // Áp dụng bo tròn cho góc trên bên trái
        borderTopRightRadius: '10px' // Áp dụng bo tròn cho góc trên bên phải
      }}
    ></Box>
    <Typography
      sx={{
        fontSize: '16px',
        ml: '16px',
        mt: '12px',
        mb: '6px',
        fontWeight: '500'
      }}
    >
      {title}
    </Typography>
    <Box>
      <Tooltip title="More options">
        <ExpandMoreIcon
          sx={{ color: 'text.primary', cursor: 'pointer' }}
          id="basic-column-dropdown"
          aria-controls={open ? 'basic-menu-column-dropdown' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        />
      </Tooltip>
      <Menu
        id="basic-menu-column-dropdown"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-column-dropdown'
        }}
      >
        <MenuItem
          sx={{
            '&:hover': {
              // backgroundColor: 'warning.dark',
              color: 'success.light',
              '& .add-card-icon': { color: 'success.light' }
            }
          }}
          onClick={toggleOpenNewBoardForm}
        >
          <ListItemIcon><AddCardIcon className="add-card-icon" fontSize="small" /></ListItemIcon>
          <ListItemText>Update Board</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={handleDeleteBoard}
          sx={{
            '&:hover': {
              // backgroundColor: 'warning.dark',
              color: 'warning.dark',
              '& .delete-forever-icon': { color: 'warning.dark' }
            }
          }}
        >
          <ListItemIcon><DeleteForeverIcon className="delete-forever-icon" fontSize="small" /></ListItemIcon>
          <ListItemText>Delete this board</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
    <Typography
      sx={{
        fontSize: '12px',
        ml: '16px',
        mt: '6px',
        mb: '6px',
        fontWeight: '400'
      }}
    >
      {description}
    </Typography>
    <Typography
      sx={{
        fontSize: '12px',
        ml: '16px',
        mt: '6px',
        mb: '6px',
        fontWeight: '400'
      }}
    >
      {type}
    </Typography>
    <Link
      sx={{
        display: 'flex',
        alignItems: 'center',
        mt: '6px',
        mb: '12px',
        textDecoration: 'none',
        '&:hover': {
          color: (theme) => (theme.palette.mode === 'dark' ? '#1976d2' : '#1976d2'),
          cursor: 'pointer',
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#d5e9fe' : '#d5e9fe')
        }
      }}
      to={`/boards/${boardId}`} // Sử dụng to để chỉ định route muốn điều hướng tới
    >
      <span style={{ marginLeft: 'auto' }}>Go to board</span>
      <NavigateNextIcon style={{ marginLeft: '4px', marginRight: '8px' }}></NavigateNextIcon>
    </Link>
    <Dialog
      open={openForm}
      onClose={handleCloseForm}
      PaperProps={{
        component: 'form',
        onSubmit: (event) => {
          event.preventDefault()
          const formData = new FormData(event.currentTarget)
          const formJson = Object.fromEntries(formData.entries())
          const title = formJson.title
          const description = formJson.description
          const type = formJson.type
          updateBoardDetailsAPI(boardId, { title, description, type })
            .then((res) => {
              if (res) {
                toast.success('Update board success!')
                setBoardUpdated(true) // Thay đổi giá trị của boardUpdated
                updateBoardUpdated()
              } else {
                toast.error('Error when update board!')
              }
            })
            .catch((err) => {
              console.error('Lỗi khi update bảng:', err)
            })
          handleClose()
        }
      }}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '70vh',
        width: '100%',
        minHeight: '80vh'
      }}
    >

      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <LibraryAddIcon />
            Update Board
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          required
          margin="dense"
          id="name"
          name="title"
          label="Title"
          type="title"
          fullWidth
          variant="standard"
          sx={{ marginTop: 2 }}
        />
        <TextField
          margin="dense"
          id="name"
          name="description"
          label="Description"
          type="description"
          fullWidth
          variant="standard"
          sx={{ marginTop: 2 }}
        />
        <Box>
          <RadioGroup
            row
            required
            aria-labelledby="type"
            name="type"
            sx={{ marginTop: 2 }}
          >
            <FormControlLabel value="public" control={<Radio />} label="Public" />
            <FormControlLabel value="private" control={<Radio />} label="Private" />

          </RadioGroup>
        </Box>
      </DialogContent>
      <DialogActions >
        <Button onClick={handleCloseForm}>Cancel</Button>
        <Button type="submit" onClick={handleCloseForm}>Update</Button>
      </DialogActions>
    </Dialog>
  </Box>
)}

export default BoardCardVisual