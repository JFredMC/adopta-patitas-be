import { Module } from '@nestjs/common';
import { AboutUsService } from './about_us.service';
import { AboutUsController } from './about_us.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AboutUs } from './entities/about_us.entity';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  imports: [TypeOrmModule.forFeature([AboutUs]), CaslModule],
  controllers: [AboutUsController],
  providers: [AboutUsService],
})
export class AboutUsModule {}
