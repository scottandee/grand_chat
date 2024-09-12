import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
        global: true,
        secret: 'andeescott',
        signOptions: { expiresIn: '1h' },
      }),
],
  controllers: [AuthController],
  providers: [AuthService, UsersService],
})
export class AuthModule {}
