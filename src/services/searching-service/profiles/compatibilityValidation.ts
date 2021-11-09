import BotError from '../../../exceptions/error-notification'
import IProfile from '../../../interfaces/IProfile'

export default (liker: IProfile, liked: IProfile): any => {
  try {
    if (interestValidation(liker, liked) && ageValidation(liker, liked)) {
      return liked
    } else {
      return false
    }
  } catch (e: any) {
    throw new BotError(`Unexpected error with compatibility validation`, e)
  }
}

const interestValidation = (liker: IProfile, liked: IProfile): boolean => {
  if (liker.interest !== liked.gender && liker.interest !== 2) {
    return false
  }
  if (liker.gender !== liked.interest && liked.interest !== 2) {
    return false
  }

  return true
}

const ageValidation = (liker: IProfile, liked: IProfile): boolean => {
  let limit

  liker.age < 18 ? (limit = 3) : (limit = 5)

  if (liked.age < liker.candidateAge || liked.age - liker.candidateAge > limit)
    return false

  return true
}
