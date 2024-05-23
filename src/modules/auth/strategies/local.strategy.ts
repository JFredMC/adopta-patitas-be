import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import type { User } from 'src/modules/users/entities/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  public constructor(private readonly authService: AuthService) {
    super();
  }

  public async validate(
    username: string,
    password: string,
  ): Promise<Partial<User>> {
    const user: Partial<User> | null = await this.authService.validateUser(
      username.toLowerCase(),
      password,
    );
    if (!user) {
      await this.authService.log(2, username.toLowerCase());
      throw new HttpException('Unauthorized', HttpStatus.PAYMENT_REQUIRED);
    }
    await this.authService.log(1, username.toLowerCase());
    return user;
  }
}
