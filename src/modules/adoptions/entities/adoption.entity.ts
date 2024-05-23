import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Pet } from 'src/modules/pets/entities/pet.entity';
import { User } from 'src/modules/users/entities/user.entity';

@Entity('adoptions')
export class Adoption {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public userId!: number;

  @ManyToOne(() => User, (user: User) => user.adoptions)
  public user!: User;

  @Column()
  public petId!: number;

  @ManyToOne(() => Pet, (pet: Pet) => pet.adoptions)
  public pet!: Pet;

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  public adoptionDate!: Date;

  @Column({ type: 'text', nullable: true })
  public notes?: string;
}
