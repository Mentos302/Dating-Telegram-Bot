import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Relation, RelationDocument } from './schemas/relations.schema';

@Injectable()
export class RelationsService {
  constructor(
    @InjectModel(Relation.name) private relationsModel: Model<RelationDocument>,
  ) {}

  async create(host_id: number, cli_id: number, host_like: boolean = false) {
    const relation = await this.relationsModel.create({
      host_id,
      cli_id,
      host_like,
    });

    return relation;
  }

  async updateLikely(host_id: number, cli_id: number) {
    const relation = await this.relationsModel.findOneAndUpdate(
      { host_id, cli_id },
      { cli_checked: true },
    );

    return relation;
  }

  async findByChatId(chat_id: number): Promise<number[]> {
    const viewed = new Set<number>();

    const relations = await this.relationsModel.find({
      $or: [
        { host_id: chat_id },
        { cli_id: chat_id, host_like: false },
        { cli_id: chat_id, cli_checked: true },
        { cli_id: chat_id, host_like: true, cli_checked: false },
      ],
    });

    relations.map((rel) => {
      viewed.add(rel.host_id);
      viewed.add(rel.cli_id);
    });

    return Array.from(viewed);
  }

  async findLikes(chat_id: number): Promise<number[]> {
    const relations = await this.relationsModel.find({
      cli_id: chat_id,
      host_like: true,
      cli_checked: false,
    });

    return relations.map((rel) => rel.host_id);
  }

  async delete(chat_id: number, selfActivity: boolean = false) {
    await this.relationsModel.deleteMany(
      selfActivity
        ? { cli_id: chat_id }
        : { $or: [{ host_id: chat_id }, { cli_id: chat_id }] },
    );
  }
}
