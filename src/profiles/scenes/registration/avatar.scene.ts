import { UseFilters } from '@nestjs/common';
import { Scene, SceneEnter, On, Ctx, Message } from 'nestjs-telegraf';
import { SCENE_SETTINGS } from 'src/common/config/scene';
import { TelegrafExceptionFilter } from 'src/common/filters/telegraf-exception.filter';
import { Context } from 'src/interfaces/context.interface';

@Scene('reg_avatar', SCENE_SETTINGS)
@UseFilters(TelegrafExceptionFilter)
export class RegistrationAvatarScene {
  @SceneEnter()
  onSceneEnter(ctx: Context) {
    ctx.replyWithHTML(
      `📸 Тепер надішли <b>своє фото або запиши відео</b> 👍 (до 15 сек), його будуть бачити інші користувачі.`,
    );
  }

  @On('photo')
  async onPhoto(@Ctx() ctx: Context, @Message('photo') photo) {
    ctx.scene.enter('reg_confirmation', {
      ...ctx.scene.state,
      avatar: {
        file_id: photo[0].file_id,
      },
    });
  }

  @On('video')
  async onVideo(@Ctx() ctx: Context, @Message('video') video) {
    ctx.scene.enter('reg_confirmation', {
      ...ctx.scene.state,
      avatar: {
        file_id: video.file_id,
        is_video: true,
      },
    });
  }

  @On('message')
  async onMessage(ctx: Context): Promise<void> {
    ctx.scene.reenter();
  }
}
