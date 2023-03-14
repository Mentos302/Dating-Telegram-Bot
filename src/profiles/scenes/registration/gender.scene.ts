import { Scene, SceneEnter, Action, On } from 'nestjs-telegraf';
import { Context } from 'src/interfaces/context.interface';
import { Markup } from 'telegraf';

@Scene('reg_gender')
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
    ctx.scene.enter('reg_candidate', { ...ctx.scene.state, gender: 1 });
  }

  @Action('girl')
  async onGirlAction(ctx: Context) {
    ctx.scene.enter('reg_candidate', { ...ctx.scene.state, gender: 0 });
  }

  @On('message')
  async onMessage(ctx: Context): Promise<void> {
    ctx.scene.reenter();
  }
}
