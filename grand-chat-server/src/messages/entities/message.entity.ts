import { Base } from '../../common/entities/base.entity';
import { Room } from '../../rooms/entities/room.entity';
import { User } from '../../users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
} from 'typeorm';

@Entity({ name: 'messages' })
export class Message extends Base<Message> {
  @Column({ nullable: false })
  content: string;

  @ManyToOne(() => Room, (room) => room.lastMessage)
  room: Room;

  @ManyToMany(() => User, (user) => user.messages)
  user: User;

  @CreateDateColumn()
  createdAt: string;
}
