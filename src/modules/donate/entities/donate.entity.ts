import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { GlobalEntity } from 'src/entities/global.entity';

@Entity('donates')
export class Donate extends GlobalEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public userId!: number;

  @ManyToOne(() => User, (user: User) => user.donates)
  public user!: User;

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  public donateDate!: Date;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  public amount!: number;

  @Column({ type: 'text', nullable: true })
  public notes?: string;
}
