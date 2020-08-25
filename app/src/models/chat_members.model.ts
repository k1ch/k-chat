import { Entity, BaseEntity, PrimaryColumn } from 'typeorm';

@Entity({
  name: 'chat_members'
})
export class ChatMembers extends BaseEntity {
  @PrimaryColumn()
  chat_id!: string;

  @PrimaryColumn()
  user_id!: string
}
