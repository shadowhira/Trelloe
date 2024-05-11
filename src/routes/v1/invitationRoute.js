import express from 'express'
import { invitationController } from '~/controllers/invitationController'

const Router = express.Router()

// Gửi lời mời mới
Router.post('/', invitationController.createNew) // Tạo lời mời mới

// Tìm lời mời theo ID
Router.get('/:id', invitationController.findOneById) // Tìm lời mời theo ID

// Cập nhật lời mời
Router.put('/:id', invitationController.update) // Cập nhật lời mời theo ID

// Xóa lời mời
Router.delete('/:id', invitationController.deleteItem) // Xóa lời mời theo ID

export const invitationRouter = Router