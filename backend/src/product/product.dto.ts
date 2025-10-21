import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsOptional,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';

export class CreateProductDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsPositive()
  price: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(0)
  stock: number;

  @IsOptional()
  @Transform(({ value }) => (value ? Number(value) : undefined))
  @IsNumber()
  @IsPositive()
  volume: number;

  @IsOptional()
  @Transform(({ value }) => (value ? Number(value) : undefined))
  @IsNumber()
  @IsPositive()
  weight: number;
}

export class UpdateProductDTO extends PartialType(CreateProductDTO) {}
