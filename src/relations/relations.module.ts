import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfilesModule } from 'src/profiles/profiles.module';
import { LikelyScene } from './likely/likely.scene';
import { RelationsService } from './relations.service';
import { RelationsUpdate } from './relations.update';
import { SwiperScenes } from './scenes/swiper';
import { Relation, RelationSchema } from './schemas/relations.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Relation.name, schema: RelationSchema },
    ]),
    forwardRef(() => ProfilesModule),
  ],
  providers: [RelationsUpdate, RelationsService, ...SwiperScenes, LikelyScene],
  exports: [RelationsService],
})
export class RelationsModule {}
