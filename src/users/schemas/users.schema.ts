import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ versionKey: false })
export class User {
  @Prop({ type: Number, required: true, unique: true })
  chat_id: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
