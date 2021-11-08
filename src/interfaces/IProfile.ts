import IAvatar from './IAvatar'

interface IProfile {
  chat_id: number
  age: number
  gender: number
  interest: number
  city: string
  name: string
  avatar: IAvatar
  descript: string
  attraction: number
  strikes: number
}

export default IProfile
