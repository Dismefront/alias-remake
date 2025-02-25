import { Lobby } from 'src/lobbies/lobby.entity';
import { Word } from 'src/words/word.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('is_cw_category')
export class Category {
  @PrimaryGeneratedColumn()
  category_id: number;

  @Column()
  category_name: string;

  @Column()
  category_type: string;

  @ManyToMany(() => Word, (word) => word.categories)
  words: Word[];

  @ManyToMany(() => Lobby, (lobby) => lobby.categories)
  lobbies: Lobby[];
}
