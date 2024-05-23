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
import { BreedsService } from './breeds.service';
import { CreateBreedDto } from './dto/create-breed.dto';
import { UpdateBreedDto } from './dto/update-breed.dto';
import { Breed } from './entities/breed.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('breed')
@UseGuards(JwtAuthGuard)
@ApiTags('Razas')
@ApiBearerAuth()
export class BreedsController {
  public constructor(private readonly breedsService: BreedsService) {}

  @Post()
  public async create(@Body() createBreedDto: CreateBreedDto): Promise<Breed> {
    return this.breedsService.create(createBreedDto);
  }

  @Get()
  public async findAll(): Promise<Breed[]> {
    return this.breedsService.findAll();
  }

  @Get('by_type/:typeId')
  public async findByType(@Param('typeId') typeId: string): Promise<Breed[]> {
    return this.breedsService.findByType(+typeId);
  }

  @Get(':id')
  public async findOne(@Param('id') id: string): Promise<Breed | null> {
    return this.breedsService.findOne(+id);
  }

  @Patch(':id')
  public async update(
    @Param('id') id: string,
    @Body() updateBreedDto: UpdateBreedDto,
  ): Promise<Breed> {
    return this.breedsService.update(+id, updateBreedDto);
  }

  @Delete(':id')
  public async remove(@Param('id') id: string): Promise<Breed> {
    return this.breedsService.remove(+id);
  }
}
