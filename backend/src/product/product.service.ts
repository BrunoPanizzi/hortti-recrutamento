import { Injectable } from '@nestjs/common';

import { Product } from './product.entity';
import { CreateProductDTO } from './product.dto';
import { ProductRepository } from './product.repository';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class ProductService {
  constructor(
    private productRepository: ProductRepository,
    private storageService: StorageService,
  ) {}

  async create(data: CreateProductDTO, image?: Express.Multer.File) {
    let imageKey: string | undefined;

    if (image) {
      imageKey = await this.storageService.uploadFile(image, 'products');
    }

    const product = await this.productRepository.create({ ...data, imageKey });
    return this.addImageUrl(product);
  }

  async findAll(
    page = 1,
    limit = 10,
    search?: string,
    category?: string,
    sortBy?: 'name' | 'price',
    sortOrder?: 'asc' | 'desc',
  ) {
    const products = await this.productRepository.findAll(
      page,
      limit,
      search,
      category,
      sortBy,
      sortOrder,
    );
    return products.map((product) => this.addImageUrl(product));
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne(id);
    return product ? this.addImageUrl(product) : null;
  }

  async update(
    id: number,
    data: Partial<Product>,
    image?: Express.Multer.File,
  ) {
    const product = await this.productRepository.findOne(id);

    if (image) {
      if (product?.imageKey) {
        await this.storageService.deleteFile(product.imageKey);
      }

      data.imageKey = await this.storageService.uploadFile(image, 'products');
    }

    await this.productRepository.update(id, data);
  }

  async remove(id: number) {
    const product = await this.productRepository.findOne(id);

    if (product?.imageKey) {
      await this.storageService.deleteFile(product.imageKey);
    }

    return this.productRepository.remove(id);
  }

  private addImageUrl(product: Product): Product & { imageUrl: string | null } {
    return {
      ...product,
      imageUrl: product.imageKey
        ? this.storageService.getFileUrl(product.imageKey)
        : null,
    };
  }
}
