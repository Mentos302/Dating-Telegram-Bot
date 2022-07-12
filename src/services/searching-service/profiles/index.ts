import IProfile from '../../../interfaces/IProfile'
import getProfiles from './getProfilesByCity'
import relationsFilter from './relationsFilter'
import compatibilityValidation from './compatibilityValidation'

export default async (
  liker: IProfile,
  relations?: number[]
): Promise<IProfile[]> => {
  try {
    let profiles = await getProfiles(liker.chat_id, liker.candidateAge)

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
