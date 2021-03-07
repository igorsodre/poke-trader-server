/* eslint-disable no-undef */
const getEnvType = () => process.env.NODE_ENV;
const getDatabaseUtl = () => ({
    deveplopment: process.env.DATABASE_URL,
    test: process.env.TEST_DATABASE_URL,
    production: process.env.DATABASE_URL,
});

const getEntities = () => (process.env.NODE_ENV === 'production' ? ['dist/entity/**/*.js'] : ['src/entity/**/*.ts']);
const getMigrations = () =>
    process.env.NODE_ENV === 'production' ? ['dist/migration/**/*.js'] : ['src/migration/**/*.ts'];

const getSubscribers = () =>
    process.env.NODE_ENV === 'production' ? ['dist/subscriber/**/*.js'] : ['src/subscriber/**/*.ts'];

module.exports = {
    type: 'postgres',
    url: getDatabaseUtl()[getEnvType()] || process.env.DATABASE_URL,
    dropSchema: getEnvType() === 'test',
    migrationsRun: getEnvType() === 'test',
    entities: getEntities(),
    migrations: getMigrations(),
    subscribers: getSubscribers(),
    cli: {
        entitiesDir: 'src/entity',
        migrationsDir: 'src/migration',
        subscribersDir: 'src/subscriber',
    },
    ssl: true,
    extra: {
        ssl: {
            rejectUnauthorized: false,
        },
    },
};
