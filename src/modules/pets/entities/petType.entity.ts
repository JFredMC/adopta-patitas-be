import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Pet } from './pet.entity';
import { GlobalEntity } from 'src/entities/global.entity';
import { Breed } from 'src/modules/breeds/entities/breed.entity';

@Entity('pet_types')
export class PetType extends GlobalEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ type: 'varchar' })
  public name!: string;

  @Column({ type: 'text' })
  public description!: string;

  @Column({ nullable: true })
  public photoFile!: string;

  public photoFileUrl!: string;

  @OneToMany(() => Pet, (pet: Pet) => pet.petType)
  public pets!: Pet[];

  @OneToMany(() => Breed, (breed: Breed) => breed.petType)
  public breeds!: Breed[];
}
