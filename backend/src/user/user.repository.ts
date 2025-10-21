import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './user.entity';

type InsertUser = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
type UpdateUser = Partial<InsertUser>;

@Injectable()
export class UserRepository {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async create(data: InsertUser): Promise<User> {
    const user = this.repo.create(data);
    return this.repo.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.repo.find({
      select: ['id', 'name', 'email', 'createdAt', 'updatedAt'], // Exclude password
    });
  }

  async findOne(id: number): Promise<User | null> {
    return this.repo.findOne({
      where: { id },
      select: ['id', 'name', 'email', 'createdAt', 'updatedAt'], // Exclude password
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repo.findOne({
      where: { email },
      select: ['id', 'name', 'email', 'passwordHash', 'createdAt', 'updatedAt'],
    });
  }

  async update(id: number, data: UpdateUser): Promise<void> {
    await this.repo.update(id, data);
  }

  async remove(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
