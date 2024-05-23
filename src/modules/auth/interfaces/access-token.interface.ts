import type { User } from 'src/modules/users/entities/user.entity';

export interface AccessToken {
  user: User;
  accessToken: string | null;
  refreshToken: string | null;
}
