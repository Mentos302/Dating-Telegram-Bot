import { Injectable } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { Profile } from 'src/profiles/schemas/profiles.schema';
import { Context, Telegraf } from 'telegraf';

@Injectable()
export class AdminService {
  constructor(
    @InjectBot()
    private readonly bot: Telegraf<Context>,
  ) {}

  async newUserNotification(profile: Profile) {
    const { name, age, city, description, avatar } = profile;

    await this.bot.telegram.sendMessage(
      process.env.ADMIN_ID,
      `<b>🚨 Новий профіль в сервісі: </b>`,
      { parse_mode: 'HTML' },
    );

    const caption = `<b>${name}, ${age}</b>. ${city} \n\n${description || ''}`;

    avatar.is_video
      ? this.bot.telegram.sendVideo(
          process.env.ADMIN_ID,
          `${profile.avatar.file_id}`,
          {
            caption,
            parse_mode: 'HTML',
          },
        )
      : this.bot.telegram.sendPhoto(
          process.env.ADMIN_ID,
          `${profile.avatar.file_id}`,
          {
            caption,
            parse_mode: 'HTML',
          },
        );
  }

  async reportUserNotification(profile: Profile) {
    const { name, age, city, description, avatar } = profile;

    await this.bot.telegram.sendMessage(
      process.env.ADMIN_ID,
      `<b>🚨 Увага профіль  відключено через скарги: </b>ID <code>${profile.chat_id}</code>`,
      { parse_mode: 'HTML' },
    );

    const caption = `<b>${name}, ${age}</b>. ${city} \n\n${description || ''}`;

    avatar.is_video
      ? this.bot.telegram.sendVideo(
          process.env.ADMIN_ID as string,
          `${profile.avatar.file_id}`,
          {
            caption,
            parse_mode: 'HTML',
          },
        )
      : this.bot.telegram.sendPhoto(
          process.env.ADMIN_ID as string,
          `${profile.avatar.file_id}`,
          {
            caption,
            parse_mode: 'HTML',
          },
        );
  }
}
