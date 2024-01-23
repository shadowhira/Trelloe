import Box from '@mui/material/Box'

function index() {
  return (
    <Box sx={{
      backgroundColor: 'white',
      width: '100%',
      height: (theme) => theme.trello.boardBarHeight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      overflowX: 'auto'
    }}>
            Board Bar
    </Box>
  )
}

export default index