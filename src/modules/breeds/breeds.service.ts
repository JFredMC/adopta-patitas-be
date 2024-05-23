import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBreedDto } from './dto/create-breed.dto';
import { UpdateBreedDto } from './dto/update-breed.dto';
import { Breed } from './entities/breed.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BreedsService {
  public constructor(
    @InjectRepository(Breed)
    private readonly breedRepository: Repository<Breed>,
  ) {}

  public async create(createBreedDto: CreateBreedDto): Promise<Breed> {
    try {
      const breed: Breed = this.breedRepository.create(createBreedDto);
      return this.breedRepository.save(breed);
    } catch (error) {
      throw new BadRequestException('Error al crear la Raza', {
        cause: new Error(),
        description: `Ocurrió un error en el servidor: ${error}}`,
      });
    }
  }

  public async findAll(): Promise<Breed[]> {
    return this.breedRepository.find();
  }

  public async findByType(typeId: number): Promise<Breed[]> {
    return this.breedRepository.find({
      relations: {
        petType: true,
      },
      where: {
        petType: {
          id: typeId,
        },
      },
    });
  }

  public async findOne(id: number): Promise<Breed | null> {
    return this.breedRepository.findOneBy({ id });
  }

  public async update(
    id: number,
    updateBreedDto: UpdateBreedDto,
  ): Promise<Breed> {
    const breed: Breed = await this.findOne(id);
    if (!breed) {
      throw new NotFoundException('Error al actualizar la Raza', {
        cause: new Error(),
        description: 'Raza no encontrada por id',
      });
    }
    try {
      return this.breedRepository.save(Object.assign(breed, updateBreedDto));
    } catch (error) {
      throw new BadRequestException('Error al actualizar la Raza', {
        cause: new Error(),
        description: `Ocurrió un error en el servidor: ${error}}`,
      });
    }
  }

  public async remove(id: number): Promise<Breed> {
    const breed: Breed = await this.findOne(id);
    if (!breed) {
      throw new NotFoundException('Error al eliminar la Raza', {
        cause: new Error(),
        description: 'Raza no encontrada por id',
      });
    }
    try {
      return this.breedRepository.softRemove(breed);
    } catch (error) {
      throw new BadRequestException('Error al eliminar la Raza', {
        cause: new Error(),
        description: `Ocurrió un error en el servidor: ${error}}`,
      });
    }
  }
}
