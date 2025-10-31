import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Admin from '~/pages/Admin/Admin'
import Board from '~/pages/Boards/_id'
import BoardList from '~/pages/Boards/index'
import UserDetails from '~/pages/Users/UserDetails'
import SignInSide from './pages/Auth/Login/SignInSide'
import SignUpSide from './pages/Auth/SignUp/SignUpSide'

function App() {
  return (
    <>
      {/* React Router Dom /boards / boards/{board_id} */}
      {/* Board Details */}
      {/* <Board /> */}
      <Router>
        <Routes>

          {/* Trang đăng nhập */}
          <Route path="/login" element={<SignInSide />} />
          <Route path="/" element={<SignInSide />} />

          {/* Trang đăng ký */}
          <Route path='/signup' element={<SignUpSide/>} />

          {/* Trang chi tiết bảng với ID */}
          {/* <Route path="/board" element={<Board />} /> */}
          <Route path="/boards/:boardId" element={<Board />} />
          <Route path="/boards" element={<BoardList />} />

          {/* Trang Users */}
          <Route path="/user" element={<UserDetails />} />
          <Route path="/admin" element={<Admin />} />
          {/* <Route path="/side" element={<SignInSide />} />
          <Route path="/sideup" element={<SignUpSide />} /> */}

        </Routes>
      </Router>
    </>
  )
}

export default App
