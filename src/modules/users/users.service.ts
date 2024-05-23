import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register-user.dto';
import { FilesService } from 'src/files/files.service';
import { ResponseInterface } from 'src/interfaces/reponse.interface';
import { SecondAuthModeUserDto } from './entities/validate-second-auth-mode-user.dto';
import { ValidateOtpUserDto } from './entities/validate-otp-user..dto';
import { AccessToken } from '../auth/interfaces/access-token.interface';
import { TwoFactorAuthEvent } from '../auth/strategies/two-factor-auth.event';
import { EmailsService } from 'src/email/emails.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateOtpUserDto } from './entities/create-otp-user..dto';

@Injectable()
export class UsersService {
  public constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly dataSource: DataSource,
    private readonly filesService: FilesService,
    private readonly emailsService: EmailsService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  public async register(
    registerUsterDto: RegisterUserDto,
    profilePictureFile?: Express.Multer.File,
  ): Promise<User> {
    const createUserDto: CreateUserDto = new CreateUserDto();
    Object.assign(createUserDto, registerUsterDto);
    return this.create(createUserDto, profilePictureFile);
  }

  public async create(
    createUserDto: CreateUserDto,
    profilePictureFile?: Express.Multer.File,
  ): Promise<User> {
    let existUser = await this.findOneByUsername(createUserDto.username);
    if (existUser)
      throw new ConflictException('Error al crear usuario', {
        cause: new Error(),
        description: 'Ya existe un usuario con este username',
      });
    existUser = await this.findOneByEmail(createUserDto.email);
    if (existUser)
      throw new ConflictException('Error al crear usuario', {
        cause: new Error(),
        description: 'Ya existe un usuario con este email',
      });
    existUser = await this.findOneByIdentification(
      createUserDto.identification,
    );
    if (existUser)
      throw new ConflictException('Error al crear usuario', {
        cause: new Error(),
        description: 'Ya existe un usuario con esta identificación',
      });
    existUser = await this.findOneByPhone(createUserDto.phone);
    if (existUser)
      throw new ConflictException('Error al crear usuario', {
        cause: new Error(),
        description: 'Ya existe un usuario con este teléfono',
      });
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const user: User = this.userRepository.create(createUserDto);
      await this.hashPassword(user);
      if (profilePictureFile) {
        const fileFormat = profilePictureFile.mimetype.split('/')[1];
        await this.filesService.upload(
          profilePictureFile.buffer,
          profilePictureFile.originalname,
          'users',
          user.id,
          fileFormat,
        );
        user.profilePicture = profilePictureFile.originalname;
      }
      await queryRunner.manager.save(user);
      await queryRunner.commitTransaction();
      const finalUser = await this.findOne(user.id);
      return finalUser;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException('Error al crear Usuario', {
        cause: new Error(),
        description: `Ocurrió un error en el servidor: ${error}`,
      });
    } finally {
      await queryRunner.release();
    }
  }

  public async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  public async findOne(id: number): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }

  public async findOneByEmail(email: string): Promise<User | null> {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .getOne();
  }

  public async findOneByIdentification(
    identification: string,
  ): Promise<User | null> {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.identification = :identification', { identification })
      .getOne();
  }

  public async findOneByPhone(phone: string): Promise<User | null> {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.phone = :phone', { phone })
      .getOne();
  }

  public async findOneByUsername(username: string): Promise<User | null> {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.username = :username', { username })
      .getOne();
  }

  public async findOnByIdWithPermissions(id: number): Promise<User> {
    const user: User = await this.userRepository
      .createQueryBuilder('user')
      .innerJoinAndSelect('user.role', 'role')
      .innerJoinAndSelect('role.permissions', 'permissions')
      .innerJoinAndSelect('permissions.option', 'option')
      .innerJoinAndSelect('option.label', 'optionLabel')
      .innerJoinAndSelect('permissions.menu', 'menu')
      .innerJoinAndSelect('menu.label', 'menuLabel')
      .where('user.id = :id', { id })
      .getOneOrFail();

    return user;
  }

  public async update(
    id: number,
    updateUserDto: UpdateUserDto,
    profilePictureFile?: Express.Multer.File,
  ): Promise<User | null> {
    const user: User | null = await this.findOne(id);
    if (!user)
      throw new NotFoundException('Error al actualizar el usuario', {
        cause: new Error(),
        description: 'Usuario no encontrado por id',
      });

    if (
      updateUserDto.identification &&
      user.identification !== updateUserDto.identification
    ) {
      const existUser = await this.findOneByIdentification(
        updateUserDto.identification,
      );
      if (existUser)
        throw new ConflictException('Error al actualizar usuario', {
          cause: new Error(),
          description: 'Ya existe un usuario con esta identificación',
        });
    }
    if (updateUserDto.phone && user.phone !== updateUserDto.phone) {
      const existUser = await this.findOneByPhone(updateUserDto.phone);
      if (existUser)
        throw new ConflictException('Error al actualizar usuario', {
          cause: new Error(),
          description: 'Ya existe un usuario con este teléfono',
        });
    }
    if (updateUserDto.firstName && updateUserDto.lastName) {
      updateUserDto.name = `${updateUserDto.firstName} ${updateUserDto.lastName}`;
    }
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      if (profilePictureFile) {
        const fileFormat = profilePictureFile.mimetype.split('/')[1];
        await this.filesService.upload(
          profilePictureFile.buffer,
          profilePictureFile.originalname,
          'img_users',
          id,
          fileFormat,
        );
        await queryRunner.manager.update(User, id, {
          profilePicture: profilePictureFile.originalname,
        });
      }
      if (Object.keys(updateUserDto).length != 0) {
        await queryRunner.manager.update(User, id, {
          ...updateUserDto,
        });
      }
      await queryRunner.commitTransaction();
      return this.findOne(id);
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw new BadRequestException('Error al actualizar Usuario', {
        cause: new Error(),
        description: `Ocurrió un error en el servidor: ${error}`,
      });
    } finally {
      await queryRunner.release();
    }
  }

  public async remove(id: number): Promise<User> {
    const user: User | null = await this.findOne(id);
    if (!user)
      throw new NotFoundException('Error al eliminar el usuario', {
        cause: new Error(),
        description: 'Usuario no encontrado por id',
      });
    try {
      return await this.userRepository.remove(user);
    } catch (error) {
      throw new BadRequestException('Error al eliminar Usuario', {
        cause: new Error(),
        description: `Ocurrió un error en el servidor: ${error}`,
      });
    }
  }

  public async hashPassword(user: User): Promise<void> {
    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(user.password, salt);
    user.salt = salt;
    await this.userRepository.save(user);
  }

  public async generateOTP(user: User): Promise<string> {
    const min: number = 1000;
    const max: number = 9999;
    const salt = await bcrypt.genSalt();
    const otp = Math.floor(Math.random() * (max - min + 1) + min).toString();
    user.otp = await bcrypt.hash(otp, salt);
    user.saltOtp = salt;
    const date = new Date();
    user.otpCreatedAt = date;
    await this.userRepository.save(user);
    return otp;
  }

  public async createOtp(createOtpUserDto: CreateOtpUserDto): Promise<void> {
    const user: User | null = await this.findOneByEmail(createOtpUserDto.email);
    if (!user) {
      throw new NotFoundException('Error al generar OTP', {
        cause: new Error(),
        description: 'Usuario no encontrado por email',
      });
    }
    const otp = await this.generateOTP(user);
    await this.emailsService.sendEmail(
      user,
      otp,
      'Confirmación De Registro',
      'register',
    );
    await this.userRepository.save(user);
  }

  public async validateOtp(
    validateOtpUserDto: ValidateOtpUserDto,
  ): Promise<ResponseInterface | AccessToken> {
    const user: User | null = await this.findOneByEmail(
      validateOtpUserDto.email,
    );
    if (!user) {
      throw new NotFoundException('Error al validar OTP', {
        cause: new Error(),
        description: 'Usuario no encontrado por email',
      });
    }
    const minutesOtp: number = process.env.MINUTES_OTP
      ? +process.env.MINUTES_OTP
      : 10;
    const now: Date = new Date();
    const otpCreatedAt = new Date();
    otpCreatedAt.setTime(user.otpCreatedAt.getTime());
    otpCreatedAt.setMinutes(user.otpCreatedAt.getMinutes() + minutesOtp);
    if (now.getTime() > otpCreatedAt.getTime()) {
      throw new NotFoundException('Error al validar OTP', {
        cause: new Error(),
        description: 'Tiempo expirado',
      });
    }
    const otp: string = await bcrypt.hash(validateOtpUserDto.otp, user.saltOtp);
    if (otp !== user.otp) {
      throw new NotFoundException('Error al validar OTP', {
        cause: new Error(),
        description: 'Código inválido',
      });
    }
    if (!user.isActive) {
      user.isActive = true;
      await this.emailsService.sendEmail(
        user,
        '',
        'Cuenta Confirmada',
        'confirm-account',
      );
    }
    await this.userRepository.save(user);
    const event = new TwoFactorAuthEvent(user);
    this.eventEmitter.emit('twoFactorAuth', event);

    const userTwoFactor = await event.promise;
    return userTwoFactor;
  }

  public async validateSecondAuthMode(
    secondAuthModeUserDto: SecondAuthModeUserDto,
  ): Promise<ResponseInterface> {
    const user: User | null = await this.findOne(secondAuthModeUserDto.USER_ID);
    if (!user) {
      throw new NotFoundException('Error al validar segunda autenticación', {
        cause: new Error(),
        description: 'Usuario no encontrado por id',
      });
    }
    const passwordHashed: string = await bcrypt.hash(
      secondAuthModeUserDto.PASSWORD,
      user.salt,
    );
    if (user.password != passwordHashed) {
      throw new BadRequestException('Error al validar segunda autenticación', {
        cause: new Error(),
        description: 'Contraseña incorrecta',
      });
    }
    if (!user.secondAuthMode) {
      user.secondAuthMode = true;
      await this.userRepository.save(user);
      return {
        success: true,
        message: '¡Segunda autenticación activada!',
        status: 200,
      };
    }
    user.secondAuthMode = false;
    await this.userRepository.save(user);
    return {
      success: true,
      message: '¡Segunda autenticación desactivada!',
      status: 200,
    };
  }
}
