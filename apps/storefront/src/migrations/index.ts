import * as migration_20260526_180203_homepage_global from './20260526_180203_homepage_global';
import * as migration_20260526_185510_homepage_sections from './20260526_185510_homepage_sections';

export const migrations = [
  {
    up: migration_20260526_180203_homepage_global.up,
    down: migration_20260526_180203_homepage_global.down,
    name: '20260526_180203_homepage_global',
  },
  {
    up: migration_20260526_185510_homepage_sections.up,
    down: migration_20260526_185510_homepage_sections.down,
    name: '20260526_185510_homepage_sections'
  },
];
