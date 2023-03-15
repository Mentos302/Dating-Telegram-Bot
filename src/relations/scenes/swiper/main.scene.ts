import { Scene, SceneEnter, On, Action, InjectBot } from 'nestjs-telegraf';
import { Context } from 'src/interfaces/context.interface';
import { ProfilesService } from 'src/profiles/profiles.service';
import { Profile } from 'src/profiles/schemas/profiles.schema';
import { RelationsService } from 'src/relations/relations.service';
import { Markup, Telegraf } from 'telegraf';
import { inlineKeyboard, keyboard } from 'telegraf/typings/markup';

@Scene('swiper_main')
export class SwiperMainScene {
  constructor(
    @InjectBot()
    private readonly bot: Telegraf<Context>,
    private readonly profilesService: ProfilesService,
    private readonly relationsService: RelationsService,
  ) {}

  @SceneEnter()
  async onSceneEnter(ctx: Context) {
    const candidates: Profile[] = ctx.session['candidates'];

    if (candidates.length) {
      const { name, avatar, age, city, description } = candidates[0];

      const caption = `<b>${name}, ${age}</b>. ${city} \n\n${description}`;

      const inline_keyboard = [
        [
          Markup.button.callback('❤️', 'yes'),
          Markup.button.callback('❌', 'no'),
        ],
        [
          Markup.button.callback('🆘 Скарга', 'report'),
          Markup.button.callback('💤 Вийти', 'go_exit'),
        ],
      ];

      if (ctx.scene.state['is_first']) {
        avatar.is_video
          ? ctx.replyWithVideo(`${avatar.file_id}`, {
              caption,
              parse_mode: 'HTML',
              reply_markup: {
                inline_keyboard,
              },
            })
          : ctx.replyWithPhoto(`${avatar.file_id}`, {
              caption,
              parse_mode: 'HTML',
              reply_markup: {
                inline_keyboard,
              },
            });

        delete ctx.scene.state['is_first'];
      } else {
        const media = avatar.file_id;

        await ctx.editMessageMedia(
          avatar.is_video ? { type: 'video', media } : { type: 'photo', media },
        );

        ctx.editMessageCaption(caption, {
          parse_mode: 'HTML',
          reply_markup: {
            inline_keyboard,
          },
        });
      }
    } else {
      ctx.replyWithHTML(
        `😍 Ви переглянули <b>всі доступні профілі</b>, очікуйте незабаром Вам хтось відповість або з'являться нові профілі.\n\n💬 А поки <b>можете поспілкуватись</b> в нашому чаті @lviv_lampchat`,
      );

      ctx.scene.leave();
    }
  }

  @Action('yes')
  async onYes(ctx: Context) {
    const { chat_id }: Profile = ctx.session['candidates'][0];
    const likes = await this.profilesService.addNewLike(chat_id);

    if (likes && likes % 3 === 0) {
      try {
        await this.bot.telegram.sendMessage(
          chat_id,
          `😍 Твій профіль сподобався <b>${likes} людям</b>\n\n<i>Показати кому?</i>}`,
          {
            parse_mode: 'HTML',
            reply_markup: {
              inline_keyboard: [
                [Markup.button.callback('Переглянути лайки ❤️', 'likely')],
              ],
            },
          },
        );
      } catch (e: any) {
        if (e.response && e.response.error_code === 403) {
          await this.profilesService.delete(chat_id);
          await this.relationsService.delete(chat_id);
        } else {
          throw new Error(`Unexpected error with like sending`);
        }
      }
    }

    await this.relationsService.create(ctx.from.id, chat_id, true);

    ctx.session['candidates'].shift();

    ctx.answerCbQuery();

    ctx.scene.reenter();
  }

  @Action('no')
  async onNo(ctx: Context) {
    const { chat_id }: Profile = ctx.session['candidates'][0];

    await this.relationsService.create(ctx.from.id, chat_id);

    ctx.session['candidates'].shift();

    ctx.answerCbQuery();

    ctx.scene.reenter();
  }

  @Action('report')
  async onReportAction(ctx: Context) {
    let { strikes, chat_id }: Profile = ctx.session['candidates'][0];

    if (strikes > 2) {
      await this.profilesService.update(chat_id, { is_active: false });
    } else {
      strikes++;

      await this.profilesService.update(chat_id, { strikes });
    }

    await this.relationsService.create(ctx.from.id, chat_id);

    ctx.session['candidates'].shift();

    ctx.answerCbQuery();

    ctx.scene.reenter();
  }

  @Action('go_exit')
  async onExitAction(ctx: Context) {
    ctx.answerCbQuery();

    ctx.scene.enter('swiper_menu');
  }

  @On('message')
  async onMessage(ctx: Context) {
    ctx.scene.enter('swiper_menu');
  }
}
