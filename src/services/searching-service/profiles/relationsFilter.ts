import BotError from '../../../exceptions/error-notification'
import IProfile from '../../../interfaces/IProfile'

export default (profiles: IProfile[], relations: number[]): IProfile[] => {
  try {
    const filteredProfiles = profiles
      .filter((e) => !relations.some((el) => e.chat_id === el))
      .sort((a, b) => {
        return b.attraction - a.attraction
      })

    return filteredProfiles
  } catch (e: any) {
    throw new BotError(`Unexpected error with relations filter`, e)
  }
}
