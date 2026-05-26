import * as migration_20260526_180203_homepage_global from './20260526_180203_homepage_global';

export const migrations = [
  {
    up: migration_20260526_180203_homepage_global.up,
    down: migration_20260526_180203_homepage_global.down,
    name: '20260526_180203_homepage_global'
  },
];
