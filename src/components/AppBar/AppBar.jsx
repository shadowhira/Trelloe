import AppsIcon from '@mui/icons-material/Apps'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import Box from '@mui/material/Box'
import SvgIcon from '@mui/material/SvgIcon'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { ReactComponent as TrelloIcon } from '~/assets/trello.svg'
import ModeSelect from '~/components/ModeSelect/ModeSelect'
import CreateNewBoard from './Menus/CreateNewBoard'
import Notification from './Menus/Notification'
import Profiles from './Menus/Profiles'
import SearchBar from './Menus/SearchBar'
import Starred from './Menus/Starred'
import Templates from './Menus/Templates'
import Workspaces from './Menus/Workspaces'

function AppBar({ updateBoardUpdated }) {
  return (
    <Box sx={{
      width: '100%',
      height: (theme) => theme.trello.appBarHeight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2,
      paddingX: 2,
      // overflowX: 'auto',
      backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#2c3e50': '#1565c0'),
      '&::-webkit-scrollbar-track': { m: 2 }
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <AppsIcon sx={{ color: 'white' }}/>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <SvgIcon component={TrelloIcon} fontSize="small" inheritViewBox sx={{ color: 'white' }} />
          <Typography variant="span" sx={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white' }} >Trello</Typography>
        </Box>

        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
          <Workspaces />
          {/* <Recent /> */}
          <Starred />
          <Templates />
          {/* <Button
            sx={{
              color: 'white',
              border: 'none',
              '&:hover': { border: 'none' }
            }}
            variant="outlined"
            startIcon={<LibraryAddIcon />}
          >
            Create
          </Button> */}
          <CreateNewBoard updateBoardUpdated={updateBoardUpdated} />
        </Box>
      </Box>

      <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 2 }}>
        <SearchBar updateBoardUpdated={updateBoardUpdated} />
        <ModeSelect />
        <Notification updateBoardUpdated={updateBoardUpdated}/>
        <Tooltip title="Help">
          <HelpOutlineIcon sx={{ cursor: 'pointer', color: 'white' }}/>
        </Tooltip>
        <Profiles />
      </Box>
    </Box>
  )
}

export default AppBar