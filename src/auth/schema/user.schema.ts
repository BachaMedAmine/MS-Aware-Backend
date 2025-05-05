import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, trim: true })
  fullName: string;

  @Prop({ required: true, unique: true, trim: true })
  email: string;

  @Prop({ required: false })
  password?: string;

  @Prop({ required: false, default: 'unknown' })
  gender: string;

  @Prop({ required: false, default: new Date('2000-01-01') })
  birthday: Date;

  @Prop({ required: false, default: 10000000 })
  phone: number;

  @Prop({ required: false, default: false })
  profileCompleted: boolean;

  @Prop({ required: false, default: '' })
  careGiverEmail: string;

  @Prop({ required: false, default: '' })
  careGiverName: string;

  @Prop({ required: false, default: 10000000 })
  careGiverPhone: number;

  @Prop({ required: false, default: '' })
  diagnosis: string;

  @Prop({ required: false, default: false })
  type: boolean;

  @Prop({ required: false, default: '' })
  medicalReport: string;

  @Prop({ required: false, unique: true, sparse: true })
  googleId?: string;

  @Prop({ required: false })
  accessToken?: string;

  @Prop({ required: false })
  refreshToken?: string;

  @Prop({ required: false })
  fcmToken?: string;

  @Prop({ required: false, unique: true, sparse: true })
  appleId?: string;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);