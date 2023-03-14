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
import { Telegraf } from 'telegraf';
import { Context } from '../interfaces/context.interface';
import { RelationsService } from './relations.service';
// import { ReverseTextPipe } from '../common/pipes/reverse-text.pipe';
// import { ResponseTimeInterceptor } from '../common/interceptors/response-time.interceptor';
// import { AdminGuard } from '../common/guards/admin.guard';
// import { TelegrafExceptionFilter } from '../common/filters/telegraf-exception.filter';

@Update()
// @UseInterceptors(ResponseTimeInterceptor)
// @UseFilters(TelegrafExceptionFilter)
export class RelationsUpdate {
  constructor(
    @InjectBot()
    private readonly bot: Telegraf<Context>,
    private readonly relationsService: RelationsService,
  ) {}
}
