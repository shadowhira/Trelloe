import * as React from 'react'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import PersonIcon from '@mui/icons-material/Person'
import SecurityIcon from '@mui/icons-material/Security'
import Account from './Account'
import Security from './Security'
import axios from 'axios'
import { getUserByIdAPI, getUserIdByTokenAPI } from '~/apis'
import AppBar from '~/components/AppBar/AppBar'

export default function UserDetail() {
  const [value, setValue] = React.useState('1')
  const [email, setEmail] = React.useState('')
  const [username, setUsername] = React.useState('')
  const [displayName, setDisplayName] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [id, setId] = React.useState('')

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const fetchUserId = async () => {
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];
      const response = await getUserIdByTokenAPI({
        headers: {
          Authorization: `Bearer ${token}` // Gửi token trong header
        }
      })
      return response.userId // Lấy userId từ phản hồi
    } catch (error) {
      return
    }
  }

  React.useEffect(() => {
    const fetchData = async () => {
      const userId = await fetchUserId() // Gọi fetchUserId để lấy userId
      if (userId) {
        const response = await getUserByIdAPI(userId)
        setEmail(response.email)
        setDisplayName(response.displayName)
        setPassword(response.password)
        setUsername(response.username)
        setId(userId)
      }
    }
    fetchData()
    // Gọi fetchData khi component được render
  }, []) // Chỉ gọi lại useEffect khi userId thay đổi



  return (
    <Box>
      <AppBar />
      <TabContext value={value} >
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList
            onChange={handleChange}
            aria-label='lab API tabs example'
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              bgcolor: (theme) =>
                theme.palette.mode === 'dark' ? '#34495E' : '#fff',
            }}
          >
            <Tab
              icon={<PersonIcon sx={{ mr: '6px' }} />}
              label='Account'
              value='1'
              sx={{
                fontSize: '16px',
                textTransform: 'none', // Không viết hoa nhãn
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            />
            <Tab
              icon={<SecurityIcon sx={{ mr: '6px' }} />}
              label='Security'
              value='2'
              sx={{
                fontSize: '16px',
                textTransform: 'none', // Không viết hoa nhãn
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            />
          </TabList>
        </Box>
        <TabPanel
          value='1'
          sx={{
            bgcolor: (theme) =>
              theme.palette.mode === 'dark' ? '#34495E' : '#fff',
          }}
        >
          <Account
            emailUser={email ? email : ''}
            userNameUser={username ? username : ''}
            displayNameUser= {displayName}
            userId= {id}
          ></Account>
        </TabPanel>
        <TabPanel
          value='2'
          sx={{
            bgcolor: (theme) =>
              theme.palette.mode === 'dark' ? '#34495E' : '#fff',
          }}
        >
          <Security userId= {id}/>
        </TabPanel>
        <TabPanel value='3'>Item Three</TabPanel>
      </TabContext>
    </Box>
  )
}
