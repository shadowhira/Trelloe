import Joi from 'joi'
import { GET_DB } from '~/config/mongodb'
import { ObjectId } from 'mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

// Tên collection cho lời mời
const INVITATION_COLLECTION_NAME = 'invitations'

// Schema cho lời mời sử dụng Joi
const INVITATION_COLLECTION_SCHEMA = Joi.object({
  inviterId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  inviteeId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  type: Joi.string().required(), // Loại lời mời
  boardInvitation: Joi.object({
    boardId: Joi.string().pattern(OBJECT_ID_RULE).optional(),
    status: Joi.string().default('pending') // Trạng thái lời mời
  }),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  destroy: Joi.boolean().default(false)
})

// Chỉ định các fields không được cập nhật
const INVALID_UPDATE_FIELDS = ['_id', 'createdAt']

// Validate dữ liệu trước khi tạo mới
const validateBeforeCreate = async (data) => {
  return await INVITATION_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

// Tạo lời mời mới
const createNew = async (data) => {
  try {
    const validateData = await validateBeforeCreate(data)
    const newInvitationToAdd = {
      ...validateData,
      inviterId: new ObjectId(validateData.inviterId),
      inviteeId: new ObjectId(validateData.inviteeId),
      boardInvitation: {
        ...validateData.boardInvitation,
        boardId: validateData.boardInvitation.boardId ? new ObjectId(validateData.boardInvitation.boardId) : undefined
      }
    }
    const createdInvitation = await GET_DB().collection(INVITATION_COLLECTION_NAME).insertOne(newInvitationToAdd)
    return createdInvitation
  } catch (error) {
    throw new Error(`Error creating invitation: ${error.message}`)
  }
}

// Tìm lời mời theo ID
const findOneById = async (invitationId) => {
  try {
    const invitation = await GET_DB().collection(INVITATION_COLLECTION_NAME).findOne({
      _id: new ObjectId(invitationId)
    })
    if (!invitation) {
      throw new Error('Invitation not found')
    }
    return invitation
  } catch (error) {
    throw new Error(`Error finding invitation: ${error.message}`)
  }
}

// Cập nhật lời mời
const update = async (invitationId, updateData) => {
  try {
    Object.keys(updateData).forEach((key) => {
      if (INVALID_UPDATE_FIELDS.includes(key)) {
        delete updateData[key]
      }
    })

    const updatedInvitation = await GET_DB().collection(INVITATION_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(invitationId) },
      { $set: updateData },
      { returnDocument: 'after' }
    )

    if (!updatedInvitation) {
      throw new Error('Invitation not found')
    }

    return updatedInvitation
  } catch (error) {
    throw new Error(`Error updating invitation: ${error.message}`)
  }
}

// Xóa lời mời
const deleteItem = async (invitationId) => {
  try {
    const deletedInvitation = await GET_DB().collection(INVITATION_COLLECTION_NAME).findOneAndDelete({
      _id: new ObjectId(invitationId)
    })

    if (!deletedInvitation) {
      throw new Error('Invitation not found')
    }

    return deletedInvitation
  } catch (error) {
    throw new Error(`Error deleting invitation: ${error.message}`)
  }
}

const findOneByCondition = async (condition) => {
  try {
    const invitation = await GET_DB().collection(INVITATION_COLLECTION_NAME).findOne(condition)
    return invitation
  } catch (error) {
    throw new Error(`Error finding invitation by condition: ${error.message}`)
  }
}

const deleteManyItem = async (boardId) => {
  try {
    await GET_DB().collection(INVITATION_COLLECTION_NAME).deleteMany({
      'boardInvitation.boardId': boardId
    })
  } catch (error) {
    throw new Error(`Error finding invitation by condition: ${error.message}`)
  }
}

const findInvitationsForUser = async (inviteeId) => {
  try {
    const invitations = await GET_DB().collection(INVITATION_COLLECTION_NAME).find({
      'inviteeId': new ObjectId(inviteeId)
      // 'boardInvitation.status': 'pending'
    }).toArray()
    return invitations
  } catch (error) {
    throw new Error(`Error finding invitations for user: ${error.message}`)
  }
}

const findInvitationsByInviterId = async (inviterId) => {
  try {
    const invitations = await GET_DB().collection(INVITATION_COLLECTION_NAME).find({
      'inviterId': new ObjectId(inviterId)
      // 'boardInvitation.status': 'pending'
    }).toArray()
    return invitations
  } catch (error) {
    throw new Error(`Error finding invitations for user: ${error.message}`)
  }
}

// Xuất mô hình và các chức năng
export const invitationModel = {
  INVITATION_COLLECTION_NAME,
  INVITATION_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  update,
  deleteItem,
  deleteManyItem,
  findOneByCondition,
  findInvitationsByInviterId,
  findInvitationsForUser
}
