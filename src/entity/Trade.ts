import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';
export enum TradeStaus {
    Active = 1,
    FinishedSuccess,
    FinishedFailed,
}
@Entity('trades')
export class Trade extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('int')
    status: TradeStaus;

    @ManyToOne(() => User, (user) => user.requestedTrades, { eager: true })
    requester: User;

    @ManyToOne(() => User, (user) => user.tradesSentToMe, { eager: true })
    requested: User;

    @Column('int', { array: true })
    requestedPokemons: number[];

    @Column('int', { array: true })
    pokemonsSentToRequestedUser: number[];
}
