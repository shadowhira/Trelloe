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
import Paper from '@mui/material/Paper'

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
      // console.log('🐛: ➡️ handleSubmit ➡️ formValues:', formValues)
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
      <Grid container component="main" sx={{ height: '100vh' }}>
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(https://source.unsplash.com/random?wallpapers)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>

          <Container component="main" maxWidth="xs" >
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
                  mt: 3
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
                  <Grid item sx={{ margin: 'auto' }}>
                    <Link href="/login" variant="body2">
                      Already have an account? Sign in
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Container>
        </Grid>
      </Grid>
    </ThemeProvider>
  )
}

export default SignUpSide
