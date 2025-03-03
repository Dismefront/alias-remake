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
