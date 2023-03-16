import { UseFilters } from '@nestjs/common';
import { Scene, SceneEnter, On, Message, Ctx, Action } from 'nestjs-telegraf';
import { TelegrafExceptionFilter } from 'src/common/filters/telegraf-exception.filter';
import { Context } from 'src/interfaces/context.interface';
import { ProfilesService } from 'src/profiles/profiles.service';
import { Markup } from 'telegraf';

@Scene('edit_description')
@UseFilters(TelegrafExceptionFilter)
export class AccountDescriptionScene {
  constructor(private readonly profilesService: ProfilesService) {}

  @SceneEnter()
  async onSceneEnter(ctx: Context) {
    ctx.replyWithHTML(
      `📝 Розкажи трохи <b>про себе і кого хочеш знайти</b>. Це допоможе краще підібрати тобі компанію.`,
      Markup.inlineKeyboard([{ text: 'Пропустити', callback_data: 'skip' }]),
    );
  }

  @Action('skip')
  async onOkayAction(ctx: Context): Promise<void> {
    await this.profilesService.update(ctx.from.id, {
      description: '',
    });

    ctx.session['profile'].description = '';

    ctx.answerCbQuery();

    ctx.scene.enter('account_menu');
  }

  @On('text')
  async onText(@Ctx() ctx: Context, @Message('text') description: string) {
    let linkFilter = description.replace(/\./g, ' ').replace(/@/g, ' ');

    await this.profilesService.update(ctx.from.id, {
      description: linkFilter,
    });

    ctx.session['profile'].description = linkFilter;

    ctx.scene.enter('account_menu');
  }

  @On('message')
  async onMessage(ctx: Context) {
    ctx.scene.reenter();
  }
}
