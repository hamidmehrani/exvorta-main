import * as migration_20260719_083852_initial from './20260719_083852_initial';
import * as migration_20260719_094159_drop_global_promos from './20260719_094159_drop_global_promos';
import * as migration_20260719_110000_rate_limits from './20260719_110000_rate_limits';

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
  {
    up: migration_20260719_110000_rate_limits.up,
    down: migration_20260719_110000_rate_limits.down,
    name: '20260719_110000_rate_limits',
  },
];
