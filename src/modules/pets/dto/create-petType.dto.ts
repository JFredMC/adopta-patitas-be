import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePetTypeDto {
  @IsNotEmpty()
  @IsString()
  public name!: string;

  @IsNotEmpty()
  @IsString()
  public description!: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  public photoFile!: string;
}
