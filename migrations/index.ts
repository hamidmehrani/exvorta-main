import * as migration_20260819_074101 from './20260819_074101';
import * as migration_20260819_085437_schema_update from './20260819_085437_schema_update';
import * as migration_20260823_164309 from './20260823_164309';

export const migrations = [
  {
    up: migration_20260819_074101.up,
    down: migration_20260819_074101.down,
    name: '20260819_074101',
  },
  {
    up: migration_20260819_085437_schema_update.up,
    down: migration_20260819_085437_schema_update.down,
    name: '20260819_085437_schema_update',
  },
  {
    up: migration_20260823_164309.up,
    down: migration_20260823_164309.down,
    name: '20260823_164309'
  },
];
