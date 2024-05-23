import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { GlobalEntity } from 'src/entities/global.entity';
import { PetType } from 'src/modules/pets/entities/petType.entity';

@Entity('breeds')
export class Breed extends GlobalEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public petTypeId!: number;

  @ManyToOne(() => PetType, (petType: PetType) => petType.breeds)
  public petType!: PetType;

  @Column()
  public name!: string;

  @Column({ type: 'text' })
  public description!: string;
}
