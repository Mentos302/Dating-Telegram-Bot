import { UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { On, Update, Ctx, Command } from 'nestjs-telegraf';
import { ProfilesService } from 'src/profiles/profiles.service';
import { RelationsService } from 'src/relations/relations.service';
import { Context } from '../interfaces/context.interface';
import { UsersService } from './users.service';
import { ResponseTimeInterceptor } from '../common/interceptors/response-time.interceptor';
import { SentryInterceptor } from 'src/common/interceptors/sentry-interceptor';
import { TelegrafExceptionFilter } from 'src/common/filters/telegraf-exception.filter';
import { AdminGuard } from 'src/admin/admin.guard';

@Update()
@UseInterceptors(SentryInterceptor)
@UseInterceptors(ResponseTimeInterceptor)
@UseFilters(TelegrafExceptionFilter)
export class UsersUpdate {
  constructor(
    private readonly usersService: UsersService,
    private readonly profilesService: ProfilesService,
    private readonly relationsService: RelationsService,
  ) {}

  @Command('users')
  @UseGuards(AdminGuard)
  async onUsers(): Promise<string> {
    const users = await this.usersService.findAll();

    return `🤩 Ботом користується ${users.length} людей`;
  }

  @Command('admin_mail')
  @UseGuards(AdminGuard)
  async onAdminMailCommand(ctx: Context) {
    ctx.scene.enter('admin_mail');
  }

  @On(['message', 'callback_query'])
  async onMessage(@Ctx() ctx: Context): Promise<void> {
    const user = await this.usersService.findByChatId(ctx.from.id);

    if (!user) await this.usersService.create(ctx.from.id);

    const profile = await this.profilesService.findByChatId(ctx.from.id);

    if (profile) {
      const relations = await this.relationsService.findByChatId(ctx.from.id);
      const likely = await this.relationsService.findLikes(ctx.from.id);

      ctx.session['likely'] = likely;
      ctx.session['profile'] = profile;
      ctx.session['relations'] = relations;
      ctx.session['candidates'] = await this.profilesService
        .findCandidates(profile, relations)
        .catch((e) => console.log(e));

      likely.length
        ? ctx.scene.enter('likely', { is_first: true })
        : ctx.scene.enter('account_menu');
    } else {
      ctx.scene.enter('reg_greeting');
    }
  }
}
