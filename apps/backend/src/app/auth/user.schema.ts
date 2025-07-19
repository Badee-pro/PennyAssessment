import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';

// Define the User schema for MongoDB
export interface UserDocument extends Document {
  fullName: string;
  email: string;
  password: string;
  loginAttempts: number;

  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Create the User schema using Mongoose
@Schema()
export class User {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: 0 })
  loginAttempts: number;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Hash the password before saving the user document
UserSchema.pre<UserDocument>('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    return next(error);
  }
});

// Method to compare the candidate password with the hashed password
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};
