import LockIcon from '@mui/icons-material/Lock'
import LockResetIcon from '@mui/icons-material/LockReset'
import PasswordIcon from '@mui/icons-material/Password'
import { Box, Button, Stack, Typography } from '@mui/material'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { checkPasswordAPI, updateUserByIdAPI } from '~/apis'

export default function Security({ userId, password }) {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [errorCurrentPassword, setErrorCurrentPassword] = useState(false)
  const [errorNewPassword, setErrorNewPassword] = useState(false)
  const [errorConfirmNewPassword, setErrorConfirmNewPassword] = useState(false)
  const [passwordsMatch, setPasswordsMatch] = useState(true)

  const handleUpdate = async () => {
    setErrorCurrentPassword(!currentPassword)
    setErrorNewPassword(!newPassword)
    setErrorConfirmNewPassword(!confirmNewPassword)
    setPasswordsMatch(newPassword === confirmNewPassword)

    if (!currentPassword) {
      setErrorCurrentPassword(true)
    } else {
      setErrorCurrentPassword(false)
    }

    if (!newPassword) {
      setErrorNewPassword(true)
    } else {
      setErrorNewPassword(false)
    }

    if (!confirmNewPassword) {
      setErrorConfirmNewPassword(true)
    } else {
      setErrorConfirmNewPassword(false)
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordsMatch(false)
    }
    if (
      currentPassword &&
      newPassword &&
      confirmNewPassword &&
      newPassword === confirmNewPassword
    ) {
      try {
        const checkData = {
          currentPassword: currentPassword
        }
        const checkCurrentPassword = await checkPasswordAPI(userId, checkData)
        if (checkCurrentPassword.status !== 'Success') {
          toast.error('Current Password is incorrect!')
          return
        }
      } catch (err) {
        toast.error('Current Password is incorrect!')
        return
      }
      // Your update logic here
      try {
        const updateData = {
          password: newPassword
        }
        const response = await updateUserByIdAPI(userId, updateData)
        if (response.status === 'Success') toast.success('Change Password Success!')
        else {
          toast.error('Change Password Fail!')
        }
      } catch (err) {
        toast.error('Change Password Fail!')
      }
    }
  }

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          height: (theme) => `calc(90vh -
            ${theme.trello.appBarHeight}
          )`,
          paddingTop: '50px',
          bgcolor: (theme) =>
            theme.palette.mode === 'dark' ? '#34495E' : '#fff'
        }}
      >
        <div style={{ width: '400px', padding: '16px 16px' }}>
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
            <Typography
              sx={{
                fontWeight: 'bold',
                fontSize: '32px'
              }}
            >
              Security Dashboard
            </Typography>
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
              boxShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px',
              flexDirection: 'column'
            }}
          >
            <TextField
              error={errorCurrentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              helperText={
                errorCurrentPassword ? 'Please enter this field.' : ''
              }
              type='password'
              label='Current Password'
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
                    <PasswordIcon></PasswordIcon>
                  </InputAdornment>
                ),
                sx: {
                  width: '100%'
                }
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
              error={errorNewPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              helperText={errorNewPassword ? 'Please enter this field.' : ''}
              type='password'
              label='New Password'
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
                    <LockIcon></LockIcon>
                  </InputAdornment>
                ),
                sx: {
                  width: '100%'
                }
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
              error={!passwordsMatch || errorConfirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              // helperText={(!passwordsMatch && !errorConfirmNewPassword) ? 'Passwords do not match.' : (errorConfirmNewPassword ? 'Please enter this field.' : '')}
              helperText={
                errorConfirmNewPassword
                  ? 'Please enter this field.'
                  : !passwordsMatch
                    ? 'Passwords do not match.'
                    : ''
              }
              type='password'
              label='New Password Confirm'
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
                    <LockResetIcon></LockResetIcon>
                  </InputAdornment>
                ),
                sx: {
                  width: '100%'
                }
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

          <Stack>
            <Button
              sx={{ padding: '10px 0' }}
              variant='contained'
              onClick={handleUpdate}
            >
              Update
            </Button>
          </Stack>
        </div>
      </Box>
    </Box>
  )
}
