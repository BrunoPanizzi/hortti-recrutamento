import { Injectable } from '@nestjs/common';

import { Product } from './product.entity';
import { CreateProductDTO } from './product.dto';
import { ProductRepository } from './product.repository';

@Injectable()
export class ProductService {
  constructor(private productRepository: ProductRepository) { }

  create(data: CreateProductDTO) {
    return this.productRepository.create(data);
  }

  findAll(page = 1, limit = 10, search?: string, category?: string) {
    return this.productRepository.findAll(page, limit, search, category);
  }

  findOne(id: number) {
    return this.productRepository.findOne(id);
  }

  update(id: number, data: Partial<Product>) {
    return this.productRepository.update(id, data);
  }

  remove(id: number) {
    return this.productRepository.remove(id);
  }
}
