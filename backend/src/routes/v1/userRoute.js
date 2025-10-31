import express from 'express'
import { userController } from '~/controllers/userController'
import { userValidation } from '~/validations/userValidation'

const Router = express.Router()

Router.route('/')
  .get(userController.getAllUsers)
  .post(userValidation.createNew, userController.createNew)

Router.route('/pushBoard')
  .put(userController.pushBoardToBoardOrderIds)

Router.route('/checkPassword/:id')
  .post(userController.checkPassword)

Router.route('/userId/:id')
  .get(userController.getDetails)
  .put(userValidation.update, userController.update)
  .delete(userValidation.deleteItem, userController.deleteItem)

Router.route('/email')
  .get(userController.findByEmail)

export const userRoute = Router