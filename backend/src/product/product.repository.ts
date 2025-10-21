import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Product } from './product.entity';

@Injectable()
export class ProductRepository {
  constructor(@InjectRepository(Product) private repo: Repository<Product>) {}

  async create(data: Partial<Product>): Promise<Product> {
    const product = this.repo.create(data);
    return this.repo.save(product);
  }

  async findAll(
    page = 1,
    limit = 10,
    search?: string,
    category?: string,
    sortBy: 'name' | 'price' = 'name',
    sortOrder: 'asc' | 'desc' = 'asc',
  ): Promise<Product[]> {
    const qb = this.repo.createQueryBuilder('p');
    
    if (search) {
      qb.andWhere('(p.name ILIKE :search OR p.category ILIKE :search)', {
        search: `%${search}%`,
      });
    }
    
    if (category) {
      qb.andWhere('p.category = :category', { category });
    }

    const orderDirection = sortOrder.toUpperCase() as 'ASC' | 'DESC';
    if (sortBy === 'name') {
      qb.orderBy('p.name', orderDirection);
    } else if (sortBy === 'price') {
      qb.orderBy('p.price', orderDirection);
    }

    return qb.skip((page - 1) * limit).take(limit).getMany();
  }

  async findOne(id: number): Promise<Product | null> {
    return this.repo.findOneBy({ id });
  }

  async update(id: number, data: Partial<Product>): Promise<void> {
    await this.repo.update(id, data);
  }

  async remove(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
