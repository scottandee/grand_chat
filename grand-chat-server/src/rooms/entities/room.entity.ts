import { Base } from '../../common/entities/base.entity';
import { Message } from '../../messages/entities/message.entity';
import { Column, CreateDateColumn, Entity, OneToMany } from 'typeorm';

@Entity({ name: 'rooms' })
export class Room extends Base<Room> {
  @Column({ unique: true })
  name: string;

  @CreateDateColumn()
  createdAt: string;

  @CreateDateColumn()
  bumpedAt: string;

  @OneToMany(() => Message, (message) => message.room)
  lastMessage: Message[];
}
