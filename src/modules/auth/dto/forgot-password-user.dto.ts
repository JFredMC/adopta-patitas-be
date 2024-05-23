import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class ForgotPasswordUserDto {
  @IsNotEmpty()
  @IsString()
  public username!: string;

  @IsNotEmpty()
  @IsBoolean()
  public isMobile!: boolean;
}
