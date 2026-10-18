import type { ProjectLink } from '../lib/project-downloads';
import type { projects } from './en';

// Public project IDs verified against each platform's API.
export const projectLinks: Record<
  (typeof projects)[number]['name'],
  readonly ProjectLink[]
> = {
  'Renice Cubed': [
    {
      platform: 'Modrinth',
      url: 'https://modrinth.com/modpack/renice-cubed',
      downloads: { provider: 'modrinth', id: 'Y9WA7rNf' },
    },
    {
      platform: 'CurseForge',
      url: 'https://www.curseforge.com/minecraft/modpacks/renice-cubed',
      downloads: { provider: 'curseforge', id: '1535996' },
    },
  ],
  'Renice Squared': [
    {
      platform: 'Modrinth',
      url: 'https://modrinth.com/modpack/renice-squared',
      downloads: { provider: 'modrinth', id: 'Qz0zmdeC' },
    },
    {
      platform: 'CurseForge',
      url: 'https://www.curseforge.com/minecraft/modpacks/renice-squared',
      downloads: { provider: 'curseforge', id: '1536330' },
    },
  ],
  'Renice Shot': [
    {
      platform: 'Modrinth',
      url: 'https://modrinth.com/mod/renice-shot',
      downloads: { provider: 'modrinth', id: 'ZDCwiIc3' },
    },
    {
      platform: 'CurseForge',
      url: 'https://www.curseforge.com/minecraft/mc-mods/renice-shot',
      downloads: { provider: 'curseforge', id: '1655703' },
    },
  ],
  'Better Selective Combat': [
    {
      platform: 'Modrinth',
      url: 'https://modrinth.com/mod/better-selective-combat',
      downloads: { provider: 'modrinth', id: 'ARaBurjl' },
    },
    {
      platform: 'CurseForge',
      url: 'https://www.curseforge.com/minecraft/mc-mods/better-selective-combat',
      downloads: { provider: 'curseforge', id: '1664386' },
    },
  ],
  Nekogenix: [],
  Shelley: [],
  'SMP & Creative': [],
};
