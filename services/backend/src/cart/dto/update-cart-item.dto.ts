// dto/update-cart-item.dto.ts
import { IsInt, Min } from 'class-validator';

export class UpdateCartItemDto {
    @IsInt()
    itemId: number;

    @IsInt()
    @Min(0)
    quantity: number; // if 0 => remove
}
