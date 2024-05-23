import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { Exclude } from 'class-transformer';
export class ResetPasswordUserDto {
  @IsNotEmpty()
  @IsNumber()
  public userId!: number;

  @IsNotEmpty()
  @IsString()
  public otp!: string;

  @IsNotEmpty()
  @IsStrongPassword()
  public newPassword!: string;

  @Exclude()
  public email!: string;
}
