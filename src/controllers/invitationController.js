import { StatusCodes } from 'http-status-codes'
import { invitationService } from '~/services/invitationService'
import ApiError from '~/utils/ApiError'

// Tạo mới lời mời
const createNew = async (req, res, next) => {
  try {
    const createdInvitation = await invitationService.createNew(req.body)

    res.status(StatusCodes.CREATED).json(createdInvitation) // Trả về lời mời mới tạo
  } catch (error) {
    if (error instanceof ApiError && error.status === StatusCodes.BAD_REQUEST) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message }) // Xử lý khi inviterId và inviteeId giống nhau
    } else if (error instanceof ApiError && error.status === StatusCodes.CONFLICT) {
      res.status(StatusCodes.CONFLICT).json({ message: 'Invitation already exists' }) // Xử lý khi lời mời đã tồn tại
    } else {
      next(error) // Chuyển lỗi khác qua middleware xử lý lỗi
    }
  }
}

// Tìm lời mời theo ID
const findOneById = async (req, res, next) => {
  try {
    const invitationId = req.params.id // Lấy ID từ tham số URL
    const foundInvitation = await invitationService.findOneById(invitationId)

    if (!foundInvitation) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Invitation not found' })
    }

    res.status(StatusCodes.OK).json(foundInvitation) // Trả về lời mời đã tìm thấy
  } catch (error) {
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)) // Xử lý lỗi qua middleware
  }
}

// Cập nhật lời mời
const update = async (req, res, next) => {
  try {
    const invitationId = req.params.id // Lấy ID từ tham số URL
    const updatedInvitation = await invitationService.update(invitationId, req.body)

    if (!updatedInvitation) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Invitation not found' })
    }

    res.status(StatusCodes.OK).json(updatedInvitation) // Trả về lời mời đã cập nhật
  } catch (error) {
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)) // Xử lý lỗi qua middleware
  }
}

// Xóa lời mời
const deleteItem = async (req, res, next) => {
  try {
    const invitationId = req.params.id // Lấy ID từ tham số URL
    const deletedInvitation = await invitationService.deleteItem(invitationId)

    if (!deletedInvitation) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Invitation not found' })
    }

    res.status(StatusCodes.OK).json({ message: 'Invitation deleted successfully!' }) // Phản hồi khi xóa thành công
  } catch (error) {
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)) // Chuyển lỗi lên middleware xử lý lỗi
  }
}

// Xuất các chức năng của invitationController
export const invitationController = {
  createNew,
  findOneById,
  update,
  deleteItem
}
