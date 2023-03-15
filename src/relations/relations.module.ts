import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfilesModule } from 'src/profiles/profiles.module';
import { LikelyScene } from './scenes/likely/likely.scene';
import { RelationsService } from './relations.service';
import { SwiperScenes } from './scenes/swiper';
import { Relation, RelationSchema } from './schemas/relations.schema';
import { AdminModule } from 'src/admin/admin.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Relation.name, schema: RelationSchema },
    ]),
    forwardRef(() => ProfilesModule),
    AdminModule,
  ],
  providers: [RelationsService, ...SwiperScenes, LikelyScene],
  exports: [RelationsService],
})
export class RelationsModule {}
