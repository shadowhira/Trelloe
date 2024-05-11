import React from 'react'
import { useState } from 'react'
import { Box, Stack } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import Input from '@mui/material/Input'
import FilledInput from '@mui/material/FilledInput'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputLabel from '@mui/material/InputLabel'
import InputAdornment from '@mui/material/InputAdornment'
import FormHelperText from '@mui/material/FormHelperText'
import FormControl from '@mui/material/FormControl'
import TextField from '@mui/material/TextField'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import AppBar from '~/components/AppBar/AppBar'
import UserBar from './UserBar'
import { Email } from '@mui/icons-material'
import AccountBoxIcon from '@mui/icons-material/AccountBox'
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd'
import { Button, Card, CardContent, CardMedia, Container, Typography } from '@mui/material'
import Resizer from 'react-image-file-resizer'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'

const CircularImageBox = ({ displayNameUser, userNameUser }) => {
  const [image, setImage] = useState(null)

  const handleFileChange = (event) => {
    const file = event.target.files[0]

    Resizer.imageFileResizer(
      file,
      500, // Chiều rộng mới
      500, // Chiều cao mới
      'JPEG', // Định dạng mới
      100, // Chất lượng
      0, // Độ quay (0 = không quay)
      (uri) => {
        setImage(uri)
      },
      'base64' // Định dạng đầu ra (ở đây là base64)
    )
  }

  return (
    <Container
      sx={{
        display: 'flex',
        justifyContent: 'center', // căn giữa theo chiều ngang
        alignItems: 'center', // căn giữa theo chiều dọc
        padding: '0',
        '@media (min-width: 600px)': { // Thêm media query để điều chỉnh số cột trên mỗi hàng cho các kích thước màn hình lớn hơn 768px
          p: '0'
        }
      }}
    >
      <Box flex={1}
        sx={{
          display: 'flex',
          justifyContent: 'center', // căn giữa theo chiều ngang
          alignItems: 'center', // căn giữa theo chiều dọc
          flexDirection: 'column' // sắp xếp theo chiều dọc
        }}
      >
        <Card sx={{ width: 100, height: 100, borderRadius: '50%', overflow: 'hidden' }}>
          {image ? (
            <CardMedia
              component="img"
              height="100%"
              image={image}
              alt="Selected"
              sx={{ objectFit: 'cover' }}
            />
          ) : (
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="body1">No image selected</Typography>
            </CardContent>
          )}
        </Card>
        <input
          accept="image/*"
          style={{ display: 'none' }}
          id="contained-button-file"
          multiple
          type="file"
          onChange={handleFileChange}
        />
        <label htmlFor="contained-button-file">
          <Button variant="contained" component="span"
            sx={{
              mb: '16px',
              mt: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <CloudUploadIcon
              sx={{ mr: '6px' }}
            ></CloudUploadIcon>
                        Upload
          </Button>
        </label>
      </Box>

      <Box flex={2}
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
        >{displayNameUser}</Typography>
        <Typography
          sx={{
            fontWeight: '400',
            fontSize: '16px',
            letterSpacing: '0.5px',
            margin: '6px 0',
            fontStyle: 'italic'
          }}
        >{userNameUser}</Typography>
      </Box>
    </Container>
  )
}


function Account({ emailUser, userNameUser, displayNameUser }) {
  const [displayName, setDisplayName] = useState(displayNameUser)


  const handleSubmit = (event) => {
    // Handle form submission here
    console.log('Submitted:', { emailUser, userNameUser, displayName })
  }

  return (
    <Box>
      <AppBar></AppBar>
      <UserBar activeText={'Account'}></UserBar>
      <Box sx={{ display: 'flex', justifyContent: 'center', height: '90vh', paddingTop: '50px', bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495E' : '#fff') }}>
        <div style={{ width: '400px', padding: '16px 16px' }}>
          <CircularImageBox displayNameUser={displayName} userNameUser={'@' + userNameUser} />
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#545454' : '#ECEAF7'),
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
              label="Your Email"
              id="outlined-start-adornment"
              sx={{
                p: 1.5,
                width: '100%',
                '& input': {
                  padding: '12px 8px'
                }
              }}
              InputProps={{
                startAdornment: <InputAdornment position="start">
                  <Email></Email>
                </InputAdornment>,
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
              bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#545454' : '#ECEAF7'),
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
              label="Your Username"
              id="outlined-start-adornment"
              sx={{
                p: 1.5,
                width: '100%',
                '& input': {
                  padding: '12px 8px'
                }
              }}
              InputProps={{
                startAdornment: <InputAdornment position="start">
                  <AccountBoxIcon></AccountBoxIcon>
                </InputAdornment>,
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
              bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#rgba(0,0,0,0.12)' : '#fff'),
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
              label="Your Display Name"
              id="outlined-start-adornment"
              sx={{
                p: 1.5,
                width: '100%',
                '& input': {
                  padding: '12px 8px'
                }
              }}
              InputProps={{
                startAdornment: <InputAdornment position="start">
                  <AssignmentIndIcon></AssignmentIndIcon>
                </InputAdornment>,
                sx: {
                  width: '100%'
                },
                defaultValue: displayNameUser

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
              variant="contained"
              onClick={() => handleSubmit()}
            >
                            Update
            </Button>
          </Stack>
        </div>
      </Box>
    </Box>
  )
}

export default Account