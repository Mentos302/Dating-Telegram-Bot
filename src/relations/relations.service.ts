import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Relation, RelationDocument } from './schemas/relations.schema';

@Injectable()
export class RelationsService {
  constructor(
    @InjectModel(Relation.name) private relationsModel: Model<RelationDocument>,
  ) {}

  async findByChatId(chat_id: number): Promise<Relation[]> {
    const relations = await this.relationsModel.find({
      $or: [
        { host_id: chat_id },
        { cli_id: chat_id, host_like: false },
        { cli_id: chat_id, cli_checked: true },
        { cli_id: chat_id, host_like: true, cli_checked: false },
      ],
    });

    return relations;
  }

  async findLikes(chat_id: number): Promise<number[]> {
    const relations = await this.relationsModel.find({
      cli_id: chat_id,
      host_like: true,
      cli_checked: false,
    });

    return relations.map((rel) => rel.host_id);
  }
}
