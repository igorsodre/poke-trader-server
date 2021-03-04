import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Trade } from './Trade';
import { UserPokemons } from './UsersPokemons';

@Entity('users')
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column('int', { default: 0 })
    tokenVersion: number;

    @OneToMany(() => UserPokemons, (userPokemon) => userPokemon.user)
    userPokemons: UserPokemons[];

    @OneToMany(() => Trade, (trade) => trade.requester)
    requestedTrades: Trade[];

    @OneToMany(() => Trade, (trade) => trade.requested)
    tradesSentToMe: Trade[];

    getDisplayableValues = (): Partial<User> => {
        return {
            id: this.id,
            email: this.email,
            name: this.name,
        };
    };
}
