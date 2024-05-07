import Board from '~/pages/Boards/_id'
import Login from '~/pages/Auth/Login/Login'
import SignUp from '~/pages/Auth/SignUp/SignUp'
import CategoryBar from './components/CategoryBar/CategoryBar'
import BoardList from '~/pages/Boards/index'
import UserBar from '~/pages/Users/UserBar'
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
          <Route path="/boards" element={<BoardList />} />
          <Route path="/" element={<UserBar />} />

        </Routes>
      </Router>
    </>
  )
}

export default App
