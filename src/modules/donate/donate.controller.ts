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
import { DonateService } from './donate.service';
import { CreateDonateDto } from './dto/create-donate.dto';
import { UpdateDonateDto } from './dto/update-donate.dto';
import { Donate } from './entities/donate.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('donate')
@UseGuards(JwtAuthGuard)
@ApiTags('Donaciones')
@ApiBearerAuth()
export class DonateController {
  public constructor(private readonly donateService: DonateService) {}

  @Post()
  public async create(
    @Body() createDonateDto: CreateDonateDto,
  ): Promise<Donate> {
    return this.donateService.create(createDonateDto);
  }

  @Get()
  public async findAll(): Promise<Donate[]> {
    return this.donateService.findAll();
  }

  @Get(':id')
  public async findOne(@Param('id') id: string): Promise<Donate | null> {
    return this.donateService.findOne(+id);
  }

  @Patch(':id')
  public async update(
    @Param('id') id: string,
    @Body() updateDonateDto: UpdateDonateDto,
  ): Promise<Donate> {
    return this.donateService.update(+id, updateDonateDto);
  }

  @Delete(':id')
  public async remove(@Param('id') id: string): Promise<Donate> {
    return this.donateService.remove(+id);
  }
}
