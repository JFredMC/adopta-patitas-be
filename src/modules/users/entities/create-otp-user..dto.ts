import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateOtpUserDto {
  @IsNotEmpty()
  @IsEmail()
  public email!: string;
}
