import { Scene, SceneEnter, On, Action } from 'nestjs-telegraf';
import { Context } from 'src/interfaces/context.interface';
import { ProfilesService } from 'src/profiles/profiles.service';
import { RelationsService } from 'src/relations/relations.service';
import { Markup } from 'telegraf';

@Scene('swiper_menu')
export class SwiperMenuScene {
  constructor(
    private readonly profilesService: ProfilesService,
    private readonly relationsService: RelationsService,
  ) {}

  @SceneEnter()
  async onSceneEnter(ctx: Context) {
    ctx.replyWithHTML(
      `📝  <b>Мій</b> профіль\n🙅‍♂️  <b>Я більше не хочу</b> нікого шукати\n🚀  <b>Продовжити</b> перегляд профілів\n\n<i>Обирай:</i>`,
      Markup.inlineKeyboard([
        [
          { text: '📝 Мій профіль', callback_data: 'profile' },
          { text: '🙅‍♂️ Більше не шукаю', callback_data: 'close' },
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

  @Action('continue')
  async onContinueAction(ctx: Context) {
    ctx.answerCbQuery();

    ctx.scene.enter('swiper_main', { is_first: true });
  }

  @Action('profile')
  async onProfileAction(ctx: Context) {
    ctx.answerCbQuery();

    ctx.scene.enter('account_menu');
  }

  @Action('close')
  async onCloseAction(ctx: Context) {
    ctx.answerCbQuery();

    ctx.replyWithHTML(
      `🚨 <b>Так ти не знатимеш, що комусь сподобався твій профіль</b>.\n\n<i>Точно хочеш відключити свій профіль?</i>`,
      Markup.inlineKeyboard([
        { text: '✖️ Так', callback_data: 'close_confirm' },
        { text: '↩️ Назад', callback_data: 'go_back' },
      ]),
    );
  }

  @Action('go_back')
  async onGoBack(ctx: Context) {
    ctx.answerCbQuery();

    ctx.scene.enter('swiper_menu');
  }

  @Action('close_confirm')
  async onCloseConfirmAction(ctx: Context) {
    await this.profilesService.delete(ctx.from.id);
    await this.relationsService.delete(ctx.from.id);

    ctx.answerCbQuery();

    ctx.replyWithHTML(
      `👋 Надіюсь я допоміг тобі знайти когось, <b>радий був з тобою поспілкуватись.</b>\n\nБуде скучно - пиши, обов'язково знайдемо когось!`,
      Markup.inlineKeyboard([
        { text: 'Шукати знову ☺️', callback_data: 'regagain' },
      ]),
    );

    ctx.scene.leave();
  }

  @On('message')
  async onMessage(ctx: Context) {
    ctx.scene.reenter();
  }
}
