import { Module } from '@nestjs/common';
import { ContactUsService } from './contact_us.service';
import { ContactUsController } from './contact_us.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaslModule } from 'src/casl/casl.module';
import { ContactUs } from './entities/contact_us.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ContactUs]), CaslModule],
  controllers: [ContactUsController],
  providers: [ContactUsService],
})
export class ContactUsModule {}
