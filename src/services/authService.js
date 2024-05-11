import { userModel } from '~/models/userModel'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const login = async (email, password, res) => {
  // eslint-disable-next-line no-useless-catch
  try {
    // Find user by email
    const user = await userModel.findByEmail(email)
    // console.log('🐛: ➡️ login ➡️ user:', user)

    // Check if user exists
    if (!user) {
      throw new Error('User not exist!')
    }

    // Compare password
    // const isPasswordValid = await comparePassword(password, user.password)
    const isPasswordValid = await bcrypt.compare(password.toString(), user.password)
    if (!isPasswordValid) {
      throw new Error('Invalid email or password')
    }

    // Generate and return access token
    const accessToken = jwt.sign({ email: user.email, userId: user._id.toString() }, process.env.JWT_SECRET, {
      expiresIn: '1d' // Thời hạn token
    })

    res.cookie('token', accessToken, {
    })

    return accessToken
  } catch (error) {
    throw error
  }
}

export const authService = {
  login
}