import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('contact_us')
export class ContactUs {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ type: 'varchar' })
  public name!: string;

  @Column({ type: 'varchar' })
  public email!: string;

  @Column({ type: 'varchar' })
  public phone!: string;

  @Column({ type: 'varchar' })
  public subject!: string;

  @Column({ type: 'text' })
  public message!: string;
}
