import { Entity, Column, BaseEntity, CreateDateColumn, PrimaryColumn } from 'typeorm';

@Entity({
  name: 'files'
})
export class File extends BaseEntity {
  @PrimaryColumn()
  id!: string;

  @Column()
  name!: string

  @Column()
  size!: string;

  @Column()
  mimetype!: number;

  @Column()
  url!: string;

  @Column()
  deleted!: boolean;

  @CreateDateColumn()
  created_at!: string;
}
