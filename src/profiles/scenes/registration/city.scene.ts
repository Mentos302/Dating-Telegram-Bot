import { Scene, SceneEnter, On, Ctx, Message } from 'nestjs-telegraf';
import { Context } from 'src/interfaces/context.interface';
import { ProfilesService } from 'src/profiles/profiles.service';

@Scene('reg_city')
export class RegistrationCityScene {
  constructor(private readonly profilesService: ProfilesService) {}

  @SceneEnter()
  onSceneEnter(ctx: Context) {
    ctx.replyWithHTML(`📍 <b>${ctx.from.first_name}</b>, з якого ти міста?`);
  }

  @On('text')
  async onText(@Ctx() ctx: Context, @Message('text') city: string) {
    const location = await this.profilesService.findProfileLocation(city);

    if (!location) return '🧳 Не змогли знайти таке місто, спробуйте ще раз!';

    ctx.scene.enter('reg_name', {
      ...ctx.scene.state,
      city,
      location,
    });
  }

  @On('message')
  async onMessage(ctx: Context): Promise<void> {
    ctx.scene.reenter();
  }
}
