import { InjectBot, Update } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { Context } from '../interfaces/context.interface';
import { RelationsService } from './relations.service';

@Update()
export class RelationsUpdate {
  constructor(
    @InjectBot()
    private readonly bot: Telegraf<Context>,
    private readonly relationsService: RelationsService,
  ) {}
}
