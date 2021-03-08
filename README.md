# Poke trader

Place where you can add pokemons to your pokedex and trade pokemons with other users.

Link for the poke-trader-web: https://poke-trader-web.web.app

Link for the poke-trader-server: https://poke-trade-server.herokuapp.com

## Changes on the usage of the poke api

I decided to store a subset of the poke api inside the database because I found the format of its output to be very cumbersome to work with.
Since the poke trader project is consisted of a react app + an express server, all comunications is made through API calls to the backend, which I consider to fulfil the intended purposes in using the poke api.
The script to fetch, format and store the data used can found in the file: `src/scripts/scriptToFetchAllPokemonsAndStats.ts`.

## Stack

- Typescript
- Node + express + typeorm
- postgress
- react (frontend repo: https://github.com/igorsodre/poke-trader-web)

## Quick (recomended) postgress database setup

```
$ sudo su - postgres
$ psql
CREATE ROLE application_user WITH SUPERUSER CREATEDB CREATEROLE LOGIN ENCRYPTED PASSWORD 'application_user';
\q
$ exit
$ psql -U application_user -d postgres -h 127.0.0.1 -W
CREATE database application_database
```

## Enviroment variables to set in you .env file (change the values)

```
DATABASE_URL=postgres://example_user:example_password@localhost:5432/example_database
TEST_DATABASE_URL=postgres://application_user:application_user@localhost:5432/application_database_test
JWT_ACCESS_SECRET=super_long_string_of_random_caracters
JWT_REFRESH_SECRET=super_long_string_of_random_caracters
WEB_ORIGIN=http://localhost:3000
```

## Migrations

To generate migrations after modifications on entities:

`npm run typeorm migration:generate -- -n migrationName`

To run the migrations:

`npm run typeorm migration:run`

## Tests

to run the tests:

```
npm test
```
