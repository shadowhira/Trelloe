import * as React from 'react'
import { useState, useEffect } from 'react'
import { useConfirm } from 'material-ui-confirm'
import { Box, IconButton, Stack, Button } from '@mui/material'
import AppBar from '~/components/AppBar/AppBar'
import { makeStyles } from '@mui/styles'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableSortLabel, TextField, InputAdornment } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import FilterListIcon from '@mui/icons-material/FilterList'
import SearchIcon from '@mui/icons-material/Search'
import Modal from '@mui/material/Modal'
import { Email } from '@mui/icons-material'
import AccountBoxIcon from '@mui/icons-material/AccountBox'
import { toast } from 'react-toastify'
import { checkAuthAPI, deleteUserAPI, getUsersAPI, updateUserByIdAPI } from '~/apis'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'


const useStyles = makeStyles({
  table: {
    minWidth: 650
  }
})

export default function Admin() {
  const [editingData, setEditingData] = useState({ _id: '', email: '', username: '' })
  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const [errorNoValueEmail, setErrorNoValueEmail] = useState(false)
  const [errorNoValueUser, setErrorNoValueUser] = useState(false)
  const [errorEmail, setErrorEmail] = useState(false)
  const classes = useStyles()
  const [sortBy, setSortBy] = useState(null)
  const [data, setData] = useState([])
  const [sortDirection, setSortDirection] = useState('asc')
  const [searchTerm, setSearchTerm] = useState({
    id: '',
    email: '',
    username: ''
  })
  const [showSearch, setShowSearch] = useState({
    id: false,
    email: false,
    username: false
  })
  const [auth, setAuth] = React.useState(false)
  const navigate = useNavigate()
  axios.defaults.withCredentials = true

  React.useEffect(() => {
    // Check authentication on component mount
    checkAuthAPI()
      .then((res) => {
        if (res.status === 'Success' && res.role === 'admin') {
          setAuth(true)
        } else {
          navigate('/login')
          setAuth(false)
        }
      })
      .catch(() => {
        navigate('/login')
        setAuth(false)
      })
  }, [navigate])

  const handleEdit = (id) => {
    // Tìm hàng được chọn để chỉnh sửa
    const rowToEdit = data.find(item => item._id === id)
    // Cập nhật state editingData với dữ liệu của hàng được chọn
    setEditingData({ _id: rowToEdit._id, email: rowToEdit.email, username: rowToEdit.username })
    handleOpen()
    // Hiển thị modal chỉnh sửa
    // Code hiển thị modal ở đây
  }

  useEffect (() => {
    const getListUser = async () => {
      try {
        const response = await getUsersAPI()
        if (response.status === 'Success') {
          const filteredUsers = response.users.filter(user => user.role === 'user')
          setData(filteredUsers)
        }
        else {
          toast.error('Get list users fail !')
        }
      } catch (err) {
        toast.error(err)
      }
    }
    getListUser()
  }, [])

  useEffect(() => {
    setErrorNoValueEmail(editingData.email === '')
    setErrorNoValueUser(editingData.username === '')
    // eslint-disable-next-line no-useless-escape
    setErrorEmail(!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(editingData.email))

  }, [editingData.email, editingData.username]) // Sử dụng các trường dữ liệu là dependencies để useEffect chạy mỗi khi chúng thay đổi

  const handleSubmit = async () => {

    if (!errorNoValueEmail && !errorNoValueUser && !errorEmail) {
      //EditingData la du lieu cap nhat cuoi cung
      // Tạo một bản sao của mảng dữ liệu
      const newData = [...data]
      // Tìm index của hàng cần chỉnh sửa
      const rowIndex = newData.findIndex(item => item._id === editingData._id)
      // console.log(rowIndex)
      // Cập nhật dữ liệu mới
      newData[rowIndex].email = editingData.email
      newData[rowIndex].username = editingData.username
      const updateData = {
        email: editingData.email,
        username: editingData.username
      }
      try {
        const response = await updateUserByIdAPI(editingData._id, updateData)
        if (response.status === 'Success') {
          toast.success(`Update ${editingData.username} Success !`)
          setData(newData)
        } else {
          toast.error(`Update ${editingData.username} Fail !`)
        }
      } catch (err) {
        toast.error(err)
      }

      // Cập nhật state với dữ liệu mới
      // console.log(newData)
      // Đóng modal
      // Code đóng modal ở đây
      handleClose()
    }

  }

  const handleSort = (property) => {
    const isAsc = sortBy === property && sortDirection === 'asc'
    setSortBy(property)
    setSortDirection(isAsc ? 'desc' : 'asc')

    const sortedData = [...data].sort((a, b) => {
      if (property === '_id' || property === 'email' || property === 'username') {
        const aValue = a[property]
        const bValue = b[property]
        if (aValue && bValue) {
          return isAsc ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
        }
        return 0
      }
      return 0
    })

    setData(sortedData)
  }

  const handleSearch = (property, value) => {
    setSearchTerm({
      ...searchTerm,
      [property]: value
    })
  }

  const deleteUser = async (userId) => {
    const deletedUsername = data.find(item => item._id === userId).username
    try {
      const response = await deleteUserAPI(userId)
      if (response.status === 'Success') {
        toast.success(`Delete ${deletedUsername} Success !`)
      } else {
        toast.error(`Delete ${deletedUsername} Failed !`)
      }
    } catch (error) {
      // console.log(error)
      toast.error(error)
    }
  }

  //Hoi
  const confirmDeleteColumn = useConfirm()


  const handleDelete = (id) => {


    confirmDeleteColumn({
      title: 'DELETE USER',
      description: 'This action will permanetly delete! Are you ready?',
      // content: 'Are you sure?',
      confirmationText: 'Confirm',
      cancellationText: 'Cancel'

      // allowClose: false,
      // dialogProps: { maxWidth: 'xs' },
      // cancellationButtonProps: { color: 'inherit' },
      // confirmationButtonProps: { color: 'secondary', variant: 'outlined' }

      // description: 'Are you sure? Type 'Ok' to Confirm',
    }).then(() => {
      // Gọi lên props function deleteColumnDetails nằm ở _id.jsx
      deleteUser(id)
      const newData = data.filter(item => item._id !== id)
      setData(newData) // Cập nhật lại dữ liệu
    }).catch(() => { })
  }

  const toggleSearch = (property) => {
    setShowSearch({
      ...showSearch,
      [property]: !showSearch[property]
    })
  }

  const filteredData = data.filter(row => {
    return (
      row._id.toLowerCase().includes(searchTerm.id.toLowerCase()) &&
      row.email.toLowerCase().includes(searchTerm.email.toLowerCase()) &&
      row.username.toLowerCase().includes(searchTerm.username.toLowerCase())
    )
  })

  let counter = 1
  // const isListBoard = true
  let { boardId } = useParams()

  return (
    <Box
      sx={{
        // height: (theme) => {
        //   if (boardId) {
        //     return `calc(100vh -
        //       ${theme.trello.appBarHeight} - ${theme.trello.boardBarHeight}
        //     )`
        //   } else {
        //     return `calc(100vh -
        //       ${theme.trello.appBarHeight}
        //     )`
        //   }
        // },
        height: (theme) => `calc(100vh - ${theme.trello.appBarHeight} + ${theme.trello.boardBarHeight})`,
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495E' : '#fff')
      }}
    >
      <AppBar />
      <Box style={{ height: '80%', width: '100%', display: 'flex', justifyContent: 'center' }}
        sx={{
          mt: '50px'
        }}
      >
        <TableContainer component={Paper}
          sx={{
            width: '1000px',
            minWidth: '600px'
          }}
        >
          <Table className={classes.table} aria-label='simple table'>
            <TableHead
              sx={{
                bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#545454' : '#ECEAF7')
              }}
            >
              <TableRow>
                <TableCell>
                  STT
                </TableCell>
                <TableCell>
                  <Box
                    style={{
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <TableSortLabel
                      active={sortBy === '_id'}
                      direction={sortBy === '_id' ? sortDirection : 'asc'}
                      onClick={() => handleSort('_id')}
                    >
                      <Box>
                        ID

                      </Box>
                    </TableSortLabel>

                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <IconButton onClick={() => toggleSearch('id')}>
                        <FilterListIcon />
                      </IconButton>
                      {showSearch.id && (
                        <TextField
                          variant='standard'
                          size='small'
                          placeholder='Search ID'
                          value={searchTerm.id}
                          onChange={(e) => handleSearch('id', e.target.value)}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position='start'>
                                <SearchIcon></SearchIcon>
                              </InputAdornment>
                            )
                          }}
                        />
                      )}
                    </Box>
                  </Box>
                </TableCell>
                <TableCell >
                  <Box
                    style={{
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >

                    <TableSortLabel
                      active={sortBy === 'email'}
                      direction={sortBy === 'email' ? sortDirection : 'asc'}
                      onClick={() => handleSort('email')}
                    >
                      <Box>
                        Email

                      </Box>
                    </TableSortLabel>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <IconButton onClick={() => toggleSearch('email')}>
                        <FilterListIcon />
                      </IconButton>
                      {showSearch.email && (
                        <TextField
                          variant='standard'
                          size='small'
                          placeholder='Search Email'
                          value={searchTerm.email}
                          onChange={(e) => handleSearch('email', e.target.value)}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position='start'>
                                <SearchIcon></SearchIcon>
                              </InputAdornment>
                            )
                          }}
                        />
                      )}
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box
                    style={{
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >

                    <TableSortLabel
                      active={sortBy === 'username'}
                      direction={sortBy === 'username' ? sortDirection : 'asc'}
                      onClick={() => handleSort('username')}
                    >
                      <Box>
                        Username

                      </Box>
                    </TableSortLabel>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <IconButton onClick={() => toggleSearch('username')}>
                        <FilterListIcon />
                      </IconButton>
                      {showSearch.username && (
                        <TextField
                          variant='standard'
                          size='small'
                          placeholder='Search Username'
                          value={searchTerm.username}
                          onChange={(e) => handleSearch('username', e.target.value)}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position='start'>
                                <SearchIcon></SearchIcon>
                              </InputAdornment>
                            )
                          }}
                        />
                      )}
                    </Box>
                  </Box>
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: 'center'
                  }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((row) => (
                <TableRow key={++counter}>
                  <TableCell>{counter}</TableCell>
                  <TableCell>{row._id}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.username}</TableCell>
                  <TableCell
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-around'
                    }}
                  >
                    <IconButton aria-label='delete' onClick={() => handleDelete(row._id)}>
                      <DeleteIcon />
                    </IconButton>
                    <IconButton aria-label='edit' onClick={() => handleEdit(row._id)}>
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Box
          sx={{
            bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495E' : '#fff'),
            width: '500px',
            height: '300px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            borderRadius: '10px',
            padding: '0 16px'
          }}
        >
          <Box>
            <TextField
              error={errorNoValueEmail || errorEmail}
              helperText={(errorNoValueEmail) ? 'Please enter this field.' : (errorEmail ? 'This field must be Email.' : '')}
              label='Your Email'
              id='outlined-start-adornment'
              sx={{
                p: 1.5,
                width: '100%',
                '& input': {
                  padding: '12px 8px'
                }
              }}
              InputProps={{
                startAdornment: <InputAdornment position='start'>
                  <Email></Email>
                </InputAdornment>,
                sx: {
                  width: '100%'
                },
                defaultValue: editingData.email
              }}
              InputLabelProps={{

                sx: {
                  width: '100%',
                  marginLeft: '8px',
                  fontSize: '16px'
                }
              }}

              onChange={(e) => setEditingData({ _id: editingData._id, email: e.target.value, username: editingData.username })}
            />
          </Box>

          <Box
            sx={{
              width: '100%',
              display: 'flex',
              height: '80px',
              alignItems: 'center',
              justifyContent: 'center',
              paddingTop: '18px',
              borderRadius: '5px',
              marginBottom: '16px'
            }}
          >

            <TextField
              error={errorNoValueUser}
              helperText={errorNoValueUser ? 'Please enter this field.' : ''}
              label='Your Username'
              id='outlined-start-adornment'
              sx={{
                p: 1.5,
                width: '100%',
                '& input': {
                  padding: '12px 8px'
                }
              }}
              InputProps={{
                startAdornment: <InputAdornment position='start'>
                  <AccountBoxIcon></AccountBoxIcon>
                </InputAdornment>,
                sx: {
                  width: '100%'

                },
                defaultValue: editingData.username

              }}
              InputLabelProps={{

                sx: {
                  width: '100%',
                  marginLeft: '8px',
                  fontSize: '16px'
                }
              }}
              onChange={(e) => setEditingData({ _id: editingData._id, email: editingData.email, username: e.target.value })}
            />
          </Box>
          <Stack>
            <Button
              sx={{ padding: '10px 0' }}
              variant='contained'
              onClick={() => handleSubmit()}
            >
              Update
            </Button>
          </Stack>
        </Box>
      </Modal >
    </Box >
  )
}