import { Expose } from 'class-transformer';
import { IsOptional, IsString, IsNumber, Min, IsNotEmpty } from 'class-validator';

export class ProductUpdateDto {
  @Expose()
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  name?: string;

  @Expose()
  @IsNotEmpty({ message: 'Price is required' })
  @IsNumber({}, { message: 'Price must be a number' })
  @Min(0.01, { message: 'Price must be greater than 0' })
  price?: number;

  @Expose()
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;
}