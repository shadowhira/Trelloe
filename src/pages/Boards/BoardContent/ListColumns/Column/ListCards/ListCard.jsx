import Box from '@mui/material/Box'
import Card from './Card/Card'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

function ListCard({ cards, deleteCardDetails }) {
  return (
    <SortableContext items={cards?.map(card => card._id)} strategy={verticalListSortingStrategy}>
      <Box sx={{
        p: '0 5px 5px 5px',
        m: '0 5px',
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        // overflow: 'auto',
        overflowX: 'hidden',
        overflowY: 'auto',
        // overflow: 'unset',
        maxHeight: (theme) => `calc(
                ${theme.trello.boardContentHeight} -
                ${theme.spacing(3)} -
                ${theme.trello.columnHeaderHeight} -
                ${theme.trello.columnFooterHeight}
              )`,
        // maxHeight: (theme) => `calc(${theme.trello.boardContentHeight} - ${theme.spacing(3)})`,
        '&::-webkit-scrollbar-thumb': { backgroundColor: '#ced0da' },
        '&::-webkit-scrollbar-thumb:hover': { backgroundColor: '#bfc2cf' }
      }}
      >
        {cards?.map(card => {
          return <Card sx={{ overflow: 'unset' }} key={card._id} card={card} deleteCardDetails={deleteCardDetails} />
        })}
      </Box>
    </SortableContext>

  )
}

export default ListCard