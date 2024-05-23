import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateDonateDto } from './dto/create-donate.dto';
import { UpdateDonateDto } from './dto/update-donate.dto';
import { Donate } from './entities/donate.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class DonateService {
  public constructor(
    @InjectRepository(Donate)
    private readonly donateRepository: Repository<Donate>,
  ) {}

  public async create(createDonateDto: CreateDonateDto): Promise<Donate> {
    try {
      const donate: Donate = this.donateRepository.create(createDonateDto);
      return this.donateRepository.save(donate);
    } catch (error) {
      throw new BadRequestException('Error al crear la Donación', {
        cause: new Error(),
        description: `Ocurrió un error en el servidor: ${error}}`,
      });
    }
  }

  public async findAll(): Promise<Donate[]> {
    return this.donateRepository.find();
  }

  public async findOne(id: number): Promise<Donate | null> {
    return this.donateRepository.findOneBy({ id });
  }

  public async update(
    id: number,
    updateDonateDto: UpdateDonateDto,
  ): Promise<Donate> {
    const donate: Donate = await this.findOne(id);
    if (!donate) {
      throw new NotFoundException('Error al actualizar la Donación', {
        cause: new Error(),
        description: 'Donación no encontrada por id',
      });
    }
    try {
      return this.donateRepository.save(Object.assign(donate, updateDonateDto));
    } catch (error) {
      throw new BadRequestException('Error al actualizar la Donación', {
        cause: new Error(),
        description: `Ocurrió un error en el servidor: ${error}}`,
      });
    }
  }

  public async remove(id: number): Promise<Donate> {
    const donate: Donate = await this.findOne(id);
    if (!donate) {
      throw new NotFoundException('Error al eliminar la Donación', {
        cause: new Error(),
        description: 'Donación no encontrada por id',
      });
    }
    try {
      return this.donateRepository.softRemove(donate);
    } catch (error) {
      throw new BadRequestException('Error al eliminar la Donación', {
        cause: new Error(),
        description: `Ocurrió un error en el servidor: ${error}}`,
      });
    }
  }
}
