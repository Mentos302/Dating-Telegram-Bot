import IProfile from '../../interfaces/IProfile'
import ISession from '../../interfaces/ISession'

import getCities from './cities'
import getCandidates from './profiles'

type response = {
  candidates: IProfile[]
  citiesCache: string[]
}

const searchCandidates = async ({
  profile,
  citiesCache,
  relations,
  city,
}: ISession): Promise<response | undefined> => {
  try {
    if (city) {
      const candidates = await getCandidates(profile, city, relations)

      if (candidates.length) {
        if (citiesCache) citiesCache.shift()

        return { candidates, citiesCache }
      }

      if (citiesCache.length > 1) {
        citiesCache.shift()

        const result = await searchCandidates({
          profile,
          citiesCache,
          relations,
          city: citiesCache[0],
        })

        return result
      } else if (citiesCache.length === 1) {
        citiesCache.shift()

        return undefined
      } else {
        const result = await searchCandidates({
          profile,
          citiesCache,
          relations,
        })

        return result
      }
    } else {
      citiesCache = (await getCities(profile.city)) || []

      const result = await searchCandidates({
        profile,
        citiesCache,
        relations,
        city: citiesCache[0],
      })

      return result
    }
  } catch (e) {
    throw e
  }
}

export default searchCandidates
