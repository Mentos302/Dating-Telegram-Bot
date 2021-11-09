import IProfile from '../../../interfaces/IProfile'
import getProfilesByCity from './getProfilesByCity'
import relationsFilter from './relationsFilter'
import compatibilityValidation from './compatibilityValidation'

export default async (
  liker: IProfile,
  city: string,
  relations?: number[]
): Promise<IProfile[]> => {
  try {
    let profiles = await getProfilesByCity(liker.chat_id, city)

    if (relations?.length) {
      profiles = await relationsFilter(profiles, relations)
    }

    const candidates: any[] = profiles.filter((e) =>
      compatibilityValidation(liker, e)
    )

    return candidates
  } catch (e) {
    throw e
  }
}
