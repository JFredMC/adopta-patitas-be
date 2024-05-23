import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
import { ApiTags } from '@nestjs/swagger';

@Controller('role')
@ApiTags('Roles')
export class RolesController {
  public constructor(private readonly rolesService: RolesService) {}

  @Post()
  public async create(@Body() createRoleDto: CreateRoleDto): Promise<Role> {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  public async findAll(): Promise<Role[]> {
    return this.rolesService.findAll();
  }

  @Get(':id')
  public async findOne(@Param('id') id: string): Promise<Role> {
    return this.rolesService.findOne(+id);
  }

  @Patch(':id')
  public async update(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<Role> {
    return this.rolesService.update(+id, updateRoleDto);
  }

  @Delete(':id')
  public async remove(@Param('id') id: string): Promise<Role> {
    return this.rolesService.remove(+id);
  }
}
