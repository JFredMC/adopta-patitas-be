import {
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  BaseEntity,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';

export abstract class GlobalEntity extends BaseEntity {
  @CreateDateColumn({
    type: 'timestamptz',
  })
  public createdAt!: Date;

  @UpdateDateColumn({
    nullable: true,
    type: 'timestamptz',
  })
  public updatedAt!: Date;

  @Column({ nullable: true })
  public createdBy!: number;

  @Column({ nullable: true })
  public updatedBy!: number;

  @ManyToOne(() => User, {
    eager: true,
  })
  @JoinColumn({ name: 'createdBy', referencedColumnName: 'id' })
  public createdByUser!: User;

  @ManyToOne(() => User, {
    eager: true,
  })
  @JoinColumn({ name: 'updatedBy', referencedColumnName: 'id' })
  public updatedByUser!: User;
}
