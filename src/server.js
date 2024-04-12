/* eslint-disable no-console */
import express from 'express'
import exitHook from 'async-exit-hook'
import { CONNECT_DB, GET_DB, CLOSE_DB } from '~/config/mongodb'
import { env } from '~/config/environment'
import { APIs_V1 } from '~/routes/v1'

const START_SERVER = () => {
  const app = express()

  app.use('/v1', APIs_V1)

  app.listen(env.APP_PORT, env.APP_HOST, () => {
    console.log(`3. Hellop ${env.AUTHOR}, Backend is running at http://${env.APP_HOST}:${env.APP_PORT}`)
  })

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