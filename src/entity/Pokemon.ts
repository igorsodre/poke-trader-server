import { BaseEntity, Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';

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

    @ManyToMany(() => User, (user) => user.pokemons)
    users: User[];
}
