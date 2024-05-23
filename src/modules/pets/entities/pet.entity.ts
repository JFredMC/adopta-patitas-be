import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PetType } from './petType.entity';
import { GlobalEntity } from 'src/entities/global.entity';
import { Adoption } from 'src/modules/adoptions/entities/adoption.entity';

@Entity('pets')
export class Pet extends GlobalEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ name: 'petTypeId' })
  public petTypeId!: number;

  @ManyToOne(() => PetType, (petType: PetType) => petType.pets)
  public petType!: PetType;

  @Column()
  public name!: string;

  @Column()
  public breed!: string;

  @Column()
  public sex!: string;

  @Column({ type: 'int' })
  public age!: number;

  @Column({ type: 'text' })
  public description!: string;

  @Column({ nullable: true })
  public photoFile?: string;

  public photoFileUrl!: string;

  @Column({ type: 'text', nullable: true })
  public healthDetails?: string;

  @OneToMany(() => Adoption, (adoption: Adoption) => adoption.user)
  public adoptions!: Adoption[];
}
