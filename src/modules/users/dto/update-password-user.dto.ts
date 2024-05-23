import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdatePasswordUserDto {
  @IsNotEmpty()
  @IsString()
  public CURRENT_PASSWORD!: string;

  @IsNotEmpty()
  @IsString()
  public NEW_PASSWORD!: string;

  @IsOptional()
  public PASSWORD!: string;
}
