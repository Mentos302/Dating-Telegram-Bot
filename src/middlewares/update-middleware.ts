import { TelegrafContext } from 'telegraf/typings/context'
import RelationService from '../services/relations-service'
import ProfileService from '../services/profile-service'
import UserService from '../services/user-service'
import IProfile from '../interfaces/IProfile'
import DisplayController from '../controllers/display-controller'

export default async (ctx: TelegrafContext) => {
  const user = await UserService.getUser(ctx.from!.id)

  if (user) {
    UserService.activityUpdate(ctx.from!.id).catch((e) => console.log(e))

    const profile: IProfile = await ProfileService.getProfile(ctx.from!.id)

    if (profile) {
      ctx.session = {
        profile,
        city: profile.city,
        citiesCache: [],
        relations: (await RelationService.getUserRelations(ctx.from!.id)) || [],
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
    await UserService.createUser(ctx.from!.id)

    ctx.scene.enter('reg1')
  }
}
