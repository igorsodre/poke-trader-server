import axios from 'axios';
import fs from 'fs';
import path from 'path';

const API_URL = 'https://pokeapi.co/api/v2/pokemon';
export interface PokemonDetail {
    base_experience: number;
    id: number;
    name: string;
    height: number;
    weight: number;
    species: {
        name: string;
    };
}
export const fetchAndGeneratePokemonJson = async (): Promise<void> => {
    let pokemonNamesArray: { name: string; url: string }[] = [];
    let url = API_URL;
    const yes = true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let result: any;
    while (yes) {
        try {
            result = await axios.get(url);
        } catch (err) {
            console.log('deu erro na url: ' + url);
            console.log(err);
        }
        if (!result || !result.data) break;
        if (result && result.data && result.data.results) {
            pokemonNamesArray = pokemonNamesArray.concat(result.data.results);
        }

        if (result && result.data && result.data.next) url = result.data.next;
        else break;
    }

    console.log('Recuperei todos os pokemons');

    fs.writeFile(
        path.join(__dirname, 'pokemonNamesArray.json'),
        JSON.stringify(pokemonNamesArray, null, '  '),
        (err) => {
            if (err) {
                console.log('Deu erro');
                return console.log(err);
            }
            console.log('deu certo: pokemonNamesArray.json');
        },
    );

    const pokemonDetailsArray: PokemonDetail[] = [];
    for (const item of pokemonNamesArray) {
        try {
            result = await axios.get(item.url);
        } catch (err) {
            console.log(err);
        }
        if (result && result.data) {
            pokemonDetailsArray.push({
                base_experience: result.data.base_experience,
                id: result.data.id,
                name: result.data.name,
                height: result.data.height,
                weight: result.data.weight,
                species: result.data.species,
            });
        }
    }
    fs.writeFile(
        path.join(__dirname, 'pokemonDetailsArray.json'),
        JSON.stringify(pokemonDetailsArray, null, '  '),
        (err) => {
            if (err) {
                console.log('Deu erro');
                return console.log(err);
            }
            console.log('deu certo: pokemonNamesArray.json');
        },
    );
};
