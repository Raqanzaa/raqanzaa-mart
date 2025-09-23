export class CreateCategoryDto {
    name: string;
    description?: string;
    status?: 'active' | 'inactive';
}
