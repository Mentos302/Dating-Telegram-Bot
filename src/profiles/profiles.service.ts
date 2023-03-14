import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Profile, ProfileDocument } from './schemas/profiles.schema';
const fetch = require('node-fetch');

@Injectable()
export class ProfilesService {
  constructor(
    @InjectModel(Profile.name) private profilesModel: Model<ProfileDocument>,
  ) {}

  async create(createProfileDto): Promise<Profile> {
    const profile = await this.profilesModel.create(createProfileDto);

    return profile;
  }

  async findByChatId(chat_id: number): Promise<Profile> {
    const profile = await this.profilesModel.findOne({ chat_id });

    return profile;
  }

  async findProfileLocation(city: string) {
    let geoCodeUrl = `http://api.positionstack.com/v1/forward?access_key=${process.env.GEOCODE_API_KEY}&query=${city}`;

    let response = (await (await fetch(encodeURI(geoCodeUrl))).json()) as {
      data: { latitude; longitude }[];
    };

    if (response.data && !response.data[0]) return;

    return {
      type: 'Point',
      coordinates: [response.data[0].latitude, response.data[0].longitude],
    };
  }
}
