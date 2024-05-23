import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('auth_logs')
export class AuthLog {
  @PrimaryGeneratedColumn()
  public id!: string;

  @Column()
  public type!: number;

  @Column()
  public username!: string;

  @CreateDateColumn()
  private readonly createdAt!: Date;

  @UpdateDateColumn({ nullable: true })
  private readonly updatedAt!: Date;

  @DeleteDateColumn()
  private readonly deletedAt!: Date | null;
}
