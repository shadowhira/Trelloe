import express from 'express'
import { authController } from '~/controllers/authController'
import { userValidation } from '~/validations/userValidation'

const Router = express.Router();

Router.post('/signup', userValidation.signup, authController.signup)

Router.post('/login', authController.login)

Router.post('/logout', authController.logout)

export const authRoute = Router
