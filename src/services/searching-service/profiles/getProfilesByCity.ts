import db from '../../../database'
import IProfile from '../../../interfaces/IProfile'

const { Profile } = db

export default async (chat_id: number, city: string) => {
  let cityProfiles: Promise<IProfile[]> = await Profile.find({
    city,
    chat_id: { $ne: chat_id },
    is_active: true,
  })

  return cityProfiles
}
