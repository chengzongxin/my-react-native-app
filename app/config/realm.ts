import { createRealmContext } from '@realm/react';
import { Movie } from '../models/MovieSchema';

export const RealmContext = createRealmContext({
  schema: [Movie],
  schemaVersion: 1,
  deleteRealmIfMigrationNeeded: true,
  path: 'movieDatabase.realm',
  inMemory: false,
  disableFormatUpgrade: true
}); 