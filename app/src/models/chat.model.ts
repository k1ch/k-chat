import { Entity, BaseEntity, PrimaryColumn, CreateDateColumn, Column } from 'typeorm';

@Entity({
  name: 'chats'
})
export class Chat extends BaseEntity {
  @PrimaryColumn()
  id!: string;

  @CreateDateColumn()
  created_at!: string;

  @Column()
  owner_id!: number;

  @Column()
  name!: string;
}
