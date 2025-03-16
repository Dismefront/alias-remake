import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { REPOSITORIES } from 'src/configs/constants';
import { IsNull, Repository } from 'typeorm';
import { Category, CategoryType } from './category.entity';
import { User } from 'src/users/user.entity';
import { WordService } from 'src/words/word.service';

@Injectable()
export class CategoryService {
  constructor(
    @Inject(REPOSITORIES.category)
    private readonly categoryRepository: Repository<Category>,

    private readonly wordService: WordService,
  ) {}

  async findAll() {
    return this.categoryRepository.find();
  }

  async findUnapproved() {
    return this.categoryRepository.find({
      where: {
        is_approved: IsNull(),
      },
      relations: ['words'],
    });
  }

  async fetchAllWordsFromCategory(category: Category) {
    return this.wordService.findAllFromCategory(category);
  }

  async updateCategoryType(categoryId: number, newType: CategoryType) {
    const category = await this.categoryRepository.findOne({
      where: { category_id: categoryId },
    });
    if (!category) {
      throw new ConflictException(`Category with id ${categoryId} not found`);
    }
    if (!category.is_approved && newType === CategoryType.PUBLIC_PUBLIC) {
      throw new ConflictException(
        `Cannot update ${category.category_name} because it is not approved`,
      );
    }
    category.category_type = newType;
    return this.categoryRepository.save(category);
  }

  async findUserAvailable(userId: number) {
    return await this.categoryRepository
      .createQueryBuilder('category')
      .where(
        '(category.category_type <> :type and category.is_approved = true) or (category.createdByUserId = :userId and category.category_type = :type)',
        {
          type: CategoryType.LOCAL_LOCAL,
          userId,
        },
      )
      .getMany();
  }

  async findOneByName(name: string) {
    return await this.categoryRepository.findOne({
      where: { category_name: name },
    });
  }

  async updateMany(category: Category[]) {
    return this.categoryRepository.save(category);
  }

  async suggestWordToCategory(
    category_id: number,
    word: string,
    suggested_by: number,
  ) {
    const foundCategory = await this.categoryRepository.findOne({
      where: {
        category_id,
        words: {
          content: word,
        },
      },
    });
    if (foundCategory !== null) {
      throw new ConflictException(
        `The word has already been suggested to ${foundCategory.category_name}`,
      );
    }

    await this.wordService
      .save(word, { user_id: suggested_by } as User)
      .catch(() => {
        return this.wordService.findOneWithCategories(word);
      })
      .then((word) => {
        if (!word) {
          return;
        }
        if (word?.categories) {
          word.categories.push({ category_id } as Category);
        } else {
          word.categories = [{ category_id } as Category];
        }
        void this.wordService.update(word);
      });
  }

  async addWordsToCategory(category: Category, words: string[]) {
    let categoryAutoApprove = true;
    const dbWords = await Promise.all(
      words.map(async (word) => {
        let foundWord = await this.wordService.findOneWithCategories(word);
        if (foundWord === null) {
          foundWord = await this.wordService.save(word, category.created_by);
        }
        if (!foundWord.is_approved) {
          categoryAutoApprove = false;
        }
        if (!foundWord.categories) {
          foundWord.categories = [];
        }
        foundWord.categories.push(category);
        return await this.wordService.update(foundWord);
      }),
    );
    if (categoryAutoApprove) {
      category.is_approved = true;
    }
    return {
      approved: categoryAutoApprove,
      words: dbWords,
    };
  }

  async save(name: string, type: CategoryType, user: User) {
    const category = new Category();
    category.category_name = name;
    category.category_type = type;
    category.created_by = user;
    return await this.categoryRepository.save(category);
  }
}
