import { Base } from "src/common/entities/base.entity";
import { Message } from "src/messages/entities/message.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'users' })
export class User extends Base<User>{
  @Column({ nullable: false })
  firstName: string

  @Column({ nullable: false })
  lastName: string

  @Column({ nullable: true, unique: false })
  email: string

  @Column({ nullable: false })
  password: string;
  
  @ManyToMany(() => Message, (message) => message.user)
  messages: string;
}