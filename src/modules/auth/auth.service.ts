import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from 'src/modules/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import type { User } from 'src/modules/users/entities/user.entity';
import type { AccessToken } from './interfaces/access-token.interface';
import type { Payload } from './interfaces/payload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthLog } from './entities/authlog.entity';
import { Repository } from 'typeorm';
import { FilesService } from 'src/files/files.service';
import { EmailsService } from 'src/email/emails.service';
import type { ForgotPasswordUserDto } from './dto/forgot-password-user.dto';
import type { ResetPasswordUserDto } from './dto/reset-password.user.dto';
import { ResponseInterface } from 'src/interfaces/reponse.interface';
import { OnEvent } from '@nestjs/event-emitter';
import { TwoFactorAuthEvent } from './strategies/two-factor-auth.event';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  public constructor(
    @InjectRepository(AuthLog)
    private readonly authLogsRepository: Repository<AuthLog>,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly filesService: FilesService,
    private readonly emailsService: EmailsService,
  ) {}

  public async validateUser(
    username: string,
    pass: string,
  ): Promise<Partial<User> | null> {
    const user: User | null =
      await this.usersService.findOneByUsername(username);
    if (!user)
      throw new NotFoundException('Error al iniciar sesión', {
        cause: new Error(),
        description: 'Usuario o contraseña invalido',
      });
    if (!user.isActive) return user;

    const passwordHashed: string = await bcrypt.hash(pass, user.salt);
    if (user.password === passwordHashed) {
      const { password, ...result } = user;
      return result;
    }
    throw new NotFoundException('Error al iniciar sesión', {
      cause: new Error(),
      description: 'Usuario o contraseña invalido',
    });
  }

  public async login(userBody: AuthDto): Promise<AccessToken> {
    const user = await this.usersService.findOneByUsername(userBody.username);
    user['profilePictureUrl'] = await this.filesService.getPreSignedURL(
      'users',
      user.profilePicture,
      user.id,
    );
    if (user.secondAuthMode) {
      const otp = await this.usersService.generateOTP(user);
      await this.emailsService.sendEmail(
        user,
        otp,
        'Codigo de Inicio de Sesión',
        'validate-login',
      );
    }
    if (!user.isActive) {
      const otp = await this.usersService.generateOTP(user);
      await this.emailsService.sendEmail(
        user,
        otp,
        'Confirmación De Registro',
        'validate-login',
      );
    }
    const payload: Payload = { id: user.id, username: user.username };
    return {
      user,
      accessToken:
        user.isActive && !user.secondAuthMode
          ? this.jwtService.sign(payload)
          : null,
      refreshToken:
        user.isActive && !user.secondAuthMode
          ? this.jwtService.sign(payload, { expiresIn: '36000s' })
          : null,
    };
  }

  public async loginAfterVerification(user: User): Promise<AccessToken> {
    const newUser = await this.usersService.findOne(user.id);
    if (newUser) {
      user = newUser;
    }
    user['profilePictureUrl'] = await this.filesService.getPreSignedURL(
      'img_users',
      user.profilePicture,
      user.id,
    );
    const payload: Payload = { id: user.id, username: user.username };
    return {
      user,
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '36000s' }),
    };
  }

  public async log(type: number, username: string): Promise<AuthLog> {
    const authLog: AuthLog = new AuthLog();
    authLog.type = type;
    authLog.username = username;
    return this.authLogsRepository.save(authLog);
  }

  public async refreshToken(user: User): Promise<AccessToken> {
    const payload: Payload = { id: user.id, username: user.username };
    return {
      user,
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '36000s' }),
    };
  }

  public async forgotPassword(
    forgotpasswordUserDto: ForgotPasswordUserDto,
  ): Promise<User> {
    try {
      const user: User | null = await this.usersService.findOneByUsername(
        forgotpasswordUserDto.username,
      );
      if (!user)
        throw new NotFoundException('Error al recuperar contraseña', {
          cause: new Error(),
          description: 'Usuario no encontrado por nombre de usuario',
        });
      const otp = await this.usersService.generateOTP(user);
      await this.emailsService.sendEmail(
        user,
        otp,
        'Recuperar Contraseña',
        'forgot-password',
        forgotpasswordUserDto,
      );
      return user;
    } catch (error) {
      throw new BadRequestException('Error al recuperar la contraseña', {
        cause: new Error(),
        description: `Ocurrió un error en el servidor: ${error}`,
      });
    }
  }

  public async resetPassword(
    resetpasswordUserDto: ResetPasswordUserDto,
  ): Promise<ResponseInterface> {
    try {
      const user: User | null = await this.usersService.findOne(
        resetpasswordUserDto.userId,
      );
      if (!user)
        throw new NotFoundException('Error al reestablecer contraseña', {
          cause: new Error(),
          description: 'Usuario no encontrado por id',
        });
      resetpasswordUserDto.email = user.email;
      user.password = resetpasswordUserDto.newPassword;
      if (!user.isActive) user.isActive = true;
      await this.usersService.validateOtp(resetpasswordUserDto);
      await this.usersService.hashPassword(user);
      return {
        success: true,
        message: '¡Contraseña cambiada exitosamente!',
        status: 200,
      };
    } catch (error) {
      throw new BadRequestException('Error al reestablecer la contraseña', {
        cause: new Error(),
        description: `Ocurrió un error en el servidor: ${error}`,
      });
    }
  }

  @OnEvent('twoFactorAuth')
  public async handleTwoFactorAuthEvent(
    event: TwoFactorAuthEvent,
  ): Promise<AccessToken | void> {
    const userToken = await this.loginAfterVerification(event.user);
    void event.complete(userToken);
  }
}
