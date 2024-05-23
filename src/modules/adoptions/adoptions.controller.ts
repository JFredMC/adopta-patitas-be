import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AdoptionsService } from './adoptions.service';
import { CreateAdoptionDto } from './dto/create-adoption.dto';
import { UpdateAdoptionDto } from './dto/update-adoption.dto';
import { Adoption } from './entities/adoption.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('adoption')
@UseGuards(JwtAuthGuard)
@ApiTags('Adopciones')
@ApiBearerAuth()
export class AdoptionsController {
  public constructor(private readonly adoptionsService: AdoptionsService) {}

  @Post()
  public async create(
    @Body() createAdoptionDto: CreateAdoptionDto,
  ): Promise<Adoption> {
    return this.adoptionsService.create(createAdoptionDto);
  }

  @Get()
  public async findAll(): Promise<Adoption[]> {
    return this.adoptionsService.findAll();
  }

  @Get(':id')
  public async findOne(@Param('id') id: string): Promise<Adoption | null> {
    return this.adoptionsService.findOne(+id);
  }

  @Patch(':id')
  public async update(
    @Param('id') id: string,
    @Body() updateAdoptionDto: UpdateAdoptionDto,
  ): Promise<Adoption> {
    return this.adoptionsService.update(+id, updateAdoptionDto);
  }

  @Delete(':id')
  public async remove(@Param('id') id: string): Promise<Adoption> {
    return this.adoptionsService.remove(+id);
  }
}
