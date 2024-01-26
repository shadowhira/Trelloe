import { experimental_extendTheme as extendTheme } from '@mui/material/styles'
import { teal, deepOrange, cyan, orange } from '@mui/material/colors'

// Create a theme instance.
const theme = extendTheme({
  trello: {
    appBarHeight: '58px',
    boardBarHeight: '60px'
  },
  colorSchemes: {
    // light: {
    //   palette: {
    //     primary: teal,
    //     secondary: deepOrange
    //   }
    // },
    // dark: {
    //   palette: {
    //     primary: cyan,
    //     secondary: orange
    //   }
    // }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          '*::-webkit-scrollbar': {
            width: '8px',
            height: '6px'
          },
          '*::-webkit-scrollbar-thumb': {
            backgroundColor: '#dcdde1',
            // backgroundColor: 'red',
            borderRadius: '8px'
          },
          '*::-webkit-scrollbar-thumb:hover': {
            backgroundColor: 'white'
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderWidth: '1px',
          '&: hover': { borderWidth: '2px' }
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: ({ theme }) => ({
          // color: theme.palette.primary.main,
          fontSize: '0.875rem'
        })
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => {
          return {
            // color: theme.palette.primary.main,
            fontSize: '0.875rem',
            // '.MuiOutlinedInput-notchedOutline': {
            //   borderColor: theme.palette.primary.light
            // },
            // '&:hover': {
            //   '.MuiOutlinedInput-notchedOutline': {
            //     borderColor: theme.palette.primary.main
            //   }
            // },
            '& fieldset': { borderWidth: '1px !important' },
            '&:hover fieldset': { borderWidth: '2px !important' },
            '&.Mui-focused fieldset': { borderWidth: '2px !important' }
          }
        }
      }
    }
  }
})

export default theme