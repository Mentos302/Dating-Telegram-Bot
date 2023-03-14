import { Scene, SceneEnter, Action, On, Ctx, Message } from 'nestjs-telegraf';
import { Context } from 'src/interfaces/context.interface';
import { Markup } from 'telegraf';

@Scene('reg_candidate')
export class RegistrationCandidateScene {
  @SceneEnter()
  onSceneEnter(ctx: Context) {
    ctx.replyWithHTML(
      `🔍 <b>${ctx.from.first_name}</b>, а хто тебе цікавить?`,
      Markup.inlineKeyboard([
        { text: '👦 Хлопці', callback_data: 'boys' },
        { text: '👧 Дівчата', callback_data: 'girls' },
        { text: '👤 Байдуже', callback_data: 'both' },
      ]),
    );
  }

  @Action('girls')
  async onGirlsAction(ctx: Context) {
    ctx.scene.state = { ...ctx.scene.state, interest: 0 };

    ctx.replyWithHTML(
      `🕯 <b>${ctx.from.first_name}</b>, напиши мінімальний вік людини для знайомства з тобою.`,
    );
  }

  @Action('boys')
  async onBoysAction(ctx: Context) {
    ctx.scene.state = { ...ctx.scene.state, interest: 1 };

    ctx.replyWithHTML(
      `🕯 <b>${ctx.from.first_name}</b>, напиши мінімальний вік людини для знайомства з тобою.`,
    );
  }

  @Action('both')
  async onBothAction(ctx: Context) {
    ctx.scene.state = { ...ctx.scene.state, interest: 2 };

    ctx.replyWithHTML(
      `🕯 <b>${ctx.from.first_name}</b>, напиши мінімальний вік людини для знайомства з тобою.`,
    );
  }

  @On('text')
  async onText(@Ctx() ctx: Context, @Message('text') candidateAge: string) {
    if (isNaN(parseInt(candidateAge?.trim()))) {
      ctx.replyWithHTML('❌ Вкажи правильний вік, <b>тільки числа!</b>');
    } else {
      ctx.scene.enter(`reg_city`, { ...ctx.scene.state, candidateAge });
    }
  }

  @On('message')
  async onMessage(ctx: Context): Promise<void> {
    ctx.scene.reenter();
  }
}
