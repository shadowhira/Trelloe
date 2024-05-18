/* eslint-disable space-before-blocks */
import AttachmentIcon from '@mui/icons-material/Attachment'
import CommentIcon from '@mui/icons-material/Comment'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import GroupIcon from '@mui/icons-material/Group'
import { Box, CardMedia, Card as MuiCard } from '@mui/material'
import Button from '@mui/material/Button'
import CardContent from '@mui/material/CardContent'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import axios from 'axios'
import { useEffect, useRef, useState } from 'react'

import CardActions from '@mui/material/CardActions'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { toast } from 'react-toastify'

import ImageIcon from '@mui/icons-material/Image'
import TitleIcon from '@mui/icons-material/Title'
import { updateCardAPI, uploadImageAPI } from '~/apis'

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
  const [file, setFile] = useState()

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card._id,
    data: { ...card }
  })

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
    opacity: isDragging ? 0.5 : undefined,
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
      await updateCardAPI(card._id, { title: newTitle })
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setUploading(true)
    let newCoverLink = null
    if (file) {
      const formData = new FormData()
      formData.append('file', file)
      try {
        const response = await uploadImageAPI(formData)
        newCoverLink = response // Lưu URL mới của ảnh
        setNewCoverLink(newCoverLink) // Cập nhật trạng thái của component với URL mới
      } catch (error) {
        toast.error('Error uploading file')
        setUploading(false)
        return
      }
    }

    try {
      // Sau khi đã nhận được URL mới, cập nhật cover của card thông qua API
      // updateCardAPI(cardId, updateData)
      await updateCardAPI(card._id, { cover: newCoverLink })
      setUploading(false)
      setShowCoverDialog(false)
    } catch (error) {
      toast.error('Error updating cover')
      setUploading(false)
    }
  }

  const handleFileUpload = async (e) => {
    setFile(e.target.files[0])
  }


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
        sx={{
          p: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <MenuItem onClick={startEditTitle}
          sx={{
            p: '8px 16px'
          }}
        >
          <TitleIcon
            sx={{
              mr: '16px'
            }}
          />
          Change Title
        </MenuItem>
        <MenuItem onClick={startEditCover}
          sx={{
            p: '8px 16px'
          }}
        >
          <ImageIcon
            sx={{
              mr: '16px'
            }}
          />
          <label htmlFor={`upload-cover-${card._id}`}>Change Cover</label>
        </MenuItem>

        <MenuItem onClick={handleDeleteCard}
          sx={{
            p: '8px 16px'
          }}>
          <DeleteIcon
            sx={{
              mr: '16px'
            }}
          />
          Delete card
        </MenuItem>
        {isEditingCover && (
          <form onSubmit={handleSubmit} style={{
            position: 'absolute',
            zIndex: 1,
            background: 'white',
            padding: '20px', // Tăng padding để tạo khoảng cách từ nội dung tới viền
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
            borderRadius: '5px',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100%', // Đặt chiều rộng cố định để form không tràn ra ngoài
            height: '100%', // Đặt chiều cao cố định để form không tràn ra ngoài
            textAlign: 'center' // Căn giữa nội dung trong form
          }}>
            <input
              type="file"
              label="Image"
              name="myFile"
              id='file-upload'
              accept='.jpeg, .png, .jpg'
              onChange={(e) => handleFileUpload(e)}
              style={{ marginBottom: '10px', backgroundColor: '#66C1E0', borderRadius: '5px' }} // Thêm margin dưới cho input
            />
            <button type='submit' style={{ // Thêm style cho button
              backgroundColor: '#66C1E0', // Màu nền xanh
              color: 'white', // Màu chữ trắng
              padding: '10px 20px', // Kích thước nút
              border: 'none', // Bỏ viền
              borderRadius: '5px', // Bo góc
              cursor: 'pointer', // Con trỏ khi hover
              outline: 'none' // Bỏ đường viền khi focus
            }}>
            Submit
            </button>
          </form>
        )}
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
    </MuiCard>
  )
}

export default Card