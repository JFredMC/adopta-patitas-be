import { Module } from '@nestjs/common';
import typeorm from './config/typeorm';
import { join } from 'path';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/users/users.module';
import { FilesModule } from './files/files.module';
import { RolesModule } from './modules/roles/roles.module';
import { CaslModule } from './casl/casl.module';
import { ClsModule } from 'nestjs-cls';
import { UserInterceptor } from './modules/users/user.interceptor';
import { UserSubscriber } from './modules/users/entities/user.subscriber';
import { AuthModule } from './modules/auth/auth.module';
import { EmailsModule } from './email/emails.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PetsModule } from './modules/pets/pets.module';
import { DonateModule } from './modules/donate/donate.module';
import { ContactUsModule } from './modules/contact_us/contact_us.module';
import { AdoptionsModule } from './modules/adoptions/adoptions.module';
import { BreedsModule } from './modules/breeds/breeds.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) =>
        configService.getOrThrow('typeorm'),
      inject: [ConfigService],
    }),
    MailerModule.forRoot({
      transport: {
        host: 'email-smtp.sa-east-1.amazonaws.com',
        port: 587,
        secure: false,
        auth: {
          user: 'AKIA5R6X5FM4KRPTV7GK',
          pass: 'BNQB7SwEr2cVVdEfCBqPsIYrttfNlqhHdhVW/++ILSSh',
        },
      },
      defaults: {
        from: 'notificaciones.adopta-patitas@gmail.com',
      },
      template: {
        dir: join(__dirname, '..', 'templates'),
        adapter: new PugAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    ClsModule.forRoot({
      global: true,
      middleware: { mount: true },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      exclude: ['/api*'],
    }),
    CaslModule,
    UsersModule,
    FilesModule,
    RolesModule,
    AuthModule,
    EmailsModule,
    PetsModule,
    DonateModule,
    ContactUsModule,
    AdoptionsModule,
    BreedsModule,
  ],
  providers: [
    {
      provide: 'APP_INTERCEPTOR',
      useClass: UserInterceptor,
    },
    UserSubscriber,
  ],
})
export class AppModule {}
