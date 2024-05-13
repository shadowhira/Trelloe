import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Admin from '~/pages/Admin/admin'
import Login from '~/pages/Auth/Login/Login'
import SignUp from '~/pages/Auth/SignUp/SignUp'
import Board from '~/pages/Boards/_id'
import BoardList from '~/pages/Boards/index'
import UserDetails from '~/pages/Users/UserDetails'
import Test from './test'

function App() {
  return (
    <>
      {/* React Router Dom /boards / boards/{board_id} */}
      {/* Board Details */}
      {/* <Board /> */}
      <Router>
        <Routes>

          {/* Trang đăng nhập */}
          <Route path="/login" element={<Login />} />

          {/* Trang đăng ký */}
          <Route path='/signup' element={<SignUp/>} />

          {/* Trang chi tiết bảng với ID */}
          <Route path="/board" element={<Board />} />
          <Route path="/boards/:boardId" element={<Board />} />
          <Route path="/boards" element={<BoardList />} />
          <Route path="/" element={<BoardList />} />
          <Route path="/user" element={<UserDetails />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/test" element={<Test />} />

        </Routes>
      </Router>
    </>
  )
}

export default App
