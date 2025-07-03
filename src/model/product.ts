import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';

export class Product {
    id?: string;

    @IsNotEmpty()
    @IsString()
    name!: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    price!: number;

    @IsString()
    description!: string;
}