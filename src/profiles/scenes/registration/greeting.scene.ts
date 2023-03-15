import { Scene, SceneEnter, Action, On } from 'nestjs-telegraf';
import { Context } from 'src/interfaces/context.interface';
import { Markup } from 'telegraf';

@Scene('reg_greeting')
export class RegistrationGreetingScene {
  @SceneEnter()
  onSceneEnter(ctx: Context) {
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
