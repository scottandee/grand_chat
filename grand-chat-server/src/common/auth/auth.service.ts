import { Injectable, UnauthorizedException } from "@nestjs/common";
import { LoginDto } from "./dtos/login.dto";
import { UsersService } from "src/users/users.service";
import { JwtService } from "@nestjs/jwt";
import { RegisterDto } from "./dtos/register.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async register(registerDto: RegisterDto) {
    const user = await this.usersService.createUser(registerDto);
    return {
      data: { user }
    }
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) throw new UnauthorizedException()

    const validPwd = await this.usersService.verifyUserPwd(loginDto.password, user.password);
    if (!validPwd) throw new UnauthorizedException();
    
    const payload = { sub: user.id, username: user.email };
    return { 
      access_token: await this.jwtService.signAsync(payload),
      data: { user }
    };
  }
} 