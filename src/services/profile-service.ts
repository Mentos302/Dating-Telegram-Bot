import db from '../database'
import IAvatar from '../interfaces/IAvatar'
import IProfile from '../interfaces/IProfile'

const { Profile, City } = db

class ProfileService {
  async getProfile(chat_id: number) {
    try {
      const profile = Profile.findOne({ chat_id })

      return profile
    } catch (e) {
      console.log(e)

      throw new Error(`Unexpected error with profile getting`)
    }
  }

  async createProfile(data: IProfile) {
    try {
      const {
        chat_id,
        age,
        gender,
        interest,
        city,
        name,
        avatar,
        descript,
        candidateAge,
      } = data

      await Profile.create({
        name,
        chat_id,
        gender,
        interest,
        city,
        age,
        descript,
        avatar,
        candidateAge,
      })

      await City.updateOne({ city_name: city }, { $inc: { profiles: 1 } })
    } catch (e) {
      console.log(e)

      throw new Error(`Profile creating error`)
    }
  }

  async deleteProfile(chat_id: number) {
    try {
      await Profile.deleteOne({ chat_id })
    } catch (e) {
      console.log(e)

      throw new Error(`Unexpected error with profile deleting`)
    }
  }

  async changeAvatar(chat_id: number, avatar: IAvatar) {
    try {
      await Profile.updateOne({ chat_id }, { avatar })
    } catch (e) {
      console.log(e)

      throw new Error(`Unexprected error with avatar changing`)
    }
  }

  async changeDesc(chat_id: number, decsript: string) {
    try {
      await Profile.updateOne({ chat_id }, { decsript })
    } catch (e) {
      console.log(e)

      throw new Error(`Unexprected error with desc changing`)
    }
  }

  async updateUserLikes(chat_id: number): Promise<number | undefined> {
    try {
      const { likes } = await Profile.findOneAndUpdate(
        { chat_id },
        { $inc: { likes: 1 } },
        { new: true, useFindAndModify: false }
      )
      await Profile.updateOne({ chat_id }, { $inc: { attraction: 1 } })

      return likes
    } catch (e) {
      console.log(e)

      throw new Error(`Unexprected error with user likes updating`)
    }
  }

  async reportProfile(chat_id: number, strikes: number) {
    try {
      if (strikes > 2) {
        await Profile.updateOne({ chat_id }, { is_active: false })
      } else {
        strikes++
        await Profile.updateOne({ chat_id }, { strikes })
      }
    } catch (e) {
      console.log(e)

      throw new Error(`Unexpected error with profile reporting`)
    }
  }
}

export default new ProfileService()
