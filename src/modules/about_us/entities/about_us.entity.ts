import { GlobalEntity } from 'src/entities/global.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('about_us')
export class AboutUs extends GlobalEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ type: 'text' })
  aboutUs!: string;

  @Column({ type: 'text' })
  ourMission!: string;

  @Column({ type: 'text' })
  ourVision!: string;

  @Column()
  email!: string;

  @Column()
  phone!: string;
}
