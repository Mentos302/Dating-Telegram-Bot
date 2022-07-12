import db from '../../../database'
import IProfile from '../../../interfaces/IProfile'
import BotError from '../../../exceptions/botError'

const { Profile } = db

export default async (chat_id: number, candidateAge: number) => {
  try {
    let profiles: Promise<IProfile[]> = await Profile.find({
      candidateAge: { $gt: candidateAge - 1 },
      chat_id: { $ne: chat_id },
      is_active: true,
    })

    return profiles
  } catch (e: any) {
    throw new BotError(`Unexpected error with profiles getting by city`, e)
  }
}
