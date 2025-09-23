export class UpdateProductDto {
    name?: string;
    description?: string;
    price?: number;
    stock?: number;
    categoryId?: number;
    imageUrl?: string;
    status?: 'active' | 'inactive';
}
