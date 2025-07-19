import { IsEmail, IsNotEmpty } from 'class-validator';

// This DTO is used for user sign-in
export class SignInDto {
  // This field is required and must be a valid email address
  @IsEmail({}, { message: 'Please enter a valid email address.' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  // This field is required and must not be empty
  @IsNotEmpty({ message: 'Password is required.' })
  password: string;
}
