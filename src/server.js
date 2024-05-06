/* eslint-disable no-console */
import express from 'express'
import cors from 'cors'
import { corsOptions } from './config/cors'
import exitHook from 'async-exit-hook'
import { CONNECT_DB, GET_DB, CLOSE_DB } from '~/config/mongodb'
import { env } from '~/config/environment'
import { APIs_V1 } from '~/routes/v1'
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware'

const START_SERVER = () => {
  const app = express()
  // Xử lý CORS
  app.use(cors(corsOptions))
  // Enable req.body json data
  app.use(express.json())
  // Use APIs_V1
  app.use('/v1', APIs_V1)
  // Middleware xử lý lỗi tập trung
  app.use(errorHandlingMiddleware)

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
