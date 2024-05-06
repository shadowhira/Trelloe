import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { corsOptions } from './config/cors';
import exitHook from 'async-exit-hook';
import { CONNECT_DB, GET_DB, CLOSE_DB } from '~/config/mongodb';
import { env } from '~/config/environment';
import { APIs_V1 } from '~/routes/v1';
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware';

// Load environment variables
dotenv.config();

// Middleware để xác thực người dùng bằng JWT token từ cookie
const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json({ error: 'Bạn chưa xác thực' });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.json({ error: 'Token không hợp lệ' });
    }
    req.name = decoded.name;
    next();
  });
};

// Điểm cuối đăng ký
const registerEndpoint = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.json({ error: 'Thiếu tên, email, hoặc mật khẩu' });
  }

  try {
    const existingUser = await GET_DB().collection('users').findOne({ email });
    if (existingUser) {
      return res.json({ error: 'Email đã được sử dụng' });
    }

    const hashedPassword = await bcrypt.hash(password.toString(), 10); // Mã hóa mật khẩu
    const newUser = { name, email, password: hashedPassword };

    await GET_DB().collection('users').insertOne(newUser);
    return res.json({ Status: 'Success' });
  } catch (error) {
    console.error('Lỗi trong quá trình đăng ký:', error);
    return res.json({ error: 'Lỗi khi đăng ký' });
  }
};

// Điểm cuối đăng nhập
const loginEndpoint = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({ error: 'Thiếu email hoặc mật khẩu' });
  }

  try {
    const user = await GET_DB().collection('users').findOne({ email });

    if (!user) {
      return res.json({ error: 'Email không tìm thấy' });
    }

    const isMatch = await bcrypt.compare(password.toString(), user.password);

    if (!isMatch) {
      return res.json({ error: 'Mật khẩu không đúng' });
    }

    const token = jwt.sign({ name: user.name }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'strict',
    });

    return res.json({ Status: 'Success' });
  } catch (error) {
    console.error('Lỗi khi đăng nhập:', error);
    return res.json({ error: 'Lỗi khi đăng nhập' });
  }
};

// Điểm cuối đăng xuất
const logoutEndpoint = (req, res) => {
  res.clearCookie('token', { httpOnly: true, sameSite: 'strict' }); // Xóa cookie xác thực
  return res.json({ Status: 'Thành công', message: 'Đăng xuất thành công' });
};
const START_SERVER = () => {
  const app = express();

  // Xử lý CORS
  app.use(cors(corsOptions));

  // Enable req.body json data
  app.use(express.json());

  // Sử dụng cookieParser để xử lý cookie
  app.use(cookieParser());

  // Use APIs_V1
  app.use('/v1', APIs_V1);

  // Thêm các endpoint mới
  app.post('/register', registerEndpoint);
  app.post('/login', loginEndpoint);
  app.post('/logout', logoutEndpoint);
  app.get('/check-auth', verifyUser, (req, res) => {
    return res.json({ Status: 'Thành công', name: req.name });
  });

  // Middleware xử lý lỗi tập trung
  app.use(errorHandlingMiddleware);

  if (env.BUILD_MODE === 'production') {
    app.listen(process.env.PORT, () => {
      console.log(
        `3. Production: \nHellop ${env.AUTHOR}, 
        Backend is running at Port: ${process.env.PORT}`
      );
    });
  } else {
    app.listen(env.LOCAL_DEV_APP_PORT, env.LOCAL_DEV_APP_HOST, () => {
      console.log(
        `3. Local Development:\nHellop ${env.AUTHOR}, 
        Backend is running at:
        \nHost: ${env.LOCAL_DEV_APP_HOST} \nPort: ${env.LOCAL_DEV_APP_PORT}`
      );
    });
  }

  // Thực hiện cleanup trước khi dừng server
  exitHook(() => {
    console.log('4. Server is shutting down...');
    CLOSE_DB();
  });
};

// Khởi động server sau khi kết nối DB thành công
(async () => {
  try {
    console.log('1. Connecting to MongoDB Cloud Atlas...');
    await CONNECT_DB();
    console.log('2. Connected to MongoDB Cloud Atlas!');

    START_SERVER();
  } catch (error) {
    console.error(error);
    process.exit(0);
  }
})();