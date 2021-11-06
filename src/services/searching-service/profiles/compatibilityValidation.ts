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
  if (liker.gender == 1) {
    if (liker.age < 16 && liked.age > 16) {
      return false
    } else if (liker.age >= 16 && liker.age < 19) {
      if (liked.age < 16 || liked.age > 19) {
        return false
      }
    } else if (liker.age >= 19 && liker.age <= 20) {
      if (liked.age <= 16 || liked.age > 20) {
        return false
      }
    } else if (liker.age > 20 && liker.age <= 25) {
      if (liked.age < 18 || liked.age > 24) {
        return false
      }
    } else if (liker.age > 25) {
      if (liked.age < 24) {
        return false
      }
    }
  } else {
    if (liker.age < 16 && liked.age > 18) {
      return false
    } else if (liker.age >= 16 && liker.age < 19) {
      if (liked.age < 18 || liked.age > 20) {
        return false
      }
    } else if (liker.age >= 19 && liker.age <= 20) {
      if (liked.age < 20 || liked.age > 23) {
        return false
      }
    } else if (liker.age > 20 && liker.age <= 25) {
      if (liked.age < 23 || liked.age > 30) {
        return false
      }
    } else if (liker.age > 25) {
      if (liked.age < 30) {
        return false
      }
    }
  }

  return true
}
