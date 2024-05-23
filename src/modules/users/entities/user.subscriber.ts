import type {
  EntitySubscriberInterface,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { DataSource, EventSubscriber } from 'typeorm';
import { ClsService } from 'nestjs-cls';
import type { User } from './user.entity';
import { GlobalEntity } from 'src/entities/global.entity';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<GlobalEntity> {
  public constructor(
    dataSource: DataSource,
    private readonly cls: ClsService,
  ) {
    dataSource.subscribers.push(this);
  }

  public listenTo(): typeof GlobalEntity {
    return GlobalEntity;
  }

  public async beforeInsert(event: InsertEvent<GlobalEntity>): Promise<void> {
    const user: User = this.cls.get('user');
    event.entity.createdBy = user.id;
  }

  public async beforeUpdate(event: UpdateEvent<GlobalEntity>): Promise<void> {
    const user: User = this.cls.get('user');
    if (event.entity) event.entity.updatedBy = user.id;
  }
}
