import { UseFilters } from '@nestjs/common';
import { Scene, SceneEnter, On, Action } from 'nestjs-telegraf';
import { TelegrafExceptionFilter } from 'src/common/filters/telegraf-exception.filter';
import { Context } from 'src/interfaces/context.interface';
import { ProfilesService } from 'src/profiles/profiles.service';
import { Markup } from 'telegraf';

@Scene('account_menu')
@UseFilters(TelegrafExceptionFilter)
export class AccountMenuScene {
  constructor(private readonly profilesService: ProfilesService) {}

  @SceneEnter()
  async onSceneEnter(ctx: Context) {
    const { name, age, city, gender, description, avatar } =
      ctx.session['profile'];

    const caption = `<b>${name}, ${age}</b>. ${city} \n\n${description || ''}`;

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
      `📋  <b>Заповнити</b> профіль заново\n📸  <b>Змінити</b> фото/відео\n📝  <b>Змінити</b> текст профілю\n\n<i>Обирай:</i>`,
      Markup.inlineKeyboard([
        [
          { text: '📋', callback_data: 'reonboard' },
          { text: '📸', callback_data: 'avatar' },
          { text: '📝', callback_data: 'description' },
        ],
        [
          {
            text: '🚀 Продовжити перегляд профілів',
            callback_data: 'continue',
          },
        ],
      ]),
    );
  }

  @Action('reonboard')
  async onReonboard(ctx: Context) {
    await this.profilesService.delete(ctx.from.id);

    ctx.answerCbQuery();

    ctx.scene.enter('reg_age');
  }

  @Action('avatar')
  async onAvatar(ctx: Context) {
    ctx.answerCbQuery();

    ctx.scene.enter('edit_avatar');
  }

  @Action('description')
  async onDescription(ctx: Context) {
    ctx.answerCbQuery();

    ctx.scene.enter('edit_description');
  }

  @Action('continue')
  async onContinueAction(ctx: Context) {
    ctx.answerCbQuery();

    ctx.scene.enter('swiper_main', { is_first: true });
  }

  @On('message')
  async onMessage(ctx: Context) {
    ctx.scene.reenter();
  }
}
