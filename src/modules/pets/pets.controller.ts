import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { PetsService } from './pets.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { Pet } from './entities/pet.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { CreatePetTypeDto } from './dto/create-petType.dto';
import { PetType } from './entities/petType.entity';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('pet')
@UseGuards(JwtAuthGuard)
@ApiTags('Mascotas')
@ApiBearerAuth()
export class PetsController {
  public constructor(private readonly petsService: PetsService) {}

  @Post()
  @ApiConsumes('multipart/form-data', 'application/json')
  @UseInterceptors(FileInterceptor('photoFile'))
  public async create(
    @Body() createPetDto: CreatePetDto,
    @UploadedFile() photoFile?: Express.Multer.File,
  ): Promise<Pet> {
    return this.petsService.create(createPetDto, photoFile);
  }

  @Post('create_pet_type')
  @ApiConsumes('multipart/form-data', 'application/json')
  @UseInterceptors(FileInterceptor('photoFile'))
  public async createPetType(
    @Body() createPetTypeDto: CreatePetTypeDto,
    @UploadedFile() photoFile?: Express.Multer.File,
  ): Promise<PetType> {
    return this.petsService.createPetType(createPetTypeDto, photoFile);
  }

  @Get()
  public async findAll(): Promise<Pet[]> {
    return this.petsService.findAll();
  }

  @Get('find_all_pet_types')
  public async findAllPetTypes(): Promise<PetType[]> {
    return this.petsService.findAllPetTypes();
  }

  @Get(':id')
  public async findOne(@Param('id') id: string): Promise<Pet | null> {
    return this.petsService.findOne(+id);
  }

  @Patch(':id')
  public async update(
    @Param('id') id: string,
    @Body() updatePetDto: UpdatePetDto,
  ): Promise<Pet> {
    return this.petsService.update(+id, updatePetDto);
  }

  @Delete(':id')
  public async remove(@Param('id') id: string): Promise<Pet> {
    return this.petsService.remove(+id);
  }
}
