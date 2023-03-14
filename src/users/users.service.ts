import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/users.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private usersModel: Model<UserDocument>,
  ) {}

  async findByChatId(chat_id: number): Promise<User> {
    const user = await this.usersModel.findOne({ chat_id });

    return user;
  }

  async create(chat_id: number): Promise<User> {
    const user = await this.usersModel.create({ chat_id });

    return user;
  }
}
