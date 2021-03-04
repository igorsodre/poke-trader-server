import fs from 'fs';
import path from 'path';
import { createConnection } from 'typeorm';
import { Pokemon } from './../entity/Pokemon';
import { PokemonDetail } from './scriptToFetchAllPokemonsAndStats';

export async function loadPokemonDetails(): Promise<void> {
    await createConnection();
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

(async () => {
    console.log('=========== Started Seeding ===========\n');
    await loadPokemonDetails();
    console.log('\n=========== Finished seeding ===========');
})();
