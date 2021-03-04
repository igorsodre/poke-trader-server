import { BaseEntity, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Pokemon } from './Pokemon';
import { User } from './User';

@Entity('users_pokemons')
export class UserPokemons extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.userPokemons)
    user: User;

    @ManyToOne(() => Pokemon, (pokemon) => pokemon.userPokemons, { eager: true })
    pokemon: Pokemon;
}
