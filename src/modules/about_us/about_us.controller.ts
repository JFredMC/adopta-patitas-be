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
import { AboutUsService } from './about_us.service';
import { CreateAboutUsDto } from './dto/create-about_us.dto';
import { UpdateAboutUsDto } from './dto/update-about_us.dto';
import { AboutUs } from './entities/about_us.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('about_us')
@UseGuards(JwtAuthGuard)
@ApiTags('Sobre Nosotros')
@ApiBearerAuth()
export class AboutUsController {
  public constructor(private readonly aboutUsService: AboutUsService) {}

  @Post()
  public async create(
    @Body() createAboutUsDto: CreateAboutUsDto,
  ): Promise<AboutUs> {
    return this.aboutUsService.create(createAboutUsDto);
  }

  @Get()
  public async findAll(): Promise<AboutUs[]> {
    return this.aboutUsService.findAll();
  }

  @Get(':id')
  public async findOne(@Param('id') id: string): Promise<AboutUs | null> {
    return this.aboutUsService.findOne(+id);
  }

  @Patch(':id')
  public async update(
    @Param('id') id: string,
    @Body() updateAboutUsDto: UpdateAboutUsDto,
  ): Promise<AboutUs> {
    return this.aboutUsService.update(+id, updateAboutUsDto);
  }

  @Delete(':id')
  public async remove(@Param('id') id: string): Promise<AboutUs> {
    return this.aboutUsService.remove(+id);
  }
}
