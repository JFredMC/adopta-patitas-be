import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAboutUsDto {
  @IsNotEmpty()
  @IsString()
  public aboutUs!: string;

  @IsNotEmpty()
  @IsString()
  public ourMission!: string;

  @IsNotEmpty()
  @IsString()
  public ourVision!: string;

  @IsNotEmpty()
  @IsString()
  public email!: string;

  @IsNotEmpty()
  @IsString()
  public phone!: string;
}
