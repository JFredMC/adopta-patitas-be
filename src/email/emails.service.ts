import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { ForgotPasswordUserDto } from 'src/modules/auth/dto/forgot-password-user.dto';
import type { User } from 'src/modules/users/entities/user.entity';

@Injectable()
export class EmailsService {
  public constructor(
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
  ) {}

  public async sendEmail(
    user: User,
    otp?: string,
    subject?: string,
    template?: string,
    data?: ForgotPasswordUserDto,
  ): Promise<void> {
    const url = `https://siu-clqa.metgroupsas.com/auth/reset-password?id=${user.id}&verifcode=${otp}`;
    this.mailerService
      .sendMail({
        to: user.email,
        from: 'notificaciones.adopta-patitas@gmail.com',
        subject: subject,
        template: template,
        context: {
          user,
          otp,
          url,
          data,
        },
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
