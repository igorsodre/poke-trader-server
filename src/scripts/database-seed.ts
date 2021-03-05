import { hash } from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { createConnection } from 'typeorm';
import { User } from '../entity/User';
import { Pokemon } from './../entity/Pokemon';
import { PokemonDetail } from './scriptToFetchAllPokemonsAndStats';

export async function loadPokemonDetails(): Promise<void> {
    let items: PokemonDetail[] = [];
    try {
        items = JSON.parse(fs.readFileSync(path.join(__dirname, 'pokemonDetailsArray.json'), 'utf8'));
    } catch (e) {
        console.log('fixtures error', e);
    }

    if (!items) {
        return;
    }

    items.forEach(async (item) => {
        try {
            await Pokemon.insert({
                name: item.name,
                pokeApiId: item.id,
                species: item.species.name,
                height: item.height,
                weight: item.weight,
                baseExperience: item.base_experience,
            });
        } catch (err) {
            console.log('could not insert item:');
            console.log(item);
            console.log(err);
        }
    });
}

export const addTestUsers = async (): Promise<void> => {
    let items: { name: string; password: string; email: string }[] = [];
    try {
        items = JSON.parse(fs.readFileSync(path.join(__dirname, 'testUsers.json'), 'utf8'));
    } catch (e) {
        console.log('fixtures error', e);
    }

    if (!items || !items.length) return;
    items.forEach(async (i) => {
        try {
            i.password = await hash(i.password, 12);
            await User.insert(i);
        } catch (err) {
            console.log('Failed to insert User: ');
            console.log(i);
        }
    });
};

(async () => {
    await createConnection();
    console.log('=========== Started Seeding ===========\n');
    await loadPokemonDetails();
    await addTestUsers();
    console.log('\n=========== Finished seeding ===========');
})();
