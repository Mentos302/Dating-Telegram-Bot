import { Scene, SceneEnter, On, Ctx, Message, Command } from 'nestjs-telegraf';
import { Context } from 'src/interfaces/context.interface';
import { Markup } from 'telegraf';
import { AdminService } from '../admin.service';

@Scene('admin_mail')
export class AdminMailingScene {
  constructor(private readonly adminService: AdminService) {}

  @SceneEnter()
  async onSceneEnter(ctx: Context) {
    ctx.replyWithHTML(
      `⚠️ Розсилка користувачам\n\nНадішліть повідомлення для розсилки користувачам боту.`,
    );
  }

  @Command('activity')
  async activityBoost() {
    this.adminService.userMailing(
      '😍 Твій профіль сподобався 3 людям\n\nПоказати кому?',
      {
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [Markup.button.callback('Переглянути лайки ❤️', 'rndmsht')],
          ],
        },
      },
    );
  }
}
