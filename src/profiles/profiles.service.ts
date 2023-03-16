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

  async update(chat_id: number, updateProfileDto): Promise<Profile> {
    const profile = await this.profilesModel.findOneAndUpdate(
      { chat_id },
      updateProfileDto,
    );

    return profile;
  }

  async addNewLike(chat_id: number): Promise<number> {
    const profile = await this.profilesModel.findOneAndUpdate(
      { chat_id },
      { $inc: { likes: 1 } },
      { new: true, useFindAndModify: false },
    );

    return profile ? profile.likes : 0;
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

  async findCandidates(profile: Profile, relations: number[]) {
    const limit = profile.age < 18 ? 3 : 5;

    const candidates = await this.profilesModel.find({
      age: {
        $gte: profile.candidateAge,
        $lte: profile.candidateAge + limit,
      },
      candidateAge: { $lte: profile.age },
      gender: profile.interest === 2 ? [0, 1] : profile.interest,
      interest: { $in: [2, profile.gender] },
      chat_id: { $nin: [...relations] },
      is_active: true,
      location: {
        $near: {
          $geometry: profile.location,
        },
      },
    });

    return candidates;
  }

  async delete(chat_id): Promise<Profile> {
    const profile = await this.profilesModel.findOneAndDelete({ chat_id });

    return profile;
  }
}
