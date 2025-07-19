import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

// This DTO is used for user sign-up
export class SignUpDto {
  @IsNotEmpty({ message: 'Full name is required' })
  fullName: string;

  // This field is required and must be a valid email address
  @IsEmail({}, { message: 'Please enter a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  // This field is required and must not be empty, with a minimum length of 6 characters
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}
