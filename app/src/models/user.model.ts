import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, Unique, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({
  name: 'users'
})
@Unique('username', ['username'])
export class User extends BaseEntity {

  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column()
  username!: string;

  @Column()
  password_hash!: string;

  @Column()
  salt!: string;

  @Column()
  full_name!: string;

  @CreateDateColumn()
  created_at!: string;

  @UpdateDateColumn()
  updated_at!: string
}
