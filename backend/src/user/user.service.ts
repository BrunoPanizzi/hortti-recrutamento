import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await this.hashPassword(createUserDto.password);

    return this.userRepository.create({
      name: createUserDto.name,
      email: createUserDto.email,
      passwordHash: hashedPassword,
    });
  }

  findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  findOne(id: number): Promise<User | null> {
    return this.userRepository.findOne(id);
  }

  findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<void> {
    const existingUser = await this.userRepository.findOne(id);
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    if (updateUserDto.email) {
      const userWithEmail = await this.userRepository.findByEmail(
        updateUserDto.email,
      );
      if (userWithEmail && userWithEmail.id !== id) {
        throw new ConflictException('User with this email already exists');
      }
    }

    let hashedPassword: string | undefined;

    if (updateUserDto.password) {
      hashedPassword = await this.hashPassword(updateUserDto.password);
    }

    return this.userRepository.update(id, {
      name: updateUserDto.name,
      email: updateUserDto.email,
      passwordHash: hashedPassword,
    });
  }

  async remove(id: number): Promise<void> {
    const existingUser = await this.userRepository.findOne(id);
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    return this.userRepository.remove(id);
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
}
