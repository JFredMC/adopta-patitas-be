import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { RegisterUserDto } from './dto/register-user.dto';
import { AccessToken } from '../auth/interfaces/access-token.interface';
import { CreateOtpUserDto } from './entities/create-otp-user..dto';
import { ValidateOtpUserDto } from './entities/validate-otp-user..dto';
import { ResponseInterface } from 'src/interfaces/reponse.interface';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CheckPolicies } from 'src/common/decorators/checkPolicies.decorator';
import { AppAbility } from 'src/casl/casl-ability.factory';
import { SecondAuthModeUserDto } from './entities/validate-second-auth-mode-user.dto';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';

@Controller('user')
@ApiTags('Usuarios')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  public constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiBearerAuth()
  @CheckPolicies((ability: AppAbility) => ability.can('Create', 'User'))
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('profilePictureFile'))
  public async create(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() profilePictureFile?: Express.Multer.File,
  ): Promise<User> {
    return this.usersService.create(createUserDto, profilePictureFile);
  }

  @Post('register')
  @ApiConsumes('multipart/form-data', 'application/json')
  @UseInterceptors(FileInterceptor('profilePictureFile'))
  public async register(
    @Body() registerUserDto: RegisterUserDto,
    @UploadedFile() profilePictureFile?: Express.Multer.File,
  ): Promise<AccessToken> {
    const user: User = await this.usersService.register(
      registerUserDto,
      profilePictureFile,
    );
    return {
      user,
      accessToken: null,
      refreshToken: null,
    };
  }

  @Post('generate_otp')
  public async generateOTP(
    @Body() createOtpUserDto: CreateOtpUserDto,
  ): Promise<void> {
    return this.usersService.createOtp(createOtpUserDto);
  }

  @Post('validate_otp')
  public async validateOTP(
    @Body() validateOtpUserDto: ValidateOtpUserDto,
  ): Promise<ResponseInterface | AccessToken> {
    return this.usersService.validateOtp(validateOtpUserDto);
  }

  @Post('validate_second_auth_mode')
  @UseGuards(JwtAuthGuard)
  @CheckPolicies((ability: AppAbility) => ability.can('Update', 'User'))
  public async validateSecondAuthMode(
    @Body() secondAuthModeUserDto: SecondAuthModeUserDto,
  ): Promise<ResponseInterface> {
    return this.usersService.validateSecondAuthMode(secondAuthModeUserDto);
  }

  @Get()
  public async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  public async findOne(@Param('id') id: string): Promise<User | null> {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  public async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  public async remove(@Param('id') id: string): Promise<User> {
    return this.usersService.remove(+id);
  }
}
