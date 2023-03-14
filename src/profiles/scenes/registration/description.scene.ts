import { Scene, SceneEnter, Action, On, Ctx, Message } from 'nestjs-telegraf';
import { Context } from 'src/interfaces/context.interface';
import { Markup } from 'telegraf';

@Scene('reg_description')
export class RegistrationDescriptionScene {
  @SceneEnter()
  onSceneEnter(ctx: Context) {
    ctx.replyWithHTML(
      `📝 Розкажи трохи <b>про себе і кого хочеш знайти</b>. Це допоможе краще підібрати тобі компанію.`,
      Markup.inlineKeyboard([{ text: 'Пропустити', callback_data: 'skip' }]),
    );
  }

  @Action('skip')
  async onOkayAction(ctx: Context): Promise<void> {
    ctx.answerCbQuery();

    ctx.scene.enter('reg_avatar', { ...ctx.scene.state, description: '' });
  }

  @On('text')
  async onText(@Ctx() ctx: Context, @Message('text') description: string) {
    let linkFilter = description.replace(/\./g, ' ').replace(/@/g, ' ');

    ctx.scene.enter('reg_avatar', {
      ...ctx.scene.state,
      description: linkFilter,
    });
  }

  @On('message')
  async onMessage(ctx: Context): Promise<void> {
    ctx.scene.reenter();
  }
}
