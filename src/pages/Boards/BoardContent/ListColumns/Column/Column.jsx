import { useState } from 'react'
import { toast } from 'react-toastify'
import AddCardIcon from '@mui/icons-material/AddCard'
import Cloud from '@mui/icons-material/Cloud'
import ContentCopy from '@mui/icons-material/ContentCopy'
import ContentCut from '@mui/icons-material/ContentCut'
import ContentPaste from '@mui/icons-material/ContentPaste'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import DragHandleIcon from '@mui/icons-material/DragHandle'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
// import { mapOrder } from '~/utils/sorts'
import ListCard from './ListCards/ListCard'
import TextField from '@mui/material/TextField'
import CloseIcon from '@mui/icons-material/Close'
import { useConfirm } from 'material-ui-confirm'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import axios from 'axios'
import { updateColumnDetailsAPI } from '~/apis'

function Column({ column, createNewCard, deleteColumnDetails, deleteCardDetails, updateColumnDetails }) {
  const url = 'http://localhost:8017'
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: column._id,
    data: { ...column }
  })
  const dndKitColumnStyle = {
    touchAction: 'none', // Danh cho sensor default dang PointerSensor
    // Nếu sử dụng CSS.Transform như docs sẽ lỗi kiểu stretch
    // https://github.com/clauderic/dnd-kit/issues/117
    transform: CSS.Translate.toString(transform),
    transition,
    // Chiều cao phải luôn max 100% vì nếu không sẽ lỗi. Lúc kéo column ngắn qua một cái column dài
    // thì phải kéo ở khu vực giữa giữa rất khó chịu (demo ở video 32).
    // Lưu ý: Lúc này phải kết hợp với {...listeners} nằm ở Box chứ không phải ở div ngoài cùng để tránh trường hợp kéo vào vùng xanh.
    height: '100%',
    opacity: isDragging ? 0.5: undefined,
    border: isDragging ? '1px solid #2ecc71' : undefined
  }

  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => { setAnchorEl(event.currentTarget) }
  const handleClose = () => { setAnchorEl(null) }

  const [newColumnTitle, setNewColumnTitle] = useState(column.title)
  const [openTextField, setOpenTextField] = useState(false)

  // const orderedCards = mapOrder(column?.cards, column?.cardOrderIds, '_id')
  // Card đã được sắp xếp ở _id.jsx nên không cần sắp xếp ở đây nữa (video 71)
  const orderedCards = column.cards

  const [openNewCardForm, setOpenNewCardForm] = useState(false)
  const toggleOpenNewCardForm = () => setOpenNewCardForm(!openNewCardForm)

  const [newCardTitle, setNewCardTitle] = useState('')
  const addNewCard = () => {
    if (!newCardTitle) {
      toast.error('Please enter Card title', { position: 'bottom-right' })
      return
    }

    // Tạo dữ liệu Card để gọi API
    const newCardData = {
      title: newCardTitle,
      columnId: column._id
    }

    // Gọi lên props function createNewCard nằm ở component cha cao nhắt (boards/_id.jsx)
    createNewCard(newCardData)

    // Đóng state và clear input
    toggleOpenNewCardForm()
    setNewCardTitle()
  }

  // Xử lý xóa 1 column và cards bên trong nó
  const confirmDeleteColumn = useConfirm()
  const handleDeleteColumn = () => {
    confirmDeleteColumn({
      title: 'DELETE COLUMN',
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
      // Gọi lên props function deleteColumnDetails nằm ở _id.jsx
      deleteColumnDetails(column._id)
    }).catch(() => {})
  }

  const handleEditTitleColumn = async () => {
    if (!newColumnTitle.trim()) {
      return // Không cập nhật nếu tiêu đề trống
    }

    if (newColumnTitle.trim() === column.title.trim()) {
      // Nếu không khác, không cần thực hiện cập nhật
      setOpenTextField(false) // Đóng chế độ chỉnh sửa
      return
    }

    try {
      const newColumnData = {
        title: newColumnTitle
        // columnId: column._id
      }
      // await axios.put(`${url}/v1/columns/${column._id}`, { title: newColumnTitle }) // API cập nhật
      await updateColumnDetails(column._id, newColumnData)
      setOpenTextField(false)
      setNewColumnTitle(newColumnTitle)
    } catch (error) {
      toast.error('Lỗi khi chỉnh sửa tên card:', error)
    }
  }

  const openEditTitleColumn = () => {
    setOpenTextField(true)
  }

  return (
    // Phải bọc div ở đây vì lỗi flickering (video32)
    <div ref={setNodeRef} style={dndKitColumnStyle} {...attributes}>
      <Box
        {...listeners}
        sx={{
          minWidth: '300px',
          maxWidth: '400px',
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643': '#ebecf0'),
          ml: 2,
          borderRadius: '6px',
          height: 'fit-content',
          maxHeight: (theme) => `calc(${theme.trello.boardContentHeight} - ${theme.spacing(3)})`
          // overflow: 'unset',
          // overflowY: 'auto',
          // overflowX: 'hidden'
        }}
      >
        {/* Header */}
        <Box sx={{
          height: (theme) => theme.trello.columnHeaderHeight,
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'

        }}
        >
          {openTextField ? (
            <TextField
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)} // Cập nhật giá trị mới
              onBlur={handleEditTitleColumn} // Lưu khi rời khỏi trường
              autoFocus // Tự động lấy tiêu điểm
              sx={{
                '& input': {
                  width: '200px', // Thiết lập chiều rộng của input
                  height: '30px', // Thiết lập chiều cao của input
                  padding: '5px' // Tăng padding để phù hợp với chiều cao của input
                },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderWidth: '1px' // Điều chỉnh độ dày của viền
                  }
                }
              }}
            />
          ) : (
            <Typography
              variant="h6"
              sx={{ fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' }}
              onDoubleClick={openEditTitleColumn} // Thêm sự kiện double click vào tiêu đề
              data-no-dnd="true"
            >
              {newColumnTitle} {/* Sử dụng state mới để hiển thị tiêu đề cột */}
            </Typography>
          )}
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
                onClick={toggleOpenNewCardForm}
              >
                <ListItemIcon><AddCardIcon className="add-card-icon" fontSize="small" /></ListItemIcon>
                <ListItemText>Add new card</ListItemText>
              </MenuItem>
              {/* <MenuItem>
                <ListItemIcon><ContentCut fontSize="small" /></ListItemIcon>
                <ListItemText>Cut</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon><ContentCopy fontSize="small" /></ListItemIcon>
                <ListItemText>Copy</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon><ContentPaste fontSize="small" /></ListItemIcon>
                <ListItemText>Paste</ListItemText>
              </MenuItem> */}
              {/* <Divider />
              <MenuItem>
                <ListItemIcon><Cloud fontSize="small" /></ListItemIcon>
                <ListItemText>Archive this column</ListItemText>
              </MenuItem> */}
              <MenuItem
                onClick={handleDeleteColumn}
                sx={{
                  '&:hover': {
                    // backgroundColor: 'warning.dark',
                    color: 'warning.dark',
                    '& .delete-forever-icon': { color: 'warning.dark' }
                  }
                }}
              >
                <ListItemIcon><DeleteForeverIcon className="delete-forever-icon" fontSize="small" /></ListItemIcon>
                <ListItemText>Delete this column</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Box>

        {/* List card */}
        <ListCard cards={orderedCards} deleteCardDetails={deleteCardDetails} />
        {/* Footer */}
        <Box sx={{
          height: (theme) => theme.trello.columnFooterHeight,
          p: 2
        }}
        >
          {!openNewCardForm
            ? <Box sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <Button startIcon={<AddCardIcon />} onClick={toggleOpenNewCardForm}>Add new card</Button>
              <Tooltip title="Drag to move">
                <DragHandleIcon sx={{ cursor: 'pointer ' }} />
              </Tooltip>
            </Box>
            : <Box sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <TextField
                label="Enter card title..."
                type="text"
                size="small"
                variant="outlined"
                autoFocus
                data-no-dnd="true"
                value={newCardTitle}
                onChange={(e) => setNewCardTitle(e.target.value)}
                sx={{
                  '& label': { color: 'text.primary' },
                  '& input': {
                    color: (theme) => theme.palette.primary.main,
                    bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : 'white')
                  },
                  '& label.Mui-focused': { color: (theme) => theme.palette.primary.main },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: (theme) => theme.palette.primary.main },
                    '&:hover fieldset': { borderColor: (theme) => theme.palette.primary.main },
                    '&.Mui-focused fieldset': { borderColor: (theme) => theme.palette.primary.main }
                  },
                  '& .MuiOutlinedInput-input': { borderRadius: 1 }
                }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Button
                  onClick={addNewCard}
                  data-no-dnd="true"
                  variant="contained" color="success" size="small"
                  sx={{
                    boxShadow: 'none',
                    border: '0.5px solid',
                    borderColor: (theme) => theme.palette.success.main,
                    '&:hover': { bgcolor: (theme) => theme.palette.success.main }
                  }}
                >Add</Button>
                <CloseIcon
                  fontSize='small'
                  sx={{
                    color: (theme) => theme.palette.warning.light,
                    cursor: 'pointer'
                  }}
                  onClick={toggleOpenNewCardForm}
                />
              </Box>
            </Box>
          }
        </Box>
      </Box>
    </div>
  )
}

export default Column