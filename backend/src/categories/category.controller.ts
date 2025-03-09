import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CreateCategoryReq } from 'src/common/interfaces';
import { WordService } from 'src/words/word.service';
import { CategoryService } from './category.service';
import { AppAuthGuard } from 'src/auth/auth.guard';

@Controller('categories')
@UseGuards(AppAuthGuard)
export class CategoryController {
  constructor(
    private readonly wordService: WordService,
    private readonly categoryService: CategoryService,
  ) {}

  @Post('create')
  async createCollection(
    @Body() createCategoryReq: CreateCategoryReq,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const user = req.session.user!;
    const { collectionName, collectionType } = createCategoryReq;
    try {
      const newCategory = await this.categoryService.save(
        collectionName,
        collectionType,
        user,
      );
      res.send({
        message: `Collection ${collectionName} successfully created and yet to be approved`,
      });
      void this.categoryService.addWordsToCategory(
        newCategory,
        createCategoryReq.includeWords,
      );
      void createCategoryReq.includeCategories.map(async (categoryName) => {
        const foundCtg = await this.categoryService.findOneByName(categoryName);
        if (!foundCtg) {
          return;
        }
        const allWords =
          await this.categoryService.fetchAllWordsFromCategory(foundCtg);
        if (allWords) {
          void this.categoryService.addWordsToCategory(
            newCategory,
            allWords.map((w) => w.content),
          );
        }
      });
    } catch (error: any) {
      console.log(error);
      res
        .status(HttpStatus.CONFLICT)
        .send({ message: 'The name of the collection already exists' });
    }
  }

  @Get('get-user-available')
  async getAllCollections(@Res() res: Response, @Req() req: Request) {
    try {
      const collections = await this.categoryService.findUserAvailable(
        req.session.user!.user_id!,
      );
      res.send(collections);
    } catch (error: any) {
      console.log(error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send({ message: 'Failed to retrieve collections' });
    }
  }
}
