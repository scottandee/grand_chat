import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserInterface } from './interfaces/create-user.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async createUser(createUserInterface: CreateUserInterface) {
    const user = this.usersRepository.create(createUserInterface);
    return await this.usersRepository.save(user);
  }

  async findByEmail(email: string) {
    const user = await this.usersRepository.findOne({
      where: { email },
    });
    return user;
  }

  async verifyUserPwd(requestPwd: string, userPwd: string) {
    const owner = await bcrypt.compare(requestPwd, userPwd);
    if (!owner) return false;
    return true;
  }
}
