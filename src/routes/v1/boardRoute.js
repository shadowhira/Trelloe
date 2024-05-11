import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardValidation } from '~/validations/boardValidation'
import { boardController } from '~/controllers/boardController'

const Router = express.Router()

Router.route('/')
  .get(boardController.getListBoard)
  .post(boardValidation.createNew, boardController.createNew)

Router.route('/userId/:userId')
  .get(boardController.getListBoardByUserId)

// Router.route('/:id')
//   .get(boardController.getDetails)
//   .put(boardValidation.update, boardController.update)
//   .delete(boardController.deleteBoard)

Router.route('/boardId/:id')
  .get(boardController.getDetails)
  .put(boardValidation.update, boardController.update)
  .delete(boardController.deleteBoard)

Router.route('/supports/moving_card')
  .put(boardValidation.moveCardToDifferentColumn, boardController.moveCardToDifferentColumn)

export const boardRoute = Router