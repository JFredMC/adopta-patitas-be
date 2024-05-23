import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ContactUsService } from './contact_us.service';
import { CreateContactUsDto } from './dto/create-contact_us.dto';
import { UpdateContactUsDto } from './dto/update-contact_us.dto';
import { ContactUs } from './entities/contact_us.entity';
import { ApiTags } from '@nestjs/swagger';

@Controller('contact_us')
@ApiTags('Contáctanos')
export class ContactUsController {
  public constructor(private readonly contactUsService: ContactUsService) {}

  @Post()
  public async create(
    @Body() createContactUsDto: CreateContactUsDto,
  ): Promise<ContactUs> {
    return this.contactUsService.create(createContactUsDto);
  }

  @Get()
  public async findAll(): Promise<ContactUs[]> {
    return this.contactUsService.findAll();
  }

  @Get(':id')
  public async findOne(@Param('id') id: string): Promise<ContactUs | null> {
    return this.contactUsService.findOne(+id);
  }

  @Patch(':id')
  public async update(
    @Param('id') id: string,
    @Body() updateContactUsDto: UpdateContactUsDto,
  ): Promise<ContactUs> {
    return this.contactUsService.update(+id, updateContactUsDto);
  }

  @Delete(':id')
  public async remove(@Param('id') id: string): Promise<ContactUs> {
    return this.contactUsService.remove(+id);
  }
}
