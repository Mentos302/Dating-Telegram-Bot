import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RelationDocument = HydratedDocument<Relation>;

@Schema()
export class Relation {
  @Prop({ type: Number, required: true })
  host_id: number;

  @Prop({ type: Number, required: true })
  cli_id: number;

  @Prop({ type: Boolean, default: true })
  host_like: boolean;

  @Prop({ type: Boolean, default: false })
  cli_checked: boolean;

  @Prop(String)
  msg_text: string;
}

export const RelationSchema = SchemaFactory.createForClass(Relation);
