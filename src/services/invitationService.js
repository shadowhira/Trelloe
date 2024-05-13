import { invitationModel } from '~/models/invitationModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { userModel } from '~/models/userModel'
import { ObjectId } from 'mongodb'
import { boardModel } from '~/models/boardModel'

// Tạo mới lời mời
const createNew = async (reqBody) => {
  try {
    const { inviterId, inviteeId, boardInvitation } = reqBody

    // Kiểm tra điều kiện inviterId và inviteeId khác nhau
    if (inviterId === inviteeId) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Inviter and invitee must be different')
    }

    // Kiểm tra xem lời mời đã tồn tại chưa
    const existingInvitation1 = await invitationModel.findOneByCondition({
      inviterId: new ObjectId(inviterId),
      inviteeId: new ObjectId(inviteeId),
      'boardInvitation.boardId': boardInvitation.boardId ? new ObjectId(boardInvitation.boardId) : null,
      $or: [
        { 'boardInvitation.status': 'accepted' },
        { 'boardInvitation.status': 'pending' }
      ]
    })
    const existingInvitation2 = await invitationModel.findOneByCondition({
      inviteeId: new ObjectId(inviterId),
      inviterId: new ObjectId(inviteeId),
      'boardInvitation.boardId': boardInvitation.boardId ? new ObjectId(boardInvitation.boardId) : null,
      $or: [
        { 'boardInvitation.status': 'accepted' },
        { 'boardInvitation.status': 'pending' }
      ]
    })

    if (existingInvitation1 || existingInvitation2) {
      throw new ApiError(StatusCodes.CONFLICT, 'Invitation already exists') // Trả về khi đã có lời mời
    }

    const invitee = await userModel.findOneById(inviteeId)
    const boardOrderIds = invitee.boardOrderIds

    if (boardOrderIds.includes(boardInvitation.boardId)) {
      // console.log('yes')
      throw new ApiError(StatusCodes.CONFLICT, 'Invitation already exists')
    }

    // Kiểm tra loại bảng trước khi tạo lời mời
    const board = await boardModel.findOneById(boardInvitation.boardId) // Truy vấn bảng
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found')
    }

    if (board.type !== 'public') { // Chỉ cho phép tạo lời mời nếu bảng là 'public'
      throw new ApiError(StatusCodes.FORBIDDEN, 'Invitation can only be created for public boards')
    }

    // Tạo lời mời mới nếu điều kiện hợp lệ
    const createdInvitation = await invitationModel.createNew(reqBody)
    // Cập nhật boardOrderIds của invitee
    // await userModel.pushBoardOrderIds({
    //   userId: inviteeId,
    //   _id: boardInvitation.boardId // Sử dụng _id của bảng để thêm vào boardOrderIds
    // })

    // await boardModel.pushMemberIds(inviteeId, boardInvitation.boardId)

    const getNewInvitation = await invitationModel.findOneById(createdInvitation.insertedId)

    if (!getNewInvitation) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Invitation creation failed')
    }

    return getNewInvitation // Trả lại lời mời mới tạo
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}

// Tìm lời mời theo ID
const findOneById = async (invitationId) => {
  try {
    const foundInvitation = await invitationModel.findOneById(invitationId)

    if (!foundInvitation) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Invitation not found')
    }

    return foundInvitation
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}

// Cập nhật lời mời
const update = async (invitationId, reqBody) => {
  try {
    if (reqBody.boardInvitation && reqBody.boardInvitation.boardId) {
      reqBody.boardInvitation.boardId = new ObjectId(reqBody.boardInvitation.boardId)
    }
    const updatedInvitation = await invitationModel.update(invitationId, reqBody)

    if (!updatedInvitation) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Invitation not found')
    }

    return updatedInvitation
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}

// Xóa lời mời
const deleteItem = async (invitationId) => {
  try {
    const foundInvitation = await invitationModel.findOneById(invitationId)

    if (!foundInvitation) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Invitation not found')
    }

    await invitationModel.deleteItem(invitationId)

    return { message: 'Invitation deleted successfully!' } // Phản hồi khi xóa thành công
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}

const getInvitationsForUser = async (inviteeId) => {
  try {
    const invitations = await invitationModel.findInvitationsForUser(inviteeId)
    return invitations
  } catch (error) {
    throw new Error(`Error getting invitations for user: ${error.message}`)
  }
}
// Xuất các chức năng của invitationService
export const invitationService = {
  createNew,
  findOneById,
  update,
  deleteItem,
  getInvitationsForUser
}
