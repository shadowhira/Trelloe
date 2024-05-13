/* eslint-disable no-console */
import exitHook from 'async-exit-hook'
import { v2 as cloudinary } from 'cloudinary'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import multer from 'multer'
import { env } from '~/config/environment'
import { CLOSE_DB, CONNECT_DB } from '~/config/mongodb'
import { APIs_V1 } from '~/routes/v1'
import { corsOptions } from './config/cors'
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware'
const bodyParser = require('body-parser')

const START_SERVER = () => {
  const app = express()
  app.use(bodyParser.json({ limit: '10mb' }))
  app.use(cookieParser())
  // Xử lý CORS
  app.use(cors(corsOptions))
  // Enable req.body json data
  app.use(express.json())
  app.use(express.static('public'))
  // Use APIs_V1
  app.use('/v1', APIs_V1)
  // Middleware xử lý lỗi tập trung
  app.use(errorHandlingMiddleware)
  cloudinary.config({
    cloud_name: 'drikbhvny',
    api_key: '291774781534755',
    api_secret: 'cI1935A8txgDKALNI4RoP0itZ3Q'
  })

  const upload = multer({ dest: 'uploads/' })

  app.post('/upload', upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).send('No file uploaded.')
      }
      const result = await cloudinary.uploader.upload(req.file.path)
      res.json(result.secure_url)
    } catch (error) {
      console.error('Error uploading file:', error)
      res.status(500).send('Error uploading file.')
    }
  })

  if (env.BUILD_MODE == 'production') {
    // Môi trường production (support cho render.com)
    app.listen(process.env.PORT, () => {
      console.log(
        `3. Production: \nHellop ${env.AUTHOR}, 
        Backend is running at Port: ${process.env.PORT}`
      )
    })
  } else {
    // Môi trường dev
    app.listen(env.LOCAL_DEV_APP_PORT, env.LOCAL_DEV_APP_HOST, () => {
      console.log(
        `3. Local Development:\nHellop ${env.AUTHOR}, 
        Backend is running at:
        \nHost: ${env.LOCAL_DEV_APP_HOST} \nPort: ${env.LOCAL_DEV_APP_PORT}`
      )
    })
  }

  // Thực hiện csc tác vụ cleanup trước khi dừng server
  // Đọc thêm ở https://stackoverflow.com/q/14031763/8324172
  exitHook(() => {
    console.log('4. Server is shutting down...')
    CLOSE_DB()
  })
}


// Chỉ khi Kết nối tới Database thành công thì mới Start Server Back-end Lên.
// Immediately-invoked / Anonymous Async Functions (IIFE)
(async () => {
  try {
    console. log('1. Connecting to MongoDB Cloud Atlas ... ')
    await CONNECT_DB()
    console. log('2. Connected to MongoDB Cloud Atlas!')
    // Khởi động Server Back-end sau khi Connect Database thành công
    START_SERVER()
  } catch (error) {
    console.error(error)
    process.exit(0)
  }
})()

// Chỉ khi kết nối tới DB thành công thì mới Start Server Backend lên
// CONNECT_DB()
//   .then(() => console.log('Connected to MongoDB Cloud (Atlas)'))
//   .then(() => START_SERVER())
//   .catch(error => {
//     console.log(error)
//     process.exit(0)
//   })
