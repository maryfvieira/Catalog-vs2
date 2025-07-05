import { Expose, Transform } from 'class-transformer';
import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';

export class Product {
    @Expose({ toClassOnly: true })
    id!: string;

    @Expose()
    name!: string;

    @Transform(({ value }) => parseFloat(value), { toClassOnly: true })
    @Expose()
    price!: number;

    @Expose()
    description!: string;
}