import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProfileDocument = HydratedDocument<Profile>;

@Schema()
export class Profile {
  @Prop({ type: Number, required: true, unique: true })
  chat_id: number;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
