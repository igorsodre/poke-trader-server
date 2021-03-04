import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserPokemons } from './UsersPokemons';

@Entity('pokemons')
export class Pokemon extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column('integer')
    pokeApiId: number;

    @Column('int')
    baseExperience: number;

    @Column('int')
    height: number;

    @Column('int')
    weight: number;

    @Column()
    species: string;

    @OneToMany(() => UserPokemons, (userPokemon) => userPokemon.pokemon)
    userPokemons: UserPokemons[];
}
