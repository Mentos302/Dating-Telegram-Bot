import IProfile from './IProfile'

interface ISession {
  profile: IProfile
  city?: string
  citiesCache: string[]
  relations: number[]
  candidates?: IProfile[]
}

export default ISession
