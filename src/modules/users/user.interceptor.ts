import type {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { Observable } from 'rxjs';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class UserInterceptor implements NestInterceptor {
  public constructor(private readonly cls: ClsService) {}

  public intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<void> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    this.cls.set('user', user);
    return next.handle();
  }
}
