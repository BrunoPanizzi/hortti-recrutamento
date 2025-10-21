import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Put,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { ProductService } from './product.service';

import { CreateProductDTO } from './product.dto';

@Controller('products')
export class ProductController {
  constructor(private service: ProductService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() body: CreateProductDTO,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.service.create(body, image);
  }

  @Get()
  findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('sortBy') sortBy?: 'name' | 'price',
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
  ) {
    return this.service.findAll(
      Number(page),
      Number(limit),
      search,
      category,
      sortBy,
      sortOrder,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(Number(id));
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Param('id') id: string,
    @Body() body: any,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.service.update(Number(id), body, image);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(Number(id));
  }
}
