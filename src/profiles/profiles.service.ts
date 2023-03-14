import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Profile, ProfileDocument } from './schemas/profiles.schema';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectModel(Profile.name) private profilesModel: Model<ProfileDocument>,
  ) {}

  async findByChatId(chat_id: number): Promise<Profile> {
    const profile = await this.profilesModel.findOne({ chat_id });

    return profile;
  }
}
