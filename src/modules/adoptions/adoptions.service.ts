import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAdoptionDto } from './dto/create-adoption.dto';
import { UpdateAdoptionDto } from './dto/update-adoption.dto';
import { Adoption } from './entities/adoption.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AdoptionsService {
  public constructor(
    @InjectRepository(Adoption)
    private readonly adoptionRepository: Repository<Adoption>,
  ) {}

  public async create(createAdoptionDto: CreateAdoptionDto): Promise<Adoption> {
    try {
      const adoption: Adoption =
        this.adoptionRepository.create(createAdoptionDto);
      return this.adoptionRepository.save(adoption);
    } catch (error) {
      throw new BadRequestException('Error al crear la Adopción', {
        cause: new Error(),
        description: `Ocurrió un error en el servidor: ${error}}`,
      });
    }
  }

  public async findAll(): Promise<Adoption[]> {
    return this.adoptionRepository.find();
  }

  public async findOne(id: number): Promise<Adoption | null> {
    return this.adoptionRepository.findOneBy({ id });
  }

  public async update(
    id: number,
    updateAdoptionDto: UpdateAdoptionDto,
  ): Promise<Adoption> {
    const adoption: Adoption = await this.findOne(id);
    if (!adoption) {
      throw new NotFoundException('Error al actualizar la Adopción', {
        cause: new Error(),
        description: 'Adopción no encontrada por id',
      });
    }
    try {
      return this.adoptionRepository.save(
        Object.assign(adoption, updateAdoptionDto),
      );
    } catch (error) {
      throw new BadRequestException('Error al actualizar la Adopción', {
        cause: new Error(),
        description: `Ocurrió un error en el servidor: ${error}}`,
      });
    }
  }

  public async remove(id: number): Promise<Adoption> {
    const adoption: Adoption = await this.findOne(id);
    if (!adoption) {
      throw new NotFoundException('Error al eliminar la Adopción', {
        cause: new Error(),
        description: 'Adopción no encontrada por id',
      });
    }
    try {
      return this.adoptionRepository.softRemove(adoption);
    } catch (error) {
      throw new BadRequestException('Error al eliminar la Adopción', {
        cause: new Error(),
        description: `Ocurrió un error en el servidor: ${error}}`,
      });
    }
  }
}
