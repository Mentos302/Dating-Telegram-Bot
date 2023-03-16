import { Markup } from 'telegraf';
import { UseFilters } from '@nestjs/common';
import { Scene, SceneEnter, Action, On, Ctx, Message } from 'nestjs-telegraf';
import { TelegrafExceptionFilter } from 'src/common/filters/telegraf-exception.filter';
import { Context } from 'src/interfaces/context.interface';

@Scene('reg_name')
@UseFilters(TelegrafExceptionFilter)
export class RegistrationNameScene {
  @SceneEnter()
  onSceneEnter(ctx: Context) {
    ctx.replyWithHTML(
      `👤 Напиши або вибери ім'я, яке потрібно <b>вказати в анкеті</b>.`,
      Markup.inlineKeyboard([
        { text: ctx.from.first_name, callback_data: 'first_name' },
      ]),
    );
  }

  @Action('first_name')
  async onOkayAction(ctx: Context): Promise<void> {
    ctx.answerCbQuery();

    ctx.scene.enter('reg_description', {
      ...ctx.scene.state,
      name: ctx.from.first_name,
    });
  }

  @On('text')
  async onText(@Ctx() ctx: Context, @Message('text') name: string) {
    ctx.scene.enter('reg_description', { ...ctx.scene.state, name });
  }

  @On('message')
  async onMessage(ctx: Context): Promise<void> {
    ctx.scene.reenter();
  }
}
