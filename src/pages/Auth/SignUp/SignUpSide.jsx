/* eslint-disable no-useless-escape */
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { Container } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { checkAuthAPI, checkSignupAPI } from '~/apis'

function SignUpSide() {
  const [auth, setAuth] = useState(false)
  const navigate = useNavigate()
  axios.defaults.withCredentials = true

  useEffect(() => {
    checkAuthAPI()
      .then((res) => {
        if (res.status === 'Success') {
          setAuth(true)
          if (res.role === 'user' ) navigate('/')
          else navigate('/admin')
        } else {
          setAuth(false)
        }
      })
      .catch((err) => {
        console.error('Lỗi khi kiểm tra xác thực:', err)
        setAuth(false)
      })
  }, [navigate])

  const [formValues, setFormValues] = useState({
    username: '',
    email: '',
    password: '',
    passwordConfirm: '',
    allowExtraEmails: false
  })

  const [formErrors, setFormErrors] = useState({})

  const validate = () => {
    const errors = {}

    if (!formValues.username.trim()) {
      errors.username = 'Vui lòng nhập tên người dùng'
    }
    if (!formValues.email.trim()) {
      errors.email = 'Vui lòng nhập email'
    } else {
      const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
      if (!emailRegex.test(formValues.email)) {
        errors.email = 'Email không hợp lệ'
      }
    }
    if (!formValues.password) {
      errors.password = 'Vui lòng nhập mật khẩu'
    }
    if (!formValues.passwordConfirm) {
      errors.passwordConfirm = 'Vui lòng nhập xác nhận mật khẩu'
    } else if (formValues.password !== formValues.passwordConfirm) {
      errors.passwordConfirm = 'Xác nhận mật khẩu không trùng khớp'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validate()) {
      const { email, password, username } = formValues
      console.log('🐛: ➡️ handleSubmit ➡️ formValues:', formValues)
      checkSignupAPI(email, password, username)
        .then((res) => {
          if (res.status === 'Success') {
            toast.success('Đăng ký thành công.')
            navigate('/login')
          } else {
            toast.error(res.error)
          }
        })
        .catch(() => {
          toast.error('Đăng ký thất bại. Vui lòng thử lại.')
        })
    }
  }

  const defaultTheme = createTheme()

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs" sx={{ backgroundImage: 'url(data:image/jpeg;base64,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)' }}>
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit}
            sx={{
              mt: 3,
              'input[type="password"], input[type="text"]': { padding: '1.6em' }
            }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="given-name"
                  name="username"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  autoFocus
                  value={formValues.username}
                  onChange={handleChange}
                  error={!!formErrors.username}
                  helperText={formErrors.username}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={formValues.email}
                  onChange={handleChange}
                  error={!!formErrors.email}
                  helperText={formErrors.email}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={formValues.password}
                  onChange={handleChange}
                  error={!!formErrors.password}
                  helperText={formErrors.password}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="passwordConfirm"
                  label="Confirm Password"
                  type="password"
                  id="passwordConfirm"
                  autoComplete="new-password"
                  value={formValues.passwordConfirm}
                  onChange={handleChange}
                  error={!!formErrors.passwordConfirm}
                  helperText={formErrors.passwordConfirm}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  )
}

export default SignUpSide
