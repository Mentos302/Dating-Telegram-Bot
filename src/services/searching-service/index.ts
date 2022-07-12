import IProfile from '../../interfaces/IProfile'
import ISession from '../../interfaces/ISession'

import getCandidates from './profiles'

const searchCandidates = async ({
  profile,
  relations,
}: ISession): Promise<IProfile[] | undefined> => {
  try {
    const candidates = await getCandidates(profile, relations)

    if (candidates.length) return candidates
  } catch (e) {
    throw e
  }
}

export default searchCandidates
