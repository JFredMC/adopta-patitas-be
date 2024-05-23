import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RolesService {
  public constructor(
    @InjectRepository(Role)
    public roleRepository: Repository<Role>,
  ) {}
  public async create(createRoleDto: CreateRoleDto): Promise<Role> {
    try {
      const role: Role = this.roleRepository.create(createRoleDto);
      return this.roleRepository.save(role);
    } catch (error) {
      throw new BadRequestException('Error al crear el Rol', {
        cause: new Error(),
        description: `Ocurrió un error en el servidor: ${error}}`,
      });
    }
  }

  public async findAll(): Promise<Role[]> {
    return this.roleRepository.find();
  }

  public async findOne(id: number): Promise<Role | null> {
    return this.roleRepository.findOneBy({ id });
  }

  public async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role: Role = await this.findOne(id);
    if (!role) {
      throw new NotFoundException('Error al actualizar el Rol', {
        cause: new Error(),
        description: 'Rol no encontrado por id',
      });
    }

    try {
      return this.roleRepository.save(Object.assign(role, updateRoleDto));
    } catch (error) {
      throw new BadRequestException('Error al actualizar el Rol', {
        cause: new Error(),
        description: `Ocurrió un error en el servidor: ${error}}`,
      });
    }
  }

  public async remove(id: number): Promise<Role> {
    const role: Role = await this.findOne(id);
    if (!role) {
      throw new NotFoundException('Error al eliminar el Rol', {
        cause: new Error(),
        description: 'Rol no encontrado por id',
      });
    }

    try {
      return this.roleRepository.softRemove(role);
    } catch (error) {
      throw new BadRequestException('Error al eliminar el Rol', {
        cause: new Error(),
        description: `Ocurrió un error en el servidor: ${error}}`,
      });
    }
  }
}
