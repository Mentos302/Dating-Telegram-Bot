import db from '../../../database'
import IProfile from '../../../interfaces/IProfile'
import BotError from '../../../exceptions/botError'

const { Profile } = db

export default async (chat_id: number, city: string) => {
  try {
    let cityProfiles: Promise<IProfile[]> = await Profile.find({
      city,
      chat_id: { $ne: chat_id },
      is_active: true,
    })

    return cityProfiles
  } catch (e: any) {
    throw new BotError(`Unexpected error with profiles getting by city`, e)
  }
}
