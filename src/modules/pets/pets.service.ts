import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { Pet } from './entities/pet.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PetType } from './entities/petType.entity';
import { CreatePetTypeDto } from './dto/create-petType.dto';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class PetsService {
  public constructor(
    @InjectRepository(Pet)
    private readonly petRepository: Repository<Pet>,
    @InjectRepository(PetType)
    private readonly petTypeRepository: Repository<PetType>,
    private readonly filesService: FilesService,
    private readonly dataSource: DataSource,
  ) {}

  public async create(
    createPetDto: CreatePetDto,
    photoFile?: Express.Multer.File,
  ): Promise<Pet> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const pet: Pet = this.petRepository.create(createPetDto);
      await queryRunner.manager.save(pet);
      if (photoFile) {
        const fileFormat = photoFile.mimetype.split('/')[1];
        await this.filesService.upload(
          photoFile.buffer,
          pet.name,
          'pet_types',
          pet.id,
          fileFormat,
        );
        pet.photoFile = photoFile.originalname;
      }
      await queryRunner.commitTransaction();
      return this.petRepository.save(pet);
    } catch (error) {
      throw new BadRequestException('Error al crear la Mascota', {
        cause: new Error(),
        description: `Ocurrió un error en el servidor: ${error}}`,
      });
    }
  }

  public async createPetType(
    createPetTypeDto: CreatePetTypeDto,
    photoFile?: Express.Multer.File,
  ): Promise<PetType> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const petType: PetType = this.petTypeRepository.create(createPetTypeDto);
      await queryRunner.manager.save(petType);
      if (photoFile) {
        const fileFormat = photoFile.mimetype.split('/')[1];
        await this.filesService.upload(
          photoFile.buffer,
          petType.name,
          'pet_types',
          petType.id,
          fileFormat,
        );
        petType.photoFile = photoFile.originalname;
      }
      await queryRunner.commitTransaction();
      return this.petTypeRepository.save(petType);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException('Error al crear el Tipo de Mascota', {
        cause: new Error(),
        description: `Ocurrió un error en el servidor: ${error}}`,
      });
    }
  }

  public async findAll(): Promise<Pet[]> {
    const pets = await this.petRepository.find();
    for await (const pet of pets) {
      const fileFormat = pet.photoFile.split('.').pop();
      pet['photoFileUrl'] = await this.filesService.getPreSignedURL(
        'pet_types',
        `${pet.name}.${fileFormat}`,
        pet.id,
      );
    }
    return pets;
  }

  public async findAllPetTypes(): Promise<PetType[]> {
    const petTypes = await this.petTypeRepository.find();
    for await (const petType of petTypes) {
      const fileFormat = petType.photoFile.split('.').pop();
      petType['photoFileUrl'] = await this.filesService.getPreSignedURL(
        'pet_types',
        `${petType.name}.${fileFormat}`,
        petType.id,
      );
    }
    return petTypes;
  }

  public async findOne(id: number): Promise<Pet | null> {
    return this.petRepository.findOneBy({ id });
  }

  public async update(id: number, updatePetDto: UpdatePetDto): Promise<Pet> {
    const pet: Pet = await this.findOne(id);
    if (!pet) {
      throw new NotFoundException('Error al actualizar la Mascota', {
        cause: new Error(),
        description: 'Mascota no encontrada por id',
      });
    }
    try {
      return this.petRepository.save(Object.assign(pet, updatePetDto));
    } catch (error) {
      throw new BadRequestException('Error al actualizar la Mascota', {
        cause: new Error(),
        description: `Ocurrió un error en el servidor: ${error}}`,
      });
    }
  }

  public async remove(id: number): Promise<Pet> {
    const pet: Pet = await this.findOne(id);
    if (!pet) {
      throw new NotFoundException('Error al eliminar la Mascota', {
        cause: new Error(),
        description: 'Mascota no encontrado por id',
      });
    }
    try {
      return this.petRepository.softRemove(pet);
    } catch (error) {
      throw new BadRequestException('Error al eliminar la Mascota', {
        cause: new Error(),
        description: `Ocurrió un error en el servidor: ${error}}`,
      });
    }
  }

  // public async findImages(
  //   elements: Pet[] | PetType[],
  //   folder: string,
  // ): Promise<void> {
  //   for await (const pet of elements) {
  //     pet['photoFile'] = await this.filesService.getPreSignedURL(
  //       folder,
  //       pet.name,
  //       pet.id,
  //     );
  //   }
  // }
}
