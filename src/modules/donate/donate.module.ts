import { Module } from '@nestjs/common';
import { DonateService } from './donate.service';
import { DonateController } from './donate.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Donate } from './entities/donate.entity';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  imports: [TypeOrmModule.forFeature([Donate]), CaslModule],
  controllers: [DonateController],
  providers: [DonateService],
})
export class DonateModule {}
