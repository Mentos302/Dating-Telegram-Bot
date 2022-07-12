import db from '../database'

const { User } = db

class AdminService {
  async getUsers() {
    try {
      const users: { chat_id: number }[] = await User.find()

      return users
    } catch (e) {
      console.log(e)
    }
  }

  async removeUser(chat_id: number) {
    try {
      await User.deleteOne({ chat_id })
    } catch (e) {
      console.log(e)
    }
  }
}

export default new AdminService()
