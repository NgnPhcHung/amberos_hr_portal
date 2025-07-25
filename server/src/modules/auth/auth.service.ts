import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Employee, Users } from '@prisma/client';
import { RegisterDto, LoginDto, RefreshTokenDto } from 'src/dtos/auth.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(
    registerDto: RegisterDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const {
      username,
      password,
      email,
      firstName,
      lastName,
      position,
      department,
      hireDate,
    } = registerDto;

    const existingUser = await this.prisma.users.findUnique({
      where: { username },
    });
    if (existingUser) {
      throw new BadRequestException('Username already exists');
    }

    const existingEmployee = await this.prisma.employee.findUnique({
      where: { email },
    });
    if (existingEmployee) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const employee = await this.prisma.employee.create({
      data: {
        firstName,
        lastName,
        email,
        position,
        department,
        hireDate: new Date(hireDate),
      },
    });

    const user = await this.prisma.users.create({
      data: {
        username,
        password: hashedPassword,
        employeeId: employee.id,
      },
    });

    const payload = { sub: user.id, username: user.username };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    await this.prisma.users.update({
      where: { id: user.id },
      data: { hash: refreshToken },
    });

    return { accessToken, refreshToken };
  }

  async login(
    loginDto: LoginDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { username, password } = loginDto;
    const user = await this.prisma.users.findUnique({ where: { username } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, username: user.username };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    await this.prisma.users.update({
      where: { id: user.id },
      data: { hash: refreshToken },
    });

    return { accessToken, refreshToken };
  }

  async refreshToken(
    refreshTokenDto: RefreshTokenDto,
  ): Promise<{ accessToken: string }> {
    const { refreshToken } = refreshTokenDto;
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const user = await this.prisma.users.findUnique({
        where: { id: payload.sub },
      });

      if (!user || user.hash !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const newPayload = { sub: user.id, username: user.username };
      const accessToken = this.jwtService.sign(newPayload);

      return { accessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: number): Promise<void> {
    await this.prisma.users.update({
      where: { id: userId },
      data: { hash: null },
    });
  }

  async validateUser(userId: number): Promise<Users & { employee: Employee }> {
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
      include: { employee: true },
    });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }
}
