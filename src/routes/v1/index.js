// đại diện cho route v1
import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardRoute } from './boardRoute'
import { columnRoute } from './columnRoute'
import { cardRoute } from './cardRoute'

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

export const APIs_V1 = Router