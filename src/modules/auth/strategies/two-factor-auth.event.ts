import type { User } from 'src/modules/users/entities/user.entity';
import type { AccessToken } from '../interfaces/access-token.interface';

export class TwoFactorAuthEvent {
  public resolve!: (value: AccessToken | PromiseLike<AccessToken>) => void;

  public constructor(public readonly user: User) {
    this.promise = new Promise<AccessToken>((resolve) => {
      this.resolve = resolve;
    });
  }

  public promise: Promise<AccessToken>;

  public async complete(value: AccessToken): Promise<void | AccessToken> {
    return this.resolve(value);
  }
}
