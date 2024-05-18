/* eslint-disable no-useless-escape */
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Paper from '@mui/material/Paper'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { checkAuthAPI, checkLoginAPI } from '~/apis'
import Cookies from 'js-cookie'

function SignInSide() {
  const [auth, setAuth] = useState(false)
  const [message, setMessage] = useState('')
  const [formErrors, setFormErrors] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    checkAuthAPI()
      .then((res) => {
        if (res.status === 'Success') {
          setAuth(true)
          if (res.role === 'user') navigate('/')
          else navigate('/admin')
        } else {
          setAuth(false)
        }
      })
      .catch(() => {
        setAuth(false)
      })
  }, [navigate])

  const validate = (email, password) => {
    const errors = {}
    if (!email.trim()) {
      errors.email = 'Vui lòng nhập email'
    } else {
      const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
      if (!emailRegex.test(email)) {
        errors.email = 'Email không hợp lệ'
      }
    }
    if (!password) {
      errors.password = 'Vui lòng nhập mật khẩu'
    }
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const email = data.get('email')
    const password = data.get('password')

    if (validate(email, password)) {
      checkLoginAPI(email, password)
        .then((res) => {
          if (res.status === 'Success' && res.role === 'user') {
            Cookies.set('token', res.accessToken, { expires: 7 })
            navigate('/boards')
          } else if (res.status === 'Success' && res.role === 'admin') {
            Cookies.set('token', res.accessToken, { expires: 7 })
            navigate('/admin')
          } else {
            setMessage(res.error)
          }
        })
        .catch(() => {
          toast.error('Đăng nhập thất bại. Vui lòng thử lại.')
          setMessage('Đăng nhập thất bại. Vui lòng thử lại.')
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
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1, mr: 8,
                alignItems: 'center',
                justifyContent: 'center',
                margin: 'auto'
              }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                name="email"
                label="Email Address"
                autoComplete="email"
                autoFocus
                error={!!formErrors.email}
                helperText={formErrors.email}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                autoComplete="current-password"
                error={!!formErrors.password}
                helperText={formErrors.password}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item sx={{ margin: 'auto' }}>
                  <Link href="/signup" variant="body2">
                    {'Don\'t have an account? Sign Up'}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  )
}

export default SignInSide
