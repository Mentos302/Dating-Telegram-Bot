import { Markup } from 'telegraf';
import { UseFilters } from '@nestjs/common';
import { Scene, SceneEnter, Action, On } from 'nestjs-telegraf';
import { TelegrafExceptionFilter } from 'src/common/filters/telegraf-exception.filter';
import { Context } from 'src/interfaces/context.interface';
import { SCENE_SETTINGS } from 'src/common/config/scene';

@Scene('reg_gender', SCENE_SETTINGS)
@UseFilters(TelegrafExceptionFilter)
export class RegistrationGenderScene {
  @SceneEnter()
  onSceneEnter(ctx: Context) {
    ctx.replyWithHTML(
      `Окей, <b>${ctx.from.first_name}</b>, вибери свою стать.`,
      Markup.inlineKeyboard([
        { text: '👦 Я хлопець', callback_data: 'boy' },
        { text: '👧 Я дівчина', callback_data: 'girl' },
      ]),
    );
  }

  @Action('boy')
  async onBoyAction(ctx: Context) {
    ctx.answerCbQuery();

    ctx.scene.enter('reg_candidate', { ...ctx.scene.state, gender: 1 });
  }

  @Action('girl')
  async onGirlAction(ctx: Context) {
    ctx.answerCbQuery();

    ctx.scene.enter('reg_candidate', { ...ctx.scene.state, gender: 0 });
  }

  @On('message')
  async onMessage(ctx: Context): Promise<void> {
    ctx.scene.reenter();
  }
}
