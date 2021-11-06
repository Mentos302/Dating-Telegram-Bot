import IProfile from '../../../interfaces/IProfile'
import getProfilesByCity from './getProfilesByCity'
import relationsFilter from './relationsFilter'
import compatibilityValidation from './compatibilityValidation'

export default async (
  liker: IProfile,
  city: string,
  relations?: number[]
): Promise<IProfile[]> => {
  const candidates: IProfile[] = []

  let profiles = await getProfilesByCity(liker.chat_id, city)

  if (relations?.length) {
    profiles = await relationsFilter(profiles, relations)
  }

  await Promise.all(
    profiles.map(async (e) => {
      const isValid = await compatibilityValidation(liker, e)

      return isValid
    })
  )

  return profiles
}
