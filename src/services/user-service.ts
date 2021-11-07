import moment from 'moment'
import db from '../database'

const { User } = db

import RelationService from './relations-service'
import ProfileService from './profile-service'

class Service {
  async getUser(chat_id: number) {
    try {
      const user = await User.findOne({ chat_id })

      return user
    } catch (e) {
      console.log(e)

      throw new Error(`Unexprected error with getting user`)
    }
  }

  async createUser(chat_id: number) {
    try {
      await User.create({
        chat_id,
        last_activity: moment().format('DD.MM.YYYY'),
      })
    } catch (e) {
      console.log(e)

      throw new Error(`Unexprected error with user creating`)
    }
  }

  async activityUpdate(chat_id: number) {
    try {
      await User.updateOne(
        { chat_id },
        { last_activity: Math.floor(Date.now() / 1000) }
      )
    } catch (e) {
      console.log(e)

      throw new Error(`Unexprected error with activity update`)
    }
  }

  async deleteUser(chat_id: number) {
    try {
      await User.deleteOne({ chat_id })

      RelationService.deleteAllActivities(chat_id)
      ProfileService.deleteProfile(chat_id)
    } catch (e) {
      console.log(e)

      throw new Error(`Unexprected error with user removing`)
    }
  }

  async updateDailyLikes(chat_id: number, daily_likes: number) {
    try {
      await User.updateOne({ chat_id }, { daily_likes })
    } catch (e) {
      console.log(e)

      throw new Error(`Unexprected error with likes updating`)
    }
  }

  async getUserRefBonus(chat_id: number) {
    try {
      const refBonus = await User.findOne({ chat_id }, { refbonus: 1, _id: 0 })

      return refBonus.refbonus
    } catch (e) {
      console.log(e)

      throw new Error(`Unexprected error with ref bonus getting`)
    }
  }

  async updateUserRefBonus(chat_id: string) {
    try {
      await User.updateOne({ chat_id }, { $inc: { refbonus: 1 } })
    } catch (e) {
      console.log(e)

      throw new Error(`Unexprected error with ref bonus increasing`)
    }
  }
}

export default new Service()
