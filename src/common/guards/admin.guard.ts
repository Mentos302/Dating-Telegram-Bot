import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { TelegrafExecutionContext, TelegrafException } from 'nestjs-telegraf';
import { Context } from '../../interfaces/context.interface';
import * as Sentry from '@sentry/node';

@Injectable()
export class AdminGuard implements CanActivate {
  private readonly ADMIN_IDS = [process.env.ADMIN_ID];

  canActivate(context: ExecutionContext): boolean {
    const ctx = TelegrafExecutionContext.create(context);
    const { from } = ctx.getContext<Context>();

    const isAdmin = this.ADMIN_IDS.includes(JSON.stringify(from.id));

    return isAdmin;
  }
}
