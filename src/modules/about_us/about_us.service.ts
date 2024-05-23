import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAboutUsDto } from './dto/create-about_us.dto';
import { UpdateAboutUsDto } from './dto/update-about_us.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AboutUs } from './entities/about_us.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AboutUsService {
  public constructor(
    @InjectRepository(AboutUs)
    private readonly aboutRepository: Repository<AboutUs>,
  ) {}

  public async create(createAboutUsDto: CreateAboutUsDto) {
    try {
      const aboutUs: AboutUs = this.aboutRepository.create(createAboutUsDto);
      return this.aboutRepository.save(aboutUs);
    } catch (error) {
      throw new BadRequestException('Error al crear el Quienes Somos', {
        cause: new Error(),
        description: `Ocurrió un error en el servidor: ${error}}`,
      });
    }
  }

  public async findAll(): Promise<AboutUs[]> {
    return this.aboutRepository.find();
  }

  public async findOne(id: number): Promise<AboutUs | null> {
    return this.aboutRepository.findOneBy({ id });
  }

  public async update(
    id: number,
    updateAboutUsDto: UpdateAboutUsDto,
  ): Promise<AboutUs> {
    const aboutUs: AboutUs = await this.findOne(id);
    if (!aboutUs) {
      throw new NotFoundException('Error al actualizar el Quienes Somos', {
        cause: new Error(),
        description: 'Quienes Somos no encontrado por id',
      });
    }
    try {
      return this.aboutRepository.save(
        Object.assign(aboutUs, updateAboutUsDto),
      );
    } catch (error) {
      throw new BadRequestException('Error al actualizar el Quienes Somos', {
        cause: new Error(),
        description: `Ocurrió un error en el servidor: ${error}}`,
      });
    }
  }

  public async remove(id: number): Promise<AboutUs> {
    const aboutUs: AboutUs = await this.findOne(id);
    if (!aboutUs) {
      throw new NotFoundException('Error al eliminar el Quienes Somos', {
        cause: new Error(),
        description: 'Quienes Somos no encontrado por id',
      });
    }
    try {
      return this.aboutRepository.softRemove(aboutUs);
    } catch (error) {
      throw new BadRequestException('Error al eliminar el Quienes Somos', {
        cause: new Error(),
        description: `Ocurrió un error en el servidor: ${error}}`,
      });
    }
  }
}
