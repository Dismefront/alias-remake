import { Lobby } from 'src/lobbies/lobby.entity';
import { User } from 'src/users/user.entity';
import { Word } from 'src/words/word.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum CategoryType {
  PUBLIC_PUBLIC = 'public_public',
  LOCAL_LOCAL = 'local_local',
  LOCAL_PUBLIC = 'local_public',
}

@Entity('is_cw_category')
export class Category {
  @PrimaryGeneratedColumn()
  category_id: number;

  @Column({ unique: true })
  category_name: string;

  @Column({
    type: 'enum',
    enum: CategoryType,
    default: CategoryType.PUBLIC_PUBLIC,
  })
  category_type: string;

  @ManyToMany(() => Word, (word) => word.categories)
  words: Word[];

  @ManyToMany(() => Lobby, (lobby) => lobby.categories)
  lobbies: Lobby[];

  @OneToOne(() => User, { nullable: true })
  @JoinColumn()
  created_by: User;

  @Column({ nullable: true })
  is_approved: boolean;
}
