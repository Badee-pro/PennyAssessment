import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { User, UserDocument } from './user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

interface AuthResponse {
  accessToken: string;
  user: {
    fullName: string;
    email: string;
  };
}

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const { fullName, email, password } = signUpDto;

    if (password.length < 6) {
      throw new BadRequestException(
        'Password must be at least 6 characters long.'
      );
    }

    const lowerCaseEmail = email.toLowerCase();

    const existingUser = await this.userModel.findOne({
      email: lowerCaseEmail,
    });
    if (existingUser) {
      throw new BadRequestException('User with this email already exists.');
    }

    const user = new this.userModel({
      fullName,
      email: lowerCaseEmail,
      password,
    });
    await user.save();

    return this.createJwtToken(user);
  }

  async signIn(signInDto: SignInDto): Promise<AuthResponse> {
    const { email, password } = signInDto;
    const lowerCaseEmail = email.toLowerCase();
    const user = await this.userModel.findOne({ email: lowerCaseEmail });

    if (!user) {
      throw new UnauthorizedException('Email is not registered.');
    }

    if (user.loginAttempts >= 3) {
      throw new UnauthorizedException(
        'Your account has been locked due to multiple failed login attempts.'
      );
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      user.loginAttempts += 1;
      await user.save();
      throw new UnauthorizedException('Wrong password.');
    }

    user.loginAttempts = 0;
    await user.save();

    return this.createJwtToken(user);
  }

  createJwtToken(user: UserDocument): AuthResponse {
    const payload = { email: user.email, sub: user._id };
    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        fullName: user.fullName,
        email: user.email,
      },
    };
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email: email.toLowerCase() });
  }

  async findById(userId: string) {
    return this.userModel.findById(userId);
  }
}
