import db from '../database'
import BotError from '../exceptions/botError'
import newProfileNotification from '../exceptions/newProfile-notification'
import reportNotification from '../exceptions/report-notification'

import IAvatar from '../interfaces/IAvatar'
import IProfile from '../interfaces/IProfile'

const { Profile, City } = db

class ProfileService {
  async getProfile(chat_id: number) {
    try {
      const profile = await Profile.findOne({ chat_id })

      return profile
    } catch (e: any) {
      throw new BotError(`Unexpected error with profile getting`, e)
    }
  }

  async createProfile(data: IProfile) {
    try {
      await Profile.create(data)

      await City.updateOne({ city_name: data.city }, { $inc: { profiles: 1 } })

      await newProfileNotification(data)
    } catch (e: any) {
      throw new BotError(`Profile creating error`, e)
    }
  }

  async deleteProfile(chat_id: number) {
    try {
      await Profile.deleteOne({ chat_id })
    } catch (e: any) {
      throw new BotError(`Unexpected error with profile deleting`, e)
    }
  }

  async changeAvatar(chat_id: number, avatar: IAvatar) {
    try {
      await Profile.updateOne({ chat_id }, { avatar })
    } catch (e: any) {
      throw new BotError(`Unexprected error with avatar changing`, e)
    }
  }

  async changeDesc(chat_id: number, decsript: string) {
    try {
      await Profile.updateOne({ chat_id }, { decsript })
    } catch (e: any) {
      throw new BotError(`Unexprected error with desc changing`, e)
    }
  }

  async updateProfileLikes(chat_id: number): Promise<number | undefined> {
    try {
      const profile = await Profile.findOneAndUpdate(
        { chat_id },
        { $inc: { likes: 1 } },
        { new: true, useFindAndModify: false }
      )
      await Profile.updateOne({ chat_id }, { $inc: { attraction: 1 } })

      return profile.likes
    } catch (e: any) {
      throw new BotError(`Unexprected error with user likes updating`, e)
    }
  }

  async reportProfile(profile: IProfile) {
    let { chat_id, strikes } = profile

    try {
      if (strikes > 2) {
        await Profile.updateOne({ chat_id }, { is_active: false })

        reportNotification(profile)
      } else {
        strikes++
        await Profile.updateOne({ chat_id }, { strikes })
      }
    } catch (e: any) {
      throw new BotError(`Unexpected error with profile reporting`, e)
    }
  }
}

export default new ProfileService()
