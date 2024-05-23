import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateAdoptionDto {
  @IsNotEmpty()
  @IsNumber()
  public userId!: number;

  @IsNotEmpty()
  @IsNumber()
  public petTypeId!: number;

  @IsNotEmpty()
  @IsString()
  public adoptionDate!: Date;
}
