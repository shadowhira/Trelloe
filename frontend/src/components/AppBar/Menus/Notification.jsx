import React, { useState, useEffect, useRef } from 'react'
import { Badge, Tooltip, Button, Box } from '@mui/material'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import GroupAddIcon from '@mui/icons-material/GroupAdd'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import { fetchBoardDetailsAPI, getInvitationByInviteeIdAPI, getUserByIdAPI, pushBoardAPI, updateInvitationAPI } from '~/apis'
import axios from 'axios'
import { getUserIdByTokenAPI } from '../../../apis'

function Notification({ updateBoardUpdated }) {
  const [invitations, setInvitations] = useState([])
  const [boardIds, setBoardIds] = useState({})
  const [inviters, setInviters] = useState({})
  const [boards, setBoards] = useState({})
  const [hideButtons, setHideButtons] = useState({})
  const [userId, setUserId] = useState(null)
  const [showNotification, setShowNotification] = useState(false)
  const [boardUpdated, setBoardUpdated] = React.useState(false)
  const menuRef = useRef(null) // Tham chiếu cho menu

  const fetchUserId = async () => {
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1]
      const response = await getUserIdByTokenAPI({
        headers: {
          Authorization: `Bearer ${token}` // Gửi token trong header
        }
      })
      return response.userId // Lấy userId từ phản hồi
    } catch (error) {
      console.log('Error fetching userId')
    }
  }

  // Hàm để lấy danh sách lời mời từ API
  const fetchInvitations = async (userId) => {
    try {
      const response = await getInvitationByInviteeIdAPI(userId)
      setInvitations(response) // Cập nhật danh sách lời mời
    } catch (err) {
      return
    }
  }

  // Hàm để lấy tên của người mời từ API
  const fetchInviterName = async (inviterId) => {
    try {
      const response = await getUserByIdAPI(inviterId)
      return response.username
    } catch (error) {
      console.error('Error fetching inviter name:', error)
    }
  }

  const fetchBoardName = async (boardId) => {
    try {
      const response = await fetchBoardDetailsAPI(boardId)
      return response.title
    } catch (error) {
      console.error('Error fetching inviter name:', error)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const userId = await fetchUserId() // Gọi fetchUserId để lấy userId
      if (userId) {
        await fetchInvitations(userId)
        setUserId(userId) // Nếu userId tồn tại, gọi fetchInvitations
      }
    }
    fetchData() // Gọi fetchData khi component được render
  }, [userId]) // Chỉ gọi lại useEffect khi userId thay đổi

  // Hàm xử lý khi người dùng chấp nhận lời mời
  const handleAcceptInvite = async (invitationId) => {
    try {
      // Thực hiện các hành động cần thiết khi chấp nhận lời mời
      await pushBoardAPI(userId, boardIds[invitationId])

      const updateData = {
        boardInvitation: {
          boardId: boardIds[invitationId], // Lấy boardId từ boardIds dựa vào invitationId
          status: 'accepted' // Cập nhật trạng thái thành 'accepted'
        }
      }

      await updateInvitationAPI(invitationId, updateData)
      // Sau đó, ẩn nút `Accept` cho lời mời tương ứng
      setHideButtons(prevState => ({
        ...prevState,
        [invitationId]: true
      }))
      setBoardUpdated(true)
      updateBoardUpdated()
    } catch (error) {
      console.error('Error accepting invitation:', error)
    }
  }

  const handleRejectInvite = async (invitationId) => {
    try {
      // Thực hiện các hành động cần thiết khi từ chối lời mời
      const updateData = {
        boardInvitation: {
          boardId: boardIds[invitationId], // Lấy boardId từ boardIds dựa vào invitationId
          status: 'rejected' // Cập nhật trạng thái thành 'accepted'
        }
      }

      await updateInvitationAPI(invitationId, updateData)
      // Sau đó, ẩn cả hai nút cho lời mời tương ứng
      setHideButtons(prevState => ({
        ...prevState,
        [invitationId]: true
      }))
    } catch (error) {
      console.error('Error rejecting invitation:', error)
    }
  }

  useEffect(() => {
    // Lặp qua mỗi lời mời và lấy tên của người mời
    invitations.forEach(async (invitation) => {
      const inviterName = await fetchInviterName(invitation.inviterId)
      const boardName = await fetchBoardName(invitation.boardInvitation.boardId)

      setInviters(prevState => ({
        ...prevState,
        [invitation._id]: inviterName // Lưu tên người mời vào state
      }))
      setBoards(prevState => ({
        ...prevState,
        [invitation._id]: boardName // Lưu tên người mời vào state
      }))
      setBoardIds(prevState => ({
        ...prevState,
        [invitation._id]: invitation.boardInvitation.boardId // Lưu tên người mời vào state
      }))
    })
  }, [invitations]) // Chạy lại useEffect khi danh sách lời mời thay đổi

  const handleNotificationClick = () => {
    setShowNotification(!showNotification) // Đảo ngược trạng thái hiển thị của box thông báo
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Kiểm tra xem click có bên ngoài vùng chứa hay không
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowNotification(false)
      }
    }

    // Thêm trình nghe sự kiện để phát hiện click bên ngoài
    document.addEventListener('click', handleClickOutside)

    // Xóa trình nghe sự kiện khi component bị hủy
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  return (
    <Box>
      <div ref={menuRef} style={{ position: 'relative' }}>
        <Tooltip title="Notifications">
          <Badge color="warning" variant="dot" sx={{ cursor: 'pointer' }} onClick={handleNotificationClick}>
            <NotificationsNoneIcon sx={{ color: 'white' }} />
          </Badge>
        </Tooltip>
        {showNotification && (
          <div style={{ position: 'absolute', top: '40px', right: '0', zIndex: '1000', width: '400px', maxHeight: '400px', overflowY: 'auto', border: '1px solid #ccc', borderRadius: '5px', boxShadow: '0px 0px 5px 0px rgba(0,0,0,0.5)', backgroundColor: 'white' }}>
            {invitations.map((invitation) => (
              <div key={invitation._id} style={{ marginBottom: '10px', marginLeft: '5px', marginRight: '5px', backgroundColor: 'white', padding: '10px', borderRadius: '5px', color: 'black' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <GroupAddIcon sx={{ marginRight: '5px' }} />
                  <span style={{ marginLeft: '5px' }}><strong>{inviters[invitation._id] || ''}</strong> has invited you to join the board <strong>{boards[invitation._id] || ''}</strong></span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '5px' }}>
                  {!hideButtons[invitation._id] && invitation.boardInvitation.status === 'pending' && (
                    <>
                      <Button variant="contained" color="primary" style={{ marginRight: '5px' }} onClick={() => handleAcceptInvite(invitation._id)}>Accept</Button>
                      <Button variant="contained" color="secondary" onClick={() => handleRejectInvite(invitation._id)}>Reject</Button>
                    </>
                  )}
                  {invitation.boardInvitation.status === 'accepted' && (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <CheckCircleIcon sx={{ color: 'green', marginRight: '5px' }} />
                      <span>Accepted</span>
                    </div>
                  )}
                  {invitation.boardInvitation.status === 'rejected' && (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <CancelIcon sx={{ color: 'red', marginRight: '5px' }} />
                      <span>Rejected</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Box>
  )
}

export default Notification
