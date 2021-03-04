import { Pokemon } from './Pokemon';
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Trade } from './Trade';

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

    @ManyToMany(() => Pokemon, (pokemon) => pokemon.users)
    @JoinTable()
    pokemons: Pokemon[];

    @ManyToOne(() => Trade, (trade) => trade.requester)
    requestedTrades: Trade[];

    @ManyToOne(() => Trade, (trade) => trade.requested)
    tradesSentToMe: Trade[];

    getDisplayableValues = (): Partial<User> => {
        return {
            id: this.id,
            email: this.email,
            name: this.name,
        };
    };
}
