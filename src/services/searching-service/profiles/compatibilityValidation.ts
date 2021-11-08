import IProfile from '../../../interfaces/IProfile'

export default (liker: IProfile, liked: IProfile): any => {
  if (interestValidation(liker, liked) && ageValidation(liker, liked)) {
    return liked
  } else {
    return false
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

  liker.age < 18 ? (limit = 5) : (limit = 3)

  if (liked.age < liker.candidateAge || liked.age - liker.candidateAge > limit)
    return false

  return true
}
