import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RelationsService } from './relations.service';
import { RelationsUpdate } from './relations.update';
import { Relation, RelationSchema } from './schemas/relations.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Relation.name, schema: RelationSchema },
    ]),
  ],
  providers: [RelationsUpdate, RelationsService],
  exports: [RelationsService],
})
export class RelationsModule {}
