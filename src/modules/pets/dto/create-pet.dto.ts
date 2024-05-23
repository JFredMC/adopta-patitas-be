import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePetDto {
  @IsNotEmpty()
  @IsNumber()
  public petTypeId!: number;

  @IsNotEmpty()
  @IsString()
  public breed!: string;

  @IsNotEmpty()
  @IsString()
  public sex!: string;

  @IsNotEmpty()
  @IsNumber()
  public age!: number;

  @IsNotEmpty()
  @IsString()
  public description!: string;

  @IsNotEmpty()
  @IsString()
  public healthDetails!: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  public photoFile!: string;
}
