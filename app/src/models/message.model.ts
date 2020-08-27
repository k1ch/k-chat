import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn } from 'typeorm';

@Entity({
  name: 'messages'
})
export class Message extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column()
  sender!: string;

  @Column()
  recipient!: string;

  @Column({
    nullable: true
  })
  file_id!: string;

  @Column({
    nullable: true
  })
  text!: string;

  @Column()
  content_type!: string;

  @CreateDateColumn()
  created_at!: string;

  @Column()
  seen_at!: string;

  @Column()
  delivered_at!: string;
}

export interface MessageCreationRequest {
  sender: string;
  recipient: string;
  content: {
    type: ContentType;
    text: string;
  }
  upload?: boolean
}

export enum ContentType {
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio'
}

export enum SenderOrRecipient {
  SENDER = 'sender',
  RECIPIENT = 'recipient',
}
