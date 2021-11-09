import IProfile from './IProfile'

interface ISession {
  profile: IProfile
  city?: string
  citiesCache: string[]
  relations: number[]
  candidates?: IProfile[]
  likely_candidates?: IProfile[]
  daily_likes?: number
  searchingNow?: boolean
}

export default ISession
