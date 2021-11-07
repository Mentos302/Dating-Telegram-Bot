import { TelegrafContext } from 'telegraf/typings/context'
import RelationService from '../services/relations-service'
import ProfileService from '../services/profile-service'
import UserService from '../services/user-service'
import IProfile from '../interfaces/IProfile'
import IUser from '../interfaces/IUser'
import DisplayController from '../controllers/display-controller'

export default async (ctx: TelegrafContext) => {
  const user: IUser = await UserService.getUser(ctx.from!.id)

  if (user) {
    if (user.daily_likes) {
      if (user.last_activity - Math.floor(Date.now() / 1000) > 86400) {
        user.daily_likes = 0

        UserService.updateDailyLikes(ctx.from!.id, 0)
        UserService.activityUpdate(ctx.from!.id)
      }
    }

    const profile: IProfile = await ProfileService.getProfile(ctx.from!.id)

    if (profile) {
      ctx.session = {
        profile,
        city: profile.city,
        citiesCache: [],
        relations: (await RelationService.getUserRelations(ctx.from!.id)) || [],
        daily_likes: 15,
      }

      DisplayController.getCandidates(ctx.session)

      const likes = await RelationService.checkNewLikes(ctx.from!.id)

      likes && likes.length
        ? ctx.scene.enter('likely', { is_first: true, likes })
        : ctx.scene.enter('profile_menu')
    } else {
      ctx.scene.enter('reg1')
    }
  } else {
    const rFriend = ctx.message!.text.split(' ')[1]

    if (rFriend) {
      UserService.updateUserRefBonus(rFriend)
    }

    await UserService.createUser(ctx.from!.id)

    ctx.scene.enter('reg1')
  }
}
