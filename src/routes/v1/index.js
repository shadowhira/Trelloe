// đại diện cho route v1
import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardRoute } from './boardRoute'
import { columnRoute } from './columnRoute'
import { cardRoute } from './cardRoute'
import { userRoute } from './userRoute'

const Router = express.Router()

// Check api/v1/status
Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ message: 'APIs V1 are ready to use.' })
  console.log('🐛: ➡️ Router.get ➡️ req:', req)
})

// Board APIs
Router.use('/boards', boardRoute)

// Column APIs
Router.use('/columns', columnRoute)

// Card APIs
Router.use('/cards', cardRoute)

// User APIs
Router.use('/users', userRoute)


export const APIs_V1 = Router