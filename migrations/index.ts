import * as migration_20260719_083852_initial from './20260719_083852_initial';
import * as migration_20260719_094159_drop_global_promos from './20260719_094159_drop_global_promos';

export const migrations = [
  {
    up: migration_20260719_083852_initial.up,
    down: migration_20260719_083852_initial.down,
    name: '20260719_083852_initial',
  },
  {
    up: migration_20260719_094159_drop_global_promos.up,
    down: migration_20260719_094159_drop_global_promos.down,
    name: '20260719_094159_drop_global_promos',
  },
];
