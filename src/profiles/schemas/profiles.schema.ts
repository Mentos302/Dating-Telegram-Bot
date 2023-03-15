import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProfileDocument = HydratedDocument<Profile>;

@Schema({ versionKey: false })
export class Profile {
  @Prop({ type: Number, required: true, unique: true })
  chat_id: number;

  @Prop({ type: String, required: true })
  name: string;

  @Prop(String)
  description: string;

  @Prop({ type: Number, required: true })
  gender: number;

  @Prop({ type: Number, required: true })
  interest: number;

  @Prop({ type: Number, required: true })
  candidateAge: number;

  @Prop({ type: Number, required: true })
  age: number;

  @Prop({ type: String, required: true })
  city: string;

  @Prop({ type: Object, required: true })
  location: {
    type: string;
    coordinates: number[];
  };

  @Prop({ type: Object, required: true })
  avatar: {
    is_video?: boolean;
    file_id: string;
  };

  @Prop({ type: Number, default: 0 })
  likes: number;

  @Prop({ type: Boolean, default: true })
  is_active: boolean;

  @Prop({ type: Number, default: 0 })
  strikes: number;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile).index({
  location: '2dsphere',
});
