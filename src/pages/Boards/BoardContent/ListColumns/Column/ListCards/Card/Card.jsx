import AttachmentIcon from '@mui/icons-material/Attachment'
import CommentIcon from '@mui/icons-material/Comment'
import GroupIcon from '@mui/icons-material/Group'
import Button from '@mui/material/Button'
import { Card as MuiCard } from '@mui/material'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'

function Card({ temporaryHideMedia }) {
  if (temporaryHideMedia) {
    return (
      <MuiCard sx={{
        cursor: 'pointer',
        boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
        overflow: 'unset'
      }}>
        <CardContent sx={{
          p: 1.5,
          '&:last-child': { p: 1.5 }
        }}>
          <Typography>Card test 01</Typography>
        </CardContent>
      </MuiCard>
    )
  }
  return (
    <MuiCard sx={{
      cursor: 'pointer',
      boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
      overflow: 'unset'
    }}>
      <CardMedia
        sx={{ height: 140 }}
        image="https://shadowhira.github.io/resource.jpg"
        title="lady"
      />
      <CardContent sx={{
        p: 1.5,
        '&:last-child': { p: 1.5 }
      }}>
        <Typography>Lady</Typography>
      </CardContent>
      <CardActions sx={{ p: '0 4px 8px 4px' }}>
        <Button size="small" startIcon={<GroupIcon />}>999</Button>
        <Button size="small" startIcon={<CommentIcon />}>10</Button>
        <Button size="small" startIcon={<AttachmentIcon />}>99</Button>
      </CardActions>
    </MuiCard>
  )
}

export default Card