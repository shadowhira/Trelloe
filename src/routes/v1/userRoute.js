import express from 'express'
import { userValidation } from '~/validations/userValidation'
import { userController } from '~/controllers/userController'
import { StatusCodes } from 'http-status-codes'

const Router = express.Router()

Router.route('/')
  .get(userController.getAllUsers)
  .post(userValidation.createNew, userController.createNew)

Router.route('/:id')
  .get(userController.getDetails)
  .put(userValidation.update, userController.update)
  .delete(userValidation.deleteItem, userController.deleteItem)

export const userRoute = Router