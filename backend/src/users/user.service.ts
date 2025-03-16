import { Inject, Injectable } from '@nestjs/common';
import { REPOSITORIES } from 'src/configs/constants';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserBlock } from './user-block.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @Inject(REPOSITORIES.user)
    private userRepository: Repository<User>,

    @Inject(REPOSITORIES.userBlock)
    private userBlockRepository: Repository<UserBlock>,
  ) {}

  async findOne(username: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { username },
    });
  }

  async changeBlockStatus(
    user_id: number,
    is_blocked: boolean,
    blocked_by: number,
    cause: string,
  ) {
    if (is_blocked) {
      return await this.userBlockRepository.save({
        blocked_user: { user_id },
        blocked_by: { user_id: blocked_by },
        timestamp: new Date(),
        cause,
      });
    } else {
      return await this.userRepository.update(
        { user_id },
        { is_blocked: false },
      );
    }
  }

  async findOnesFullInfo(username: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { username },
      relations: ['suggested_words', 'created_categories'],
    });
  }

  async saveUserBlock(userBlock: UserBlock) {
    return this.userBlockRepository.save(userBlock);
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({
      where: { user_id: id },
    });
  }

  async addNew(username: string, password: string) {
    const user = new User();
    user.username = username;
    user.password_hash = bcrypt.hashSync(password);
    return await this.userRepository.save(user);
  }
}
