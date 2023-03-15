import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InjectBot } from 'nestjs-telegraf';
import { Profile } from 'src/profiles/schemas/profiles.schema';
import { User, UserDocument } from 'src/users/schemas/users.schema';
import { Context, Telegraf } from 'telegraf';

@Injectable()
export class AdminService {
  constructor(
    @InjectBot()
    private readonly bot: Telegraf<Context>,
    @InjectModel(User.name) private usersModel: Model<UserDocument>,
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

  async userMailing(message: string, extra: unknown) {
    let blocked = 0;
    const users = await this.usersModel.find();

    await Promise.all(
      users.map(async (user) => {
        setTimeout(async () => {
          try {
            await this.bot.telegram.sendMessage(user.chat_id, message, extra);
          } catch (e: any) {
            if (e.code === 403) {
              await this.usersModel.deleteOne({ chat_id: user.chat_id });

              blocked++;
            } else {
              console.log(e);
            }
          }
        }, 50);
      }),
    );

    await this.bot.telegram.sendMessage(
      process.env.ADMIN_ID,
      `✅ Розсилка пройшла успішно, повідомлення отримали <b>${
        users.length - blocked
      }</b> користувачів, заблоковано: <b>${blocked}</b>.`,
      { parse_mode: 'HTML' },
    );
  }
}
