import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
    ) { }

    create(dto: CreateProductDto, imageUrl?: string) {
        const product = this.productRepository.create({ ...dto, imageUrl });
        return this.productRepository.save(product);
    }

    findAll(search?: string, categoryId?: number) {
        const where: any = {};
        if (search) where.name = ILike(`%${search}%`);
        if (categoryId) where.categoryId = categoryId;
        return this.productRepository.find({ where });
    }

    findOne(id: number) {
        return this.productRepository.findOne({ where: { id } });
    }

    async update(id: number, dto: UpdateProductDto, imageUrl?: string) {
        const update = imageUrl ? { ...dto, imageUrl } : dto;
        await this.productRepository.update(id, update);
        return this.findOne(id);
    }

    remove(id: number) {
        return this.productRepository.delete(id);
    }
}
