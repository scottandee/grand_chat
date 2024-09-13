import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UsersService } from '../../../users/users.service';
import { JwtService } from '@nestjs/jwt';
import {
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { RegisterDto } from '../dtos/register.dto';
import { LoginDto } from '../dtos/login.dto';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: Partial<Record<keyof UsersService, jest.Mock>>;
  let jwtService: Partial<Record<keyof JwtService, jest.Mock>>;

  beforeEach(async () => {
    usersService = {
      createUser: jest.fn(),
      findByEmail: jest.fn(),
      verifyUserPwd: jest.fn(),
    };

    jwtService = {
      signAsync: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should create a user and return data with user info', async () => {
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'password',
      };

      usersService.createUser.mockResolvedValue({ id: 1, ...registerDto });

      const result = await authService.register(registerDto);
      expect(result.data.user).toEqual({ id: 1, ...registerDto });
      expect(usersService.createUser).toHaveBeenCalledWith(registerDto);
    });

    it('should throw an InternalServerErrorException if user creation fails', async () => {
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'password',
      };

      usersService.createUser.mockResolvedValue(null);

      await expect(authService.register(registerDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('login', () => {
    it('should return access token if email and password are valid', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password',
      };

      const user = { id: 1, email: 'test@example.com', password: 'hashed_pwd' };
      usersService.findByEmail.mockResolvedValue(user);
      usersService.verifyUserPwd.mockResolvedValue(true);
      jwtService.signAsync.mockResolvedValue('fake_jwt_token');

      const result = await authService.login(loginDto);

      expect(result.access_token).toEqual('fake_jwt_token');
      expect(result.data.user).toEqual(user);
      expect(usersService.findByEmail).toHaveBeenCalledWith(loginDto.email);
      expect(usersService.verifyUserPwd).toHaveBeenCalledWith(
        loginDto.password,
        user.password,
      );
    });

    it('should throw UnauthorizedException if user not found', async () => {
      usersService.findByEmail.mockResolvedValue(null);

      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password',
      };

      await expect(authService.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password',
      };

      const user = { id: 1, email: 'test@example.com', password: 'hashed_pwd' };
      usersService.findByEmail.mockResolvedValue(user);
      usersService.verifyUserPwd.mockResolvedValue(false);

      await expect(authService.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
