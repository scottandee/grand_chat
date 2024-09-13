import { Base } from '../../common/entities/base.entity';
import { Role } from '../../common/enums/role.enum';
import { Message } from '../../messages/entities/message.entity';
import { BeforeInsert, Column, Entity, ManyToMany } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity({ name: 'users' })
export class User extends Base<User> {
  @Column({ nullable: false })
  firstName: string;

  @Column({ nullable: false })
  lastName: string;

  @Column({ nullable: true, unique: true })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false, default: Role.USER })
  role: Role;

  @ManyToMany(() => Message, (messages) => messages.user)
  messages: Message[];

  @BeforeInsert()
  async hashPassword() {
    if (this.password && !this.password.startsWith('$2b$')) {
      const salt = await bcrypt.genSalt();
      this.password = await bcrypt.hash(this.password, salt);
    }
  }
}
