import { Body, Controller, Post } from '@nestjs/common';
import { CreateCategoryReq } from 'src/common/interfaces';

@Controller('categories')
export class CategoryController {
  @Post('create')
  createCollection(@Body() createCategoryReq: CreateCategoryReq) {
    return createCategoryReq;
  }
}
