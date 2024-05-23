import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SecondAuthModeUserDto {
  @IsNotEmpty()
  @IsNumber()
  public USER_ID!: number;

  @IsNotEmpty()
  @IsString()
  public PASSWORD!: string;
}
