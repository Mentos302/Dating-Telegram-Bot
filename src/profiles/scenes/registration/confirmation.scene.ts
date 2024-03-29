import { Markup } from 'telegraf';
import { UseFilters } from '@nestjs/common';
import { Scene, SceneEnter, Action, On } from 'nestjs-telegraf';
import { AdminService } from 'src/admin/admin.service';
import { TelegrafExceptionFilter } from 'src/common/filters/telegraf-exception.filter';
import { Context } from 'src/interfaces/context.interface';
import { ProfilesService } from 'src/profiles/profiles.service';
import { Profile } from 'src/profiles/schemas/profiles.schema';
import { SCENE_SETTINGS } from 'src/common/config/scene';

@Scene('reg_confirmation', SCENE_SETTINGS)
@UseFilters(TelegrafExceptionFilter)
export class RegistrationConfirmationScene {
  constructor(
    private readonly profilesService: ProfilesService,
    private readonly adminService: AdminService,
  ) {}

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

    await this.adminService.newUserNotification(ctx.scene.state as Profile);

    ctx.session['profile'] = ctx.scene.state;

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
    const profile = {
      ...ctx.scene.state,
      chat_id: ctx.from.id,
    };

    await this.profilesService.create(profile);

    ctx.session['profile'] = profile;
    ctx.session['relations'] = [];

    ctx.answerCbQuery();

    ctx.scene.enter('swiper_main', { is_first: true });
  }

  @Action('edit')
  async onEditAction(ctx: Context) {
    await this.profilesService.create({
      ...ctx.scene.state,
      chat_id: ctx.from.id,
    });

    ctx.answerCbQuery();

    ctx.scene.enter('account_menu');
  }

  @On('message')
  async onMessage(ctx: Context) {
    ctx.scene.reenter();
  }
}
