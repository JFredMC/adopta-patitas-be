import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsNumber()
  public roleId!: number;

  public name!: string;

  @IsNotEmpty()
  @IsString()
  public firstName!: string;

  @IsNotEmpty()
  @IsString()
  public lastName!: string;

  @IsNotEmpty()
  @IsString()
  public identification!: string;

  @IsNotEmpty()
  @IsString()
  public phone!: string;

  @IsNotEmpty()
  @IsString()
  public email!: string;

  @IsNotEmpty()
  @IsString()
  public dateOfBirth!: string;

  @IsNotEmpty()
  @IsString()
  public username!: string;

  @IsNotEmpty()
  @IsString()
  public password!: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  public profilePictureFile!: string;
}
