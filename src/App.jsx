import Board from '~/pages/Boards/_id'
import Login from '~/pages/Auth/Login/Login'
import SignUp from '~/pages/Auth/SignUp/SignUp'
import CategoryBar from './components/CategoryBar/CategoryBar'
import BoardList from '~/pages/Boards/index'
import UserDetails from '~/pages/Users/UserDetails'
import Account from '~/pages/Users/Account'
import Security from '~/pages/Users/Security'
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom'

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
          <Route path="/security" element={<Security />} />
          <Route path="/account" element={<Account />} />
          <Route path="/user" element={<UserDetails />} />

        </Routes>
      </Router>
    </>
  )
}

export default App
