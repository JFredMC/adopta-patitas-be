import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import type { Payload } from '../interfaces/payload.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  public constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refresh'),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('SECRET_REFRESH'),
    });
  }

  public async validate(payload: Payload): Promise<Payload> {
    return {
      id: payload.id,
      username: payload.username,
    };
  }
}
