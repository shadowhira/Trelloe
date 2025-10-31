/* eslint-disable no-useless-catch */
import bcrypt from 'bcrypt'

const SALT_ROUNDS = 10

// Hàm mã hóa mật khẩu
const hashPassword = async (password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)
    return hashedPassword
  } catch (error) {
    throw error
  }
}

// Hàm so sánh mật khẩu đã được mã hóa với mật khẩu gốc
const comparePassword = async (password, hashedPassword) => {
  try {
    const isMatch = await bcrypt.compare(password, hashedPassword)
    return isMatch
  } catch (error) {
    throw error
  }
}

export { hashPassword, comparePassword }
