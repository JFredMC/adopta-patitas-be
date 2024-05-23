import { IsNotEmpty, IsString } from 'class-validator';

export class CreateContactUsDto {
  @IsNotEmpty()
  @IsString()
  public name!: string;

  @IsNotEmpty()
  @IsString()
  public email!: string;

  @IsNotEmpty()
  @IsString()
  public phone!: string;

  @IsNotEmpty()
  @IsString()
  public socialNetworks!: string;

  @IsNotEmpty()
  @IsString()
  public message!: string;
}
