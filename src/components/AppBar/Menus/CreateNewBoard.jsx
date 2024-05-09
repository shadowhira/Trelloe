import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import FormControlLabel from '@mui/material/FormControlLabel'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import TextField from '@mui/material/TextField'
import * as React from 'react'
import { toast } from 'react-toastify'
import { createNewBoarrdAPI } from '~/apis'

function CreateNewBoard() {
  const [open, setOpen] = React.useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <React.Fragment>
      {/* <Button variant="outlined" onClick={handleClickOpen}>
        Create new Board
      </Button> */}
      <Button
        sx={{
          color: 'white',
          border: 'none',
          '&:hover': { border: 'none' }
        }}
        variant="outlined"
        startIcon={<LibraryAddIcon />}
        onClick={handleClickOpen}
      >
            Create
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault()
            const formData = new FormData(event.currentTarget)
            const formJson = Object.fromEntries(formData.entries())
            const title = formJson.title
            const description = formJson.description
            const type = formJson.type
            createNewBoarrdAPI(title, description, type)
              .then((res) => {
                if (res) {
                  toast.success(`Create board ${title} success!`)
                } else {
                  toast.error('Error when create board!')
                }
              })
              .catch((err) => {
                console.error('Lỗi khi tạo bảng:', err)
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
            Create new Board
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
            autoFocus
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
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Create</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}

export default CreateNewBoard
