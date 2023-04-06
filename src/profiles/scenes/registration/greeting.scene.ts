import { Markup } from 'telegraf';
import { UseFilters } from '@nestjs/common';
import { Scene, SceneEnter, Action, On } from 'nestjs-telegraf';
import { TelegrafExceptionFilter } from 'src/common/filters/telegraf-exception.filter';
import { Context } from 'src/interfaces/context.interface';
import { SCENE_SETTINGS } from 'src/common/config/scene';

@Scene('reg_greeting', SCENE_SETTINGS)
@UseFilters(TelegrafExceptionFilter)
export class RegistrationGreetingScene {
  @SceneEnter()
  async onSceneEnter(ctx: Context) {
    ctx.replyWithHTML(
      `👋 Привіт, <b>${ctx.from.first_name}</b>. \n\nЯ можу допомогти тобі знайти <b>❤️ пару</b> або просто <b>🎉 друзів</b>. \nДля цього потрібно відповісти на <b>декілька запитань, окей?</b>`,
      Markup.inlineKeyboard([[{ text: 'Так 👍', callback_data: 'okay' }]]),
    );
  }

  @Action('okay')
  async onOkayAction(ctx: Context) {
    ctx.answerCbQuery();

    ctx.scene.enter('reg_age');
  }

  @On('message')
  async onMessage(ctx: Context) {
    ctx.scene.reenter();
  }
}
