import { entityList } from '@jolocom/sdk-storage-typeorm'
// import { ConnectionOptions } from 'typeorm'

const migrations = []

export default ConnectionOptions = {
  type: 'react-native',
  database: 'MyApplicationData',
  location: 'default',
  logging: ['error', 'warn', 'schema'],
  entities: entityList,
  migrations,
  migrationsRun: true,
  synchronize: false,
  cli: {
    migrationsDir: 'src/migrations',
  },
};