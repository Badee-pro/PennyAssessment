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


// UsersService is responsible for user-related operations such as finding users by email or ID, creating users, and managing login attempts
@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // Finds a user by their email address
  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  // Finds a user by their ID
  async findById(userId: string): Promise<UserDocument> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  // Finds a user by their ID and returns only the email and full name
  async createUser(signUpDto: SignUpDto): Promise<UserDocument> {
    const { fullName, email, password } = signUpDto;

    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user document
    const newUser = new this.userModel({
      fullName,
      email,
      password: hashedPassword,
    });

    return newUser.save();
  }

  // Increments the login attempts for a user by their email
  async incrementLoginAttempts(email: string): Promise<void> {
    await this.userModel
      .updateOne({ email }, { $inc: { loginAttempts: 1 } })
      .exec();
  }

  // Resets the login attempts for a user by their email
  async resetLoginAttempts(email: string): Promise<void> {
    await this.userModel
      .updateOne({ email }, { $set: { loginAttempts: 0 } })
      .exec();
  }

  // Compares the provided password with the stored hashed password
  async comparePasswords(
    storedPassword: string,
    providedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(providedPassword, storedPassword);
  }
}
