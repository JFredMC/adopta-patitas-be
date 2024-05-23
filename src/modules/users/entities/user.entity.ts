import { Exclude } from 'class-transformer';
import { Adoption } from 'src/modules/adoptions/entities/adoption.entity';
import { Donate } from 'src/modules/donate/entities/donate.entity';
import { Role } from 'src/modules/roles/entities/role.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ name: 'roleId' })
  public roleId!: number;

  @ManyToOne(() => Role, (role: Role) => role.users)
  public role!: Role;

  @Column()
  public name!: string;

  @Column()
  public firstName!: string;

  @Column()
  public lastName!: string;

  @Column()
  public email!: string;

  @Column()
  public identification!: string;

  @Column()
  public phone!: string;

  @Column()
  public username!: string;

  @Column()
  @Exclude()
  public password!: string;

  @Column({ type: 'date' })
  public dateOfBirth!: Date;

  @Column({ default: true })
  public isActive!: boolean;

  @Column({ default: false })
  public secondAuthMode!: boolean;

  @Column({ nullable: true })
  public profilePicture!: string;

  @Column({ nullable: true })
  @Exclude()
  public salt!: string;

  @Column({ nullable: true })
  @Exclude()
  public otp!: string;

  @Column({ nullable: true })
  @Exclude()
  public saltOtp!: string;

  @Exclude()
  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  public otpCreatedAt!: Date;

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

  @BeforeInsert()
  @BeforeUpdate()
  public before(): void {
    if (this.username) {
      this.username = this.username.toLowerCase().trim();
    }
    if (this.firstName && this.lastName) {
      this.name = `${this.firstName} ${this.lastName}`;
    }
  }

  public constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }

  @OneToMany(() => Adoption, (adoption: Adoption) => adoption.user)
  public adoptions!: Adoption[];

  @OneToMany(() => Donate, (donate: Donate) => donate.user)
  public donates!: Donate[];
}
