import { IsDecimal, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateDonateDto {
  @IsNotEmpty()
  @IsNumber()
  public userId!: number;

  @IsNotEmpty()
  @IsString()
  public donateDate!: Date;

  @IsNotEmpty()
  @IsDecimal()
  public amount!: number;
}
