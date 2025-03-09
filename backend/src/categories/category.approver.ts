import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { catchError, firstValueFrom } from 'rxjs';
import { WordService } from 'src/words/word.service';
import { CategoryService } from './category.service';

@Injectable()
export class CategoryWordApprover {
  constructor(
    private readonly wordService: WordService,
    private readonly categoryService: CategoryService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  @Cron(CronExpression.EVERY_5_SECONDS)
  async runWordApprover() {
    const MODEL_URL: string = this.configService.get('MODEL_HTTP_SERVER')!;
    await firstValueFrom(
      this.httpService.get(`${MODEL_URL}/lifecheck`).pipe(
        catchError(() => {
          throw new Error('Word model Service does not respond');
        }),
      ),
    );

    const wordsObj = await this.wordService.findAllUnapproved();
    const words = wordsObj.map((w) => w.content);

    const response = await firstValueFrom(
      this.httpService.post<number[]>(`${MODEL_URL}/check_words`, words).pipe(
        catchError(() => {
          throw new Error('The word model service terminated with an error');
        }),
      ),
    );

    await this.wordService.updateMany(
      wordsObj.map((w, idx) => {
        return {
          ...w,
          is_approved: Boolean(response.data[idx]),
        };
      }),
    );
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async runCategoryApprover() {
    const categories = await this.categoryService.findUnapproved();
    void this.categoryService.updateMany(
      categories.map((category) => {
        let approve: boolean | undefined = true;
        for (const word of category.words) {
          if (word.is_approved === false) {
            approve = false;
            break;
          }
          if (word.is_approved === null) {
            approve = undefined;
            break;
          }
        }
        category.is_approved = approve;
        return category;
      }),
    );
  }
}
