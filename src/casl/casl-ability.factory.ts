import type { AbilityClass, ExtractSubjectType } from '@casl/ability';
import { Ability, AbilityBuilder } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import type { User } from 'src/modules/users/entities/user.entity';
import { UsersService } from 'src/modules/users/users.service';

export type AppAbility = Ability<[string, string]>;

@Injectable()
export class CaslAbilityFactory {
  public constructor(private readonly usersService: UsersService) {}
  public async createForUser(user: User): Promise<Ability<[string, string]>> {
    const authUser = await this.usersService.findOnByIdWithPermissions(user.id);
    const { can, build } = new AbilityBuilder<Ability<[string, string]>>(
      Ability as AbilityClass<AppAbility>,
    );
    // authUser.role.permissions.forEach((permission) => {
    //   can(permission.option.label.LABEL, permission.menu.label.LABEL);
    // });
    return build({
      detectSubjectType: (item: User | string) =>
        item.constructor as unknown as ExtractSubjectType<string>,
    });
  }
}
