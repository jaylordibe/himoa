import { IsEmail, IsInt, IsString, Min } from 'class-validator';

export class CreateOrderDto {
  @IsEmail()
  customerEmail!: string;

  @IsString()
  customerName!: string;

  @IsString()
  sku!: string;

  @IsInt()
  @Min(0)
  quantity!: number;
}
