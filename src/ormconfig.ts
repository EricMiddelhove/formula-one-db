import { DataSourceOptions } from 'typeorm';

const env = process.env.NODE_ENV || 'dev';

let entities = [];
let migrations = [];
let subscribers = [];

switch (env) {
  case 'production':
    entities = ['dist/models/**/*.{js,ts}'];
    migrations = ['dist/migration/**/*.{js,ts}'];
    subscribers = ['dist/subscriber/**/*.{js,ts}'];
    break;
  case 'dev':
  default:
    entities = ['src/models/**/*.{js,ts}'];
    migrations = ['src/migration/**/*.{js,ts}'];
    subscribers = ['src/subscriber/**/*.{js,ts}'];
    break;
}

const ormConfig: DataSourceOptions = {
  type: 'mssql',
  host: 'formula-one-db.database.windows.net',
  username: 'eric',
  password: 'p64iQX!Sb!jAELt',
  database: 'formula-one-db',
  synchronize: true,
  logging: false,
  options: {
    encrypt: true,
  },
  entities,
  migrations,
  subscribers,
};

export default ormConfig;