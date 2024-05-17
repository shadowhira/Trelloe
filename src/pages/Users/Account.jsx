/* eslint-disable space-before-blocks */
import { Email } from '@mui/icons-material'
import AccountBoxIcon from '@mui/icons-material/AccountBox'
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd'
import {
  Box, Button,
  Card,
  CardContent,
  CardMedia,
  Container, Stack, Typography
} from '@mui/material'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { getUserByIdAPI, updateUserByIdAPI } from '~/apis'
import CircularProgress from '@mui/material/CircularProgress'
import defaultAvatar from '~/assets/profile.png'
import AppBar from '~/components/AppBar/AppBar'


let avatar = null

const CircularImageBox = ({ displayNameUser, userNameUser, userId }) => {
  const [image, setImage] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)

  useEffect(() => {
    const fetchUserAvatar = async () => {
      try {
        const response = await getUserByIdAPI(userId)
        const user = response
        if (user.avatar) {
          setImage(user.avatar)
        }
      } catch (error) {
        return
      }
    }

    if (userId) fetchUserAvatar()
  }, [userId])


  const handleFileChange = (event) => {
    const file = event.target.files[0]
    setSelectedFile(file)
    const reader = new FileReader()
    reader.onload = () => {
      setImage(reader.result)
    }
    reader.readAsDataURL(file)
  }
  useEffect(() => {
    avatar = selectedFile
  }, [selectedFile])

  // const handleSubmit = async (e) => {
  //   e.preventDefault()
  //   if (!selectedFile) {
  //     return
  //   }
  //   setUploading(true)
  //   try {
  //     const base64 = await convertToBase64(selectedFile)
  //     // Call your API to upload the file
  //     const response = await axios.put(
  //       `http://localhost:8017/v1/users/${userId}`,
  //       { avatar: base64 }
  //     )
  //     console.log('Uploaded successfully:', response.data)
  //     setUploading(false)
  //   } catch (error) {
  //     console.error('Error uploading file:', error)
  //     setUploading(false)
  //   }
  // }

  return (
    <Container
      sx={{
        display: 'flex',
        justifyContent: 'center', // căn giữa theo chiều ngang
        alignItems: 'center', // căn giữa theo chiều dọc
        padding: '0',
        '@media (min-width: 600px)': {
          // Thêm media query để điều chỉnh số cột trên mỗi hàng cho các kích thước màn hình lớn hơn 768px
          p: '0',
          mb: '30px'
        }
      }}
    >
      <Box
        flex={1}
        sx={{
          display: 'flex',
          justifyContent: 'center', // căn giữa theo chiều ngang
          alignItems: 'center', // căn giữa theo chiều dọc
          flexDirection: 'column' // sắp xếp theo chiều dọc
        }}
      >
        <Card
          sx={{
            width: 100,
            height: 100,
            borderRadius: '50%',
            overflow: 'hidden'
          }}
        >
          <label htmlFor='avatar-input'>
            {image ? (
              <CardMedia
                component='img'
                height='100%'
                image={image}
                alt='Selected'
                sx={{ objectFit: 'cover' }}
              />
            ) : (
              <CardContent sx={{ textAlign: 'center', cursor: 'pointer', padding: 0 }}>
                <CardMedia component='img' height='100%' image={defaultAvatar} alt='Default' sx={{ objectFit: 'cover' }} />
              </CardContent>
            )}
          </label>
          <input
            accept='image/*'
            style={{ display: 'none' }}
            id='avatar-input'
            type='file'
            onChange={handleFileChange}
          />
        </Card>
      </Box>

      <Box
        flex={2}
        sx={{
          textAlign: 'center'
        }}
      >
        <Typography
          sx={{
            fontWeight: '600',
            fontSize: '20px',
            letterSpacing: '0.5px',
            margin: '6px 0'
          }}
        >
          {displayNameUser}
        </Typography>
        <Typography
          sx={{
            fontWeight: '400',
            fontSize: '16px',
            letterSpacing: '0.5px',
            margin: '6px 0',
            fontStyle: 'italic'
          }}
        >
          {userNameUser}
        </Typography>
      </Box>
    </Container>
  )
}

