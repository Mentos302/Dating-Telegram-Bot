import { UseFilters } from '@nestjs/common';
import { Scene, SceneEnter, On, Ctx, Message } from 'nestjs-telegraf';
import { SCENE_SETTINGS } from 'src/common/config/scene';
import { TelegrafExceptionFilter } from 'src/common/filters/telegraf-exception.filter';
import { Context } from 'src/interfaces/context.interface';
import { ProfilesService } from 'src/profiles/profiles.service';
import { RelationsService } from 'src/relations/relations.service';

@Scene('edit_avatar', SCENE_SETTINGS)
@UseFilters(TelegrafExceptionFilter)
export class AccountAvatarScene {
  constructor(
    private readonly profilesService: ProfilesService,
    private readonly relationsService: RelationsService,
  ) {}

  @SceneEnter()
  async onSceneEnter(ctx: Context) {
    ctx.replyWithHTML(
      `📸 Надішли <b>своє фото або запиши відео</b> 👍 (до 15 сек), його будуть бачити інші користувачі.`,
    );
  }

  @On('photo')
  async onPhoto(@Ctx() ctx: Context, @Message('photo') photo) {
    const avatar = {
      file_id: photo[0].file_id,
    };

    await this.profilesService.update(ctx.from.id, {
      avatar,
    });

    await this.relationsService.delete(ctx.from.id, true);

    ctx.session['profile'].avatar = avatar;

    ctx.scene.enter('account_menu');
  }

  @On('video')
  async onVideo(@Ctx() ctx: Context, @Message('video') video) {
    const avatar = {
      file_id: video.file_id,
      is_video: true,
    };

    await this.profilesService.update(ctx.from.id, {
      avatar,
    });

    await this.relationsService.delete(ctx.from.id, true);

    ctx.session['profile'].avatar = avatar;

    ctx.scene.enter('account_menu');
  }

  @On('message')
  async onMessage(ctx: Context) {
    ctx.scene.reenter();
  }
}
