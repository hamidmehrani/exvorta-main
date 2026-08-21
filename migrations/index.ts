import * as migration_20260819_074101 from './20260819_074101';
import * as migration_20260819_085437_schema_update from './20260819_085437_schema_update';

export const migrations = [
  {
    up: migration_20260819_074101.up,
    down: migration_20260819_074101.down,
    name: '20260819_074101',
  },
  {
    up: migration_20260819_085437_schema_update.up,
    down: migration_20260819_085437_schema_update.down,
    name: '20260819_085437_schema_update'
  },
];
