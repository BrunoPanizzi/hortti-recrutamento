import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UserService } from '../user/user.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signUp(dto: SignUpDto): Promise<{ access_token: string }> {
    const user = await this.userService.create({
      name: dto.name,
      email: dto.email,
      password: dto.password,
    });

    const payload = { sub: user.id, email: user.email, name: user.name };
    const access_token = await this.jwtService.signAsync(payload);

    return { access_token };
  }

  async signIn(dto: SignInDto): Promise<{ access_token: string }> {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const match = await bcrypt.compare(
      dto.password,
      (user as any).passwordHash,
    );
    if (!match) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email, name: user.name };
    const access_token = await this.jwtService.signAsync(payload);

    return { access_token };
  }

  async me(id: number) {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const { passwordHash, ...safeUser } = user as any;
    return safeUser;
  }
}
