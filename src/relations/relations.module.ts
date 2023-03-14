import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfilesModule } from 'src/profiles/profiles.module';
import { RelationsService } from './relations.service';
import { RelationsUpdate } from './relations.update';
import { Relation, RelationSchema } from './schemas/relations.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Relation.name, schema: RelationSchema },
    ]),
    ProfilesModule,
    RelationsModule,
  ],
  providers: [RelationsUpdate, RelationsService],
  exports: [RelationsService],
})
export class RelationsModule {}
