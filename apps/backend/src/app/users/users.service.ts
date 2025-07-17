import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../auth/user.schema';
import { SignUpDto } from '../auth/dto/sign-up.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(userId: string): Promise<UserDocument> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async createUser(signUpDto: SignUpDto): Promise<UserDocument> {
    const { fullName, email, password } = signUpDto;

    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new this.userModel({
      fullName,
      email,
      password: hashedPassword,
    });

    return newUser.save();
  }

  async incrementLoginAttempts(email: string): Promise<void> {
    await this.userModel
      .updateOne({ email }, { $inc: { loginAttempts: 1 } })
      .exec();
  }

  async resetLoginAttempts(email: string): Promise<void> {
    await this.userModel
      .updateOne({ email }, { $set: { loginAttempts: 0 } })
      .exec();
  }

  async comparePasswords(
    storedPassword: string,
    providedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(providedPassword, storedPassword);
  }
}
