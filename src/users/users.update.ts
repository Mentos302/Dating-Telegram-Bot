import { UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import {
  Help,
  InjectBot,
  On,
  Message,
  Start,
  Update,
  Command,
  Ctx,
} from 'nestjs-telegraf';
import { ProfilesService } from 'src/profiles/profiles.service';
import { RelationsService } from 'src/relations/relations.service';
import { Telegraf } from 'telegraf';
import { Context } from '../interfaces/context.interface';
import { UsersService } from './users.service';
// import { ReverseTextPipe } from '../common/pipes/reverse-text.pipe';
// import { ResponseTimeInterceptor } from '../common/interceptors/response-time.interceptor';
// import { AdminGuard } from '../common/guards/admin.guard';
// import { TelegrafExceptionFilter } from '../common/filters/telegraf-exception.filter';

@Update()
// @UseInterceptors(ResponseTimeInterceptor)
// @UseFilters(TelegrafExceptionFilter)
export class UsersUpdate {
  constructor(
    @InjectBot()
    private readonly bot: Telegraf<Context>,
    private readonly usersService: UsersService,
    private readonly profilesService: ProfilesService,
    private readonly relationsService: RelationsService,
  ) {}

  @On('message')
  async onMessage(@Ctx() ctx: Context): Promise<void> {
    const user = await this.usersService.findByChatId(ctx.from.id);

    if (!user) await this.usersService.create(ctx.from.id);

    const profile = await this.profilesService.findByChatId(ctx.from.id);

    if (profile) {
      const likes = await this.relationsService.findLikes(ctx.from.id);

      if (likes.length) ctx.scene.enter('likely', { is_first: true, likes });

      const relations = await this.relationsService.findByChatId(ctx.from.id);

      ctx.scene.state = {
        profile,
        relations,
      };

      ctx.scene.enter('profile_menu');
    }

    ctx.scene.enter('reg_greeting');
  }
}
