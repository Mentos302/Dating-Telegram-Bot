import { Scene, SceneEnter, Action, On, Ctx, Message } from 'nestjs-telegraf';
import { Context } from 'src/interfaces/context.interface';

@Scene('reg_avatar')
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
