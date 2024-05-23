import { IsNotEmpty, IsString } from 'class-validator';
import { CreateOtpUserDto } from './create-otp-user..dto';

export class ValidateOtpUserDto extends CreateOtpUserDto {
  @IsNotEmpty()
  @IsString()
  public otp!: string;
}
