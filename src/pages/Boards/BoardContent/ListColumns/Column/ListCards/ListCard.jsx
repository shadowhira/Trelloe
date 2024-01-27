import Box from '@mui/material/Box'
import Card from './Card/Card'

function ListCard() {
  return (
    <Box sx={{
      p: '0 5px',
      m: '0 5px',
      display: 'flex',
      flexDirection: 'column',
      gap: 1,
      overflowX: 'hidden',
      overflowY: 'auto',
      maxHeight: (theme) => `calc(
              ${theme.trello.boardContentHeight} -
              ${theme.spacing(3)} -
              ${(theme) => theme.trello.columnHeaderHeight} -
              ${(theme) => theme.trello.columnFooterHeight}
            )`,
      '&::-webkit-scrollbar-thumb': { backgroundColor: '#ced0da' },
      '&::-webkit-scrollbar-thumb:hover': { backgroundColor: '#bfc2cf' }
    }}
    >
      {/* Card Media */}
      <Card />
      <Card />

      {/* Card content */}
      <Card temporaryHideMedia />
      <Card temporaryHideMedia />
      <Card temporaryHideMedia />
      <Card temporaryHideMedia />
      <Card temporaryHideMedia />
      <Card temporaryHideMedia />
      <Card temporaryHideMedia />
    </Box>
  )
}

export default ListCard