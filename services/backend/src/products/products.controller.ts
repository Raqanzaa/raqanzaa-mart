import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Put,
    Query,
    UploadedFile,
    UseInterceptors,
    UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from './multer.option';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../users/role.enum';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @UseInterceptors(FileInterceptor('file', multerOptions))
    create(@Body() dto: CreateProductDto, @UploadedFile() file: Express.Multer.File) {
        const imageUrl = file ? `/uploads/products/${file.filename}` : null;
        return this.productsService.create(dto, imageUrl);
    }

    @Get()
    findAll(@Query('search') search?: string, @Query('categoryId') categoryId?: number) {
        return this.productsService.findAll(search, categoryId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.productsService.findOne(+id);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @UseInterceptors(FileInterceptor('file', multerOptions))
    update(
        @Param('id') id: string,
        @Body() dto: UpdateProductDto,
        @UploadedFile() file: Express.Multer.File,
    ) {
        const imageUrl = file ? `/uploads/products/${file.filename}` : null;
        return this.productsService.update(+id, dto, imageUrl);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    remove(@Param('id') id: string) {
        return this.productsService.remove(+id);
    }
}
