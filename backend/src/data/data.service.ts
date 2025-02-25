import { Inject, Injectable } from '@nestjs/common';
import { REPOSITORIES } from 'src/configs/constants';
import { Message } from './message.entity';
import { Repository } from 'typeorm';
import { Recording } from './recordings.entity';

@Injectable()
export class DataService {
  constructor(
    @Inject(REPOSITORIES.message)
    private messageRepository: Repository<Message>,

    @Inject(REPOSITORIES.recording)
    private recordingRepository: Repository<Recording>,
  ) {}

  async findAll() {
    return [
      ...(await this.messageRepository.find()),
      ...(await this.recordingRepository.find()),
    ];
  }
}
