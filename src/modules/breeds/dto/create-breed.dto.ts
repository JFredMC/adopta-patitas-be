import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateBreedDto {
  @IsNotEmpty()
  @IsNumber()
  public petTypeId!: number;

  @IsNotEmpty()
  @IsString()
  public name!: string;

  @IsNotEmpty()
  @IsString()
  public description!: string;
}
