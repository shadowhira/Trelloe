/* eslint-disable space-before-blocks */
import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import IconButton from '@mui/material/IconButton'
import MoreVert from '@mui/icons-material/MoreVert'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { CardMedia, Card as MuiCard, Box } from '@mui/material'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import AttachmentIcon from '@mui/icons-material/Attachment'
import CommentIcon from '@mui/icons-material/Comment'
import GroupIcon from '@mui/icons-material/Group'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

import CardActions from '@mui/material/CardActions'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { toast } from 'react-toastify'

import avatar from '~/assets/profile.png'
import { styled } from '@mui/material/styles'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'

function Card({ card, deleteCardDetails }) {
  const [anchorEl, setAnchorEl] = useState(null)
  const [isHovered, setIsHovered] = useState(false)
  const [isEditingTitle, setIsEditingTitle] = useState(false) // Để theo dõi trạng thái chỉnh sửa
  const [isEditingCover, setIsEditingCover] = useState(false)
  const [newCoverLink, setNewCoverLink] = useState('')
  const [newTitle, setNewTitle] = useState(card?.title || '') // Tiêu đề mới
  const [uploading, setUploading] = useState(false) // Trạng thái tải lên
  const [showCoverDialog, setShowCoverDialog] = useState(false)
  const menuRef = useRef(null) // Tham chiếu cho menu

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card._id,
    data: { ...card }
  })

  const url = 'http://localhost:8017'

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Kiểm tra xem click có bên ngoài vùng chứa hay không
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsEditingTitle(false) // Ẩn khi click ra bên ngoài
        setIsEditingCover(false) // Ẩn khi click ra bên ngoài
      }
    }

    // Thêm trình nghe sự kiện để phát hiện click bên ngoài
    document.addEventListener('click', handleClickOutside)

    // Xóa trình nghe sự kiện khi component bị hủy
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, []) // Chỉ chạy một lần khi component được tạo

  const dndKitCardStyle = {
    touchAction: 'none', // Danh cho sensor default dang PointerSensor
    // Nếu sử dụng CSS.Transform như docs sẽ lỗi kiểu stretch
    // https://github.com/clauderic/dnd-kit/issues/117
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5: undefined,
    border: isDragging ? '1px solid #2ecc71' : undefined
  }


  const shouldShowCardActions = () => {
    return !!card?.memberIds?.length || !!card?.comments?.length || !!card?.attachments?.length
  }

  const openMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const closeMenu = () => {
    setAnchorEl(null)
  }

  const startEditTitle = () => {
    setIsEditingTitle(true) // Bắt đầu chỉnh sửa
    closeMenu()
  }

  const startEditCover = () => {
    // setShowCoverDialog(true)
    setIsEditingCover(true)
  }

  const handleEditTitleCard = async () => {
    if (!newTitle.trim()) {
      return // Không cập nhật nếu tiêu đề trống
    }
    try {
      await axios.put(`${url}/v1/cards/${card._id}`, { title: newTitle }) // API cập nhật
      if (!isHovered) {
        card.title = newTitle
        setIsEditingTitle(false)
      }
    } catch (error) {
      toast.error('Lỗi khi chỉnh sửa tên card:', error)
    }
  }

  const handleDeleteCard = async () => {
    try {
      deleteCardDetails(card._id)
      closeMenu()
    } catch (error) {
      toast.error('Không tìm thấy card')
    }
  }

  const [postImage, setPostImage] = useState( { myFile : ''} )

  const handleSubmit = (e) => {
    e.preventDefault()
    // Call your API to update the cover with newCoverLink
    setUploading(true)
    console.log(newCoverLink)

    // Example API call
    axios.put(`${url}/v1/cards/${card._id}`, { cover: newCoverLink })
      .then(() => {
        // Handle success
        setUploading(false)
        setShowCoverDialog(false)
      })
      .catch((error) => {
        // Handle error
        console.error('Error updating cover:', error)
        setUploading(false)
      })
    console.log('Uploaded')
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    const base64 = await convertToBase64(file)
    setPostImage({ ...postImage, myFile : base64 })
    setNewCoverLink(base64)
  }

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1
  })

  return (
    <MuiCard
      ref={setNodeRef} style={dndKitCardStyle} {...attributes} {...listeners}
      sx={{
        cursor: 'pointer',
        boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
        overflow: 'unset',
        // overflowY: 'scroll',
        display: card?.FE_PlaceholderCard ? 'none' : 'block',
        border: '1px solid transparent',
        '&:hover': { borderColor: (theme) => theme.palette.primary.main }
        // overflow: card?.FE_PlaceholderCard ? 'hidden' : 'unset',
        // height: card?.FE_PlaceholderCard ? '0px' : 'unset'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Box>
        {card?.cover && <CardMedia sx={{ height: 140 }} image={card?.cover} />}
      </Box>
      <Box sx={{ position: 'relative' }}>
        <CardContent
          sx={{
            p: 1.5,
            '&:last-child': { p: 1.5 }
          }}>
          {isEditingTitle ? (
            <div>
              <TextField
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)} // Cập nhật giá trị mới
                onBlur={handleEditTitleCard} // Lưu khi rời khỏi trường
                autoFocus // Tự động lấy tiêu điểm
              />
            </div>
          ) : (
            <Typography>{card?.title}</Typography>
          )}
          <IconButton
            size="small"
            onClick={openMenu}
            sx={{
              position: 'absolute',
              top: '50%',
              right: 0,
              transform: 'translateY(-50%)',
              visibility: isHovered ? 'visible' : 'hidden',
              transition: 'visibility 0.2s',
              borderRadius: '50%'
            }}
          >
            <EditIcon />
          </IconButton>
        </CardContent>
      </Box>

      <Menu
        ref={menuRef}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={closeMenu}
        MenuListProps={{
          'aria-labelledby': 'more-options'
        }}
      >
        <MenuItem onClick={startEditTitle}>Change Title</MenuItem>
        <MenuItem onClick={startEditCover}>
          <label htmlFor={`upload-cover-${card._id}`}>Change Cover</label>
          {isEditingCover && (
            <form onSubmit={handleSubmit}>
              <label htmlFor="file-upload" className='custom-file-upload'>
                <img src={postImage.myFile || avatar} alt="" />
              </label>
              <input
                type="file"
                label="Image"
                name="myFile"
                id='file-upload'
                accept='.jpeg, .png, .jpg'
                onChange={(e) => handleFileUpload(e)}
              />
              <button type='submit'>Submit</button>
            </form>
          )}
          {/* <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            onChange={(e) => handleFileUpload(e)}
            startIcon={<CloudUploadIcon />}
          >
            Upload file
            <VisuallyHiddenInput type="file" />
          </Button>
          <Button type='submit'>Save</Button> */}
        </MenuItem>

        <MenuItem onClick={handleDeleteCard}>
          <DeleteIcon />
          Delete card
        </MenuItem>

      </Menu>
      {uploading && <CircularProgress size={24} />}
      {shouldShowCardActions() &&
        <CardActions sx={{ p: '0 4px 8px 4px' }}>
          {!!card?.memberIds?.length &&
            <Button size="small" startIcon={<GroupIcon />}>{card?.memberIds?.length}</Button>
          }
          {!!card?.comments?.length &&
            <Button size="small" startIcon={<CommentIcon />}>{card?.comments?.length}</Button>
          }
          {!!card?.attachments?.length &&
            <Button size="small" startIcon={<AttachmentIcon />}>{card?.attachments?.length}</Button>
          }
        </CardActions>
      }

      {/* <Dialog open={showCoverDialog} onClose={() => setShowCoverDialog(false)}>
        <DialogTitle>Change Cover</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <label htmlFor="file-upload" className="custom-file-upload">
              <img src={newCoverLink || card.cover || avatar} alt="" />
            </label>
            <input
              type="file"
              label="Image"
              name="myFile"
              id="file-upload"
              accept=".jpeg, .png, .jpg"
              onChange={handleFileUpload}
            />
            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              onChange={handleFileUpload}
              startIcon={<CloudUploadIcon />}
            >
              Upload file
              <input type="file" hidden />
            </Button>
            {uploading && <CircularProgress />}
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCoverDialog(false)}>Cancel</Button>
          <Button type="submit" onClick={handleSubmit} disabled={!newCoverLink}>
            Submit
          </Button>
        </DialogActions>
      </Dialog> */}
    </MuiCard>
  )
}

export default Card

function convertToBase64(file){
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader()
    fileReader.readAsDataURL(file)
    fileReader.onload = () => {
      resolve(fileReader.result)
    }
    fileReader.onerror = (error) => {
      reject(error)
    }
  })
}