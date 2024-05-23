import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/modules/users/entities/user.entity';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RefreshJwtAuthGuard } from './guards/refresh-jwt-auth.guard';
import type { AccessToken } from './interfaces/access-token.interface';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ForgotPasswordUserDto } from './dto/forgot-password-user.dto';
import { ResetPasswordUserDto } from './dto/reset-password.user.dto';
import type { ResponseInterface } from 'src/interfaces/reponse.interface';
import { ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Autenticacion')
export class AuthController {
  public constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  public async login(@Body() user: AuthDto): Promise<AccessToken> {
    return this.authService.login(user);
  }

  @UseGuards(RefreshJwtAuthGuard)
  @Post('refresh')
  public async refreshToken(@GetUser() user: User): Promise<AccessToken> {
    return this.authService.refreshToken(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('validate')
  public async validateToken(): Promise<boolean> {
    return true;
  }

  @Post('forgot_password')
  public async forgotPassword(
    @Body() forgotPasswordUserDto: ForgotPasswordUserDto,
  ): Promise<User> {
    return this.authService.forgotPassword(forgotPasswordUserDto);
  }

  @Post('reset_password')
  public async resetPassword(
    @Body() resetPasswordUserDto: ResetPasswordUserDto,
  ): Promise<ResponseInterface> {
    return this.authService.resetPassword(resetPasswordUserDto);
  }
}
