import { UseFilters } from '@nestjs/common';
import { Scene, SceneEnter, On, Message, Ctx } from 'nestjs-telegraf';
import { SCENE_SETTINGS } from 'src/common/config/scene';
import { TelegrafExceptionFilter } from 'src/common/filters/telegraf-exception.filter';
import { Context } from 'src/interfaces/context.interface';

@Scene('reg_age', SCENE_SETTINGS)
@UseFilters(TelegrafExceptionFilter)
export class RegistrationAgeScene {
  @SceneEnter()
  onSceneEnter(ctx: Context) {
    ctx.replyWithHTML(`<b>${ctx.from.first_name}</b>, скільки тобі років?`);
  }

  @On('text')
  async onText(@Ctx() ctx: Context, @Message('text') age: string) {
    if (isNaN(parseInt(age?.trim()))) {
      ctx.replyWithHTML('❌ Вкажи правильний вік, <b>тільки числа!</b>');
    } else {
      ctx.scene.enter(`reg_gender`, { age });
    }
  }

  @On('message')
  async onMessage(ctx: Context) {
    ctx.scene.reenter();
  }
}
