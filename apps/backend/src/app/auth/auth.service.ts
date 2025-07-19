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
  // Inject JwtService to generate tokens
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService
  ) {}

  // Register a new user
  async signUp(signUpDto: SignUpDto) {
    const { fullName, email, password } = signUpDto;

    if (password.length < 6) {
      throw new BadRequestException(
        'Password must be at least 6 characters long.'
      );
    }

    const lowerCaseEmail = email.toLowerCase();

    // Check if email already exists
    const existingUser = await this.userModel.findOne({
      email: lowerCaseEmail,
    });
    if (existingUser) {
      throw new BadRequestException('User with this email already exists.');
    }

    // Create a new user
    const user = new this.userModel({
      fullName,
      email: lowerCaseEmail,
      password,
    });
    await user.save();

    return this.createJwtToken(user);
  }

  // Sign in an existing user
  async signIn(signInDto: SignInDto): Promise<AuthResponse> {
    const { email, password } = signInDto;
    const lowerCaseEmail = email.toLowerCase();
    const user = await this.userModel.findOne({ email: lowerCaseEmail });

    // Check if user exists
    if (!user) {
      throw new UnauthorizedException('Email is not registered.');
    }

    // Check if the user has exceeded login attempts
    if (user.loginAttempts >= 3) {
      throw new UnauthorizedException(
        'Your account has been locked due to multiple failed login attempts.'
      );
    }

    // Compare the provided password with the stored hashed password
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

  // Create JWT payload and return access token
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

  // Find user by email
  async findByEmail(email: string) {
    return this.userModel.findOne({ email: email.toLowerCase() });
  }

  // Find user by id
  async findById(userId: string) {
    return this.userModel.findById(userId);
  }
}
