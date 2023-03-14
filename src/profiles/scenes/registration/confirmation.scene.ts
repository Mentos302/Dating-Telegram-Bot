import { Scene, SceneEnter, Action, On } from 'nestjs-telegraf';
import { Context } from 'src/interfaces/context.interface';
import { ProfilesService } from 'src/profiles/profiles.service';
import { Profile } from 'src/profiles/schemas/profiles.schema';
import { Markup } from 'telegraf';

@Scene('reg_confirmation')
export class RegistrationConfirmationScene {
  constructor(private readonly profilesService: ProfilesService) {}

  @SceneEnter()
  async onSceneEnter(ctx: Context) {
    const { name, age, city, description, avatar } = ctx.scene.state as Profile;

    const caption = `<b>${name}, ${age}</b>. ${city} \n\n${description}`;

    if (avatar.is_video) {
      await ctx.replyWithVideo(avatar.file_id, {
        caption,
        parse_mode: 'HTML',
      });
    } else {
      await ctx.replyWithPhoto(avatar.file_id, {
        caption,
        parse_mode: 'HTML',
      });
    }

    ctx.replyWithHTML(
      `Все правильно?`,
      Markup.inlineKeyboard([
        { text: 'Так 👍', callback_data: 'well' },
        { text: 'Редагувати анкету 📝', callback_data: 'edit' },
      ]),
    );
  }

  @Action('well')
  async onWellAction(ctx: Context) {
    await this.profilesService.create({
      ...ctx.scene.state,
      chat_id: ctx.from.id,
    });

    ctx.scene.enter('swiper_main');
  }

  @Action('edit')
  async onEditAction(ctx: Context) {
    await this.profilesService.create({
      ...ctx.scene.state,
      chat_id: ctx.from.id,
    });

    ctx.scene.enter('profile_menu');
  }

  @On('message')
  async onMessage(ctx: Context) {
    ctx.scene.reenter();
  }
}
