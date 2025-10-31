// đại diện cho route v1
import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardRoute } from './boardRoute'
import { columnRoute } from './columnRoute'
import { cardRoute } from './cardRoute'
import { userRoute } from './userRoute'
import { authRoute } from './authRoute'
import { invitationRouter } from './invitationRoute'
import { authenticateTokenRouter } from './authenticateToken'

const Router = express.Router()

// Check api/v1/status
Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ message: 'APIs V1 are ready to use.' })
})

// Board APIs
Router.use('/boards', boardRoute)

// Column APIs
Router.use('/columns', columnRoute)

// Card APIs
Router.use('/cards', cardRoute)

// User APIs
Router.use('/users', userRoute)

// Auth APIs
Router.use('/auth', authRoute)
Router.use('/invitation', invitationRouter)
Router.use('/authenticateToken', authenticateTokenRouter)

export const APIs_V1 = Router