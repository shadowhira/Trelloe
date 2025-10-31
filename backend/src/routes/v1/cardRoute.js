import express from 'express'
import { cardValidation } from '~/validations/cardValidation'
import { cardController } from '~/controllers/cardController'

const Router = express.Router()

Router.route('/')
  .post(cardValidation.createNew, cardController.createNew)

Router.route('/:cardId')
  .put(cardValidation.update, cardController.update)
  .delete(cardValidation.deleteItem, cardController.deleteItem)

export const cardRoute = Router