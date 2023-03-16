import { Markup, Telegraf } from 'telegraf';
import { UseFilters } from '@nestjs/common';
import { Scene, SceneEnter, On, Action, InjectBot } from 'nestjs-telegraf';
import { AdminService } from 'src/admin/admin.service';
import { TelegrafExceptionFilter } from 'src/common/filters/telegraf-exception.filter';
import { Context } from 'src/interfaces/context.interface';
import { ProfilesService } from 'src/profiles/profiles.service';
import { RelationsService } from 'src/relations/relations.service';

@Scene('likely')
@UseFilters(TelegrafExceptionFilter)
export class LikelyScene {
  constructor(
    @InjectBot()
    private readonly bot: Telegraf<Context>,
    private readonly adminService: AdminService,
    private readonly profilesService: ProfilesService,
    private readonly relationsService: RelationsService,
  ) {}

  @SceneEnter()
  async onSceneEnter(ctx: Context) {
    const candidates: number[] = ctx.session['likely'];

    if (candidates.length) {
      const candidate = await this.profilesService.findByChatId(candidates[0]);
      const { name, avatar, age, city, description } = candidate;

      const caption = `<b>${name}, ${age}</b>. ${city} \n\n${
        description || ''
      }`;

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
      ctx.scene.enter('swiper_main');
    }
  }

  @Action('yes')
  async onYes(ctx: Context) {
    const { name, chat_id } = await this.profilesService.findByChatId(
      ctx.session['likely'][0],
    );

    ctx.replyWithHTML(
      `<b>❤️ Чудово!</b> У вас взаємна симпатія.\n\n<i>Не соромся написати першим(ою)</i> 👉 <a href="tg://user?id=${chat_id}">${name}</a>`,
      Markup.inlineKeyboard([
        { text: 'Продовжити пошуки ☺️🔎', callback_data: 'continue' },
      ]),
    );

    try {
      await this.bot.telegram.sendMessage(
        chat_id,
        `❤️ <b>Є взаємна симпатія!</b>\n\n<i>Не соромся написати першим(ою)</i> 👉 <a href="tg://user?id=${ctx.from.id}">${ctx.from.first_name}</a>`,
        {
          parse_mode: 'HTML',
          reply_markup: {
            inline_keyboard: [
              [Markup.button.callback('📝 Мій профіль', 'rndmsht')],
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

    await this.relationsService.updateLikely(chat_id, ctx.from.id);
  }

  @Action('no')
  async onNo(ctx: Context) {
    const chat_id: number = ctx.session['likely'][0];

    await this.relationsService.updateLikely(chat_id, ctx.from.id);

    ctx.session['likely'].shift();

    ctx.answerCbQuery();

    ctx.scene.reenter();
  }

  @Action('report')
  async onReportAction(ctx: Context) {
    let profile = await this.profilesService.findByChatId(
      ctx.session['likely'][0],
    );

    if (profile.strikes > 2) {
      await this.adminService.reportUserNotification(profile);

      await this.profilesService.update(profile.chat_id, { is_active: false });
    } else {
      profile.strikes++;

      await this.profilesService.update(profile.chat_id, {
        strikes: profile.strikes,
      });
    }

    await this.relationsService.updateLikely(profile.chat_id, ctx.from.id);

    ctx.session['likely'].shift();

    ctx.answerCbQuery();

    ctx.scene.reenter();
  }

  @Action('go_exit')
  async onExitAction(ctx: Context) {
    ctx.answerCbQuery();

    ctx.scene.enter('swiper_menu');
  }

  @Action('continue')
  async onContinueAction(ctx: Context) {
    ctx.session['likely'].shift();

    ctx.answerCbQuery();

    if (ctx.session['likely'].length) {
      ctx.scene.enter('likely', { is_first: true });
    } else {
      ctx.scene.enter('swiper_main', { is_first: true });
    }
  }

  @On('message')
  async onMessage(ctx: Context) {
    ctx.scene.enter('likely', { is_first: true });
  }
}
