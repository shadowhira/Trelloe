import express from 'express'
import { userValidation } from '~/validations/userValidation'
import { userController } from '~/controllers/userController'
import { StatusCodes } from 'http-status-codes'

const Router = express.Router()

Router.route('/')
  .get((req, res) => {
    res.status(StatusCodes.OK).json({ message: 'GET: API get list users.' })
  })
  .post(userValidation.createNew, userController.createNew)

// Router.route('/:id')
//   .put(userValidation.update, userController.update)
//   .delete(userValidation.deleteItem, userController.deleteItem)

export const userRoute = Router