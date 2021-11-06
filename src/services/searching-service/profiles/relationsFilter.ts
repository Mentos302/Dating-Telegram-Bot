import IProfile from '../../../interfaces/IProfile'

export default (profiles: IProfile[], relations: number[]): IProfile[] => {
  const filteredProfiles = profiles
    .filter((e) => !relations.some((el) => e.chat_id === el))
    .sort((a, b) => {
      return b.attraction - a.attraction
    })

  return filteredProfiles
}
