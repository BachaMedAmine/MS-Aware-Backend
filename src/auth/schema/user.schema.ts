import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true, // Automatically adds createdAt and updatedAt fields
})
export class User extends Document {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: false })
  password?: string; // Optional for Google users (no password needed)

  @Prop({ required: false })
  gender: string;

  @Prop({ required: false })
  birthday: Date;

  @Prop({ required: false })
  phone: number;

  @Prop({ required: false, default: false })
  profileCompleted: boolean;

  @Prop({ required: false })
  careGiverEmail: string;

  @Prop({ required: false })
  careGiverName: string;

  @Prop({ required: false })
  careGiverPhone: number;

  @Prop({ required: false })
  diagnosis: string;

  @Prop({ required: false })
  type: string;

  @Prop({ required: false })
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
