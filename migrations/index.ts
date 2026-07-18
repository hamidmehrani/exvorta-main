import * as migration_20260718_130453_initial from './20260718_130453_initial';

export const migrations = [
  {
    up: migration_20260718_130453_initial.up,
    down: migration_20260718_130453_initial.down,
    name: '20260718_130453_initial'
  },
];