export default function Account({
  emailUser,
  userNameUser,
  displayNameUser,
  userId
}) {
  const [displayName, setDisplayName] = useState(displayNameUser)
  const [uploading, setuploading] = useState(null)
  useEffect(() => {
    setDisplayName(displayNameUser)
  }, [displayNameUser])

  const handleSubmit = async () => {
    // Handle form submission here
    setuploading(true);
    let url = null
    if (avatar) {
      const formdtata = new FormData()
      formdtata.append('file', avatar)
      url = await axios.post('http://localhost:8017/upload', formdtata)
    }
    const updateData = {
      displayName: displayName,
      avatar: url.data
    }
    try {
      await updateUserByIdAPI(userId, updateData)
      setuploading(false)
      toast.success('Update Success !')
    } catch (err) {
      toast.error('Change DisplayName Fail!')
    }
  }

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          height: (theme) => `calc(80vh -
            ${theme.trello.appBarHeight}
          )`,
          paddingTop: '50px',
          bgcolor: (theme) =>
            theme.palette.mode === 'dark' ? '#34495E' : '#fff'
        }}
      >
        <div style={{ width: '400px', padding: '16px 16px' }}>
          <CircularImageBox
            userId={userId}
            displayNameUser={displayName}
            userNameUser={'@' + userNameUser}
            sx={{
              mb: '20px'
            }}
          />
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              bgcolor: (theme) =>
                theme.palette.mode === 'dark' ? '#rgba(0,0,0,0.12)' : '#fff',
              height: '80px',
              alignItems: 'center',
              justifyContent: 'center',
              paddingTop: '18px',
              borderRadius: '5px',
              marginBottom: '16px',
              boxShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px'
            }}
          >
            <TextField
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
                startAdornment: (
                  <InputAdornment position='start'>
                    <Email></Email>
                  </InputAdornment>
                ),
                sx: {
                  width: '100%'
                },
                disabled: true,
                value: emailUser
              }}
              InputLabelProps={{
                sx: {
                  width: '100%',
                  marginLeft: '8px',
                  fontSize: '16px'
                }
              }}
            />
          </Box>

          <Box
            sx={{
              width: '100%',
              display: 'flex',
              bgcolor: (theme) =>
                theme.palette.mode === 'dark' ? '#rgba(0,0,0,0.12)' : '#fff',
              height: '80px',
              alignItems: 'center',
              justifyContent: 'center',
              paddingTop: '18px',
              borderRadius: '5px',
              marginBottom: '16px',
              boxShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px'
            }}
          >
            <TextField
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
                startAdornment: (
                  <InputAdornment position='start'>
                    <AccountBoxIcon></AccountBoxIcon>
                  </InputAdornment>
                ),
                sx: {
                  width: '100%'
                },
                disabled: true,
                value: userNameUser
              }}
              InputLabelProps={{
                sx: {
                  width: '100%',
                  marginLeft: '8px',
                  fontSize: '16px'
                }
              }}
            />
          </Box>

          <Box
            sx={{
              width: '100%',
              display: 'flex',
              bgcolor: (theme) =>
                theme.palette.mode === 'dark' ? '#rgba(0,0,0,0.12)' : '#fff',
              height: '80px',
              alignItems: 'center',
              justifyContent: 'center',
              paddingTop: '18px',
              borderRadius: '5px',
              marginBottom: '16px',
              boxShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px'
            }}
          >
            <TextField
              label='Your Display Name'
              id='outlined-start-adornment'
              sx={{
                p: 1.5,
                width: '100%',
                '& input': {
                  padding: '12px 8px'
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <AssignmentIndIcon></AssignmentIndIcon>
                  </InputAdornment>
                ),
                sx: {
                  width: '100%'
                },
                value: displayName
              }}
              InputLabelProps={{
                sx: {
                  width: '100%',
                  marginLeft: '8px',
                  fontSize: '16px'
                }
              }}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </Box>

          <Stack>
            <Button
              sx={{ padding: '10px 0' }}
              variant='contained'
              onClick={() => handleSubmit()}
            >
              Update
              {uploading && <CircularProgress size={24} sx = {{ color: 'white', ml: 2 }} />}
            </Button>
          </Stack>
        </div>
      </Box>
    </Box>
  )
}

// function convertToBase64(file) {
//   return new Promise((resolve, reject) => {
//     const fileReader = new FileReader()
//     fileReader.readAsDataURL(file)
//     fileReader.onload = () => {
//       resolve(fileReader.result)
//     }
//     fileReader.onerror = (error) => {
//       reject(error)
//     }
//   })
// }
