import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateContactUsDto } from './dto/create-contact_us.dto';
import { UpdateContactUsDto } from './dto/update-contact_us.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ContactUs } from './entities/contact_us.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ContactUsService {
  public constructor(
    @InjectRepository(ContactUs)
    private readonly contactRepository: Repository<ContactUs>,
  ) {}

  public async create(createContactUsDto: CreateContactUsDto) {
    try {
      const contactUs: ContactUs =
        this.contactRepository.create(createContactUsDto);
      return this.contactRepository.save(contactUs);
    } catch (error) {
      throw new BadRequestException('Error al crear el Contáctanos', {
        cause: new Error(),
        description: `Ocurrió un error en el servidor: ${error}}`,
      });
    }
  }

  public async findAll(): Promise<ContactUs[]> {
    return this.contactRepository.find();
  }

  public async findOne(id: number): Promise<ContactUs | null> {
    return this.contactRepository.findOneBy({ id });
  }

  public async update(
    id: number,
    updateContactUsDto: UpdateContactUsDto,
  ): Promise<ContactUs> {
    const contactUs: ContactUs = await this.findOne(id);
    if (!contactUs) {
      throw new NotFoundException('Error al actualizar el Contáctanos', {
        cause: new Error(),
        description: 'Contáctanos no encontrado por id',
      });
    }
    try {
      return this.contactRepository.save(
        Object.assign(contactUs, updateContactUsDto),
      );
    } catch (error) {
      throw new BadRequestException('Error al actualizar el Contáctanos', {
        cause: new Error(),
        description: `Ocurrió un error en el servidor: ${error}}`,
      });
    }
  }

  public async remove(id: number): Promise<ContactUs> {
    const contactUs: ContactUs = await this.findOne(id);
    if (!contactUs) {
      throw new NotFoundException('Error al eliminar el Contáctanos', {
        cause: new Error(),
        description: 'Contáctanos no encontrado por id',
      });
    }
    try {
      return this.contactRepository.softRemove(contactUs);
    } catch (error) {
      throw new BadRequestException('Error al eliminar el Contáctanos', {
        cause: new Error(),
        description: `Ocurrió un error en el servidor: ${error}}`,
      });
    }
  }
}
