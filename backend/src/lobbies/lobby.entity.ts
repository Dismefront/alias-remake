import { Category } from 'src/categories/category.entity';
import { Message } from 'src/data/message.entity';
import { Game } from 'src/games/game.entity';
import { User } from 'src/users/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('is_cw_lobby')
export class Lobby {
  @PrimaryGeneratedColumn()
  lobby_id: number;

  @Column()
  lobby_name: string;

  @Column({ nullable: true })
  password: string;

  @Column({ default: false })
  is_private: boolean;

  @Column({ default: true })
  is_valid: boolean;

  @Column({ default: false })
  is_game_going: boolean;

  @Column({ default: true })
  is_master: boolean;

  @ManyToOne(() => User, (user) => user.lobbies)
  @JoinColumn({ name: 'created_by' })
  created_by: User;

  @Column({ nullable: true })
  round_time: number;

  @Column({ nullable: true })
  goal_points: number;

  @Column({ nullable: true })
  max_rounds: number;

  @ManyToOne(() => Lobby, (lobby) => lobby.master_id, { nullable: true })
  @JoinColumn({ name: 'master_id' })
  master_id: Lobby;

  @OneToMany(() => Game, (game) => game.lobby_id)
  games: Game[];

  @ManyToMany(() => Category, (category) => category.lobbies)
  @JoinTable({
    name: 'is_cw_lobby_category',
    joinColumn: { name: 'lobby_id', referencedColumnName: 'lobby_id' },
    inverseJoinColumn: {
      name: 'category_id',
      referencedColumnName: 'category_id',
    },
  })
  categories: Category[];

  @OneToMany(() => Message, (message) => message.lobby_id)
  messages: Message[];

  @OneToMany(() => User, (user) => user.lobbies)
  members: User[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
