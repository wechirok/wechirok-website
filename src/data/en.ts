export const site = {
  name: 'Wechirok',
  language: 'en',
  title: 'Wechirok',
  description:
    'Everything you wanted (and didn’t want) to know about me and my projects!',
  skipLink: 'Skip to content',
};

export const introduction = {
  greeting: 'Hello there!',
  heading: "I'm Artur Vechir",
  description: 'Building projects and maintaining systems.',
};

export const navigation = {
  label: 'Explore',
  menu: 'Menu',
  home: 'Home',
};

export const sections = {
  projects: {
    title: 'Projects',
    description: 'Minecraft mods, modpacks and community tools by Wechirok.',
    paragraphs: ['Personal projects, modding, and a few tools.'],
  },
  work: {
    title: 'What I do',
    description:
      'System administration, software, localization, design, video and audio.',
    paragraphs: [
      'A few areas I keep coming back to through my own projects and hobbies.',
    ],
  },
  about: {
    title: 'About me',
    description: 'A little about Wechirok and the things I spend my time on.',
    paragraphs: [
      "I'm Artur Vechir, sometimes also known as Wechirok / Katzeyoru. My interests revolve around sysadmin work, software, and infrastructure, mostly out of curiosity about how things work, a desire to try something new, and finding ways to put what I've learned into my own projects.",
      "Much of my experience comes from personal projects and maintaining my own homelab. This includes self-hosted services, bots, and game servers, with attention to how everything is set up, configured, maintained, and backed up. Outside of infrastructure, there's also Minecraft modding and modpacks, contributions to Ukrainian localization projects, and occasional photo, video, and audio editing.",
    ],
  },
} as const;

export type SectionName = keyof typeof sections;

export const translationContributions = {
  title: 'My translation contributions',
  description: 'I contribute to Ukrainian localization for a few projects.',
  projects: [
    {
      name: 'Prism Launcher',
      platform: 'Weblate',
      category: 'Launcher',
      description:
        'An open-source Minecraft launcher for managing instances, accounts and mods.',
      url: 'https://hosted.weblate.org/projects/prismlauncher/launcher/',
    },
    {
      name: 'Fabulously Optimized',
      platform: 'Crowdin',
      category: 'Modpack',
      description:
        'A Minecraft modpack focused on performance and graphics improvements, aka an OptiFine alternative.',
      url: 'https://crowdin.com/project/fabulously-optimized',
    },
  ],
} as const;

export const toolkit = {
  title: 'Toolkit',
  description: 'What I’ve used / still use today.',
  items: [
    {
      technologies: [{ name: 'Java', icon: 'java' }],
      details: 'Fabric, Forge, NeoForge, Paper, Velocity',
    },
    {
      technologies: [{ name: 'JavaScript', icon: 'javascript' }],
      details: 'Astro, TypeScript, Vue, Nuxt',
    },
    {
      technologies: [{ name: 'Python 3', icon: 'python' }],
      details: 'discord.py, aiohttp, Pydantic',
    },
    {
      technologies: [{ name: 'C#', icon: 'csharp' }],
      details: 'SCP SL plugins: EXILED, LabAPI, Harmony',
    },
    {
      technologies: [{ name: 'HTML5', icon: 'html5' }],
      details: '',
    },
    {
      technologies: [{ name: 'CSS3', icon: 'css3' }],
      details: '',
    },
    {
      technologies: [
        { name: 'PostgreSQL', icon: 'postgresql' },
        { name: 'SQLite', icon: 'sqlite' },
        { name: 'MySQL', icon: 'mysql' },
      ],
      details: '',
    },
    {
      technologies: [{ name: 'Blender', icon: 'blender' }],
      details: '',
    },
    {
      technologies: [{ name: 'Blockbench', icon: 'blockbench' }],
      details: '',
    },
    {
      technologies: [{ name: 'Aseprite', icon: 'aseprite' }],
      details: '',
    },
    {
      technologies: [{ name: 'Illustrator', icon: 'adobeillustrator' }],
      details: '',
    },
    {
      technologies: [{ name: 'Photoshop', icon: 'adobephotoshop' }],
      details: '',
    },
    {
      technologies: [{ name: 'Premiere', icon: 'adobepremierepro' }],
      details: '',
    },
    {
      technologies: [{ name: 'After Effects', icon: 'adobeaftereffects' }],
      details: '',
    },
    {
      technologies: [{ name: 'Audition', icon: 'adobeaudition' }],
      details: '',
    },
  ],
} as const;

export const workAreas = [
  {
    title: 'Systems & infrastructure',
    icon: 'server',
    description:
      'Linux administration, server infrastructure, automation and databases.',
  },
  {
    title: 'Software & modding',
    icon: 'code-xml',
    description:
      'Small tools, Discord integrations, Minecraft mods, modpacks and server content.',
  },
  {
    title: 'Localization',
    icon: 'languages',
    description:
      'Contributing to software translations into Ukrainian so projects are accessible to more people.',
  },
  {
    title: 'Design & media',
    icon: 'palette',
    description:
      'Graphic design, photo and poster editing, video editing, animation and audio processing.',
  },
] as const;

export const projectActivity = {
  present: 'present',
};

export const projectAttribution = {
  forkOf: 'A fork of',
};

export const projectActions = {
  website: 'Website',
  wiki: 'Wiki',
  repository: 'Repository',
  downloads: 'Downloads',
  lastAvailable: 'Last available count',
  loading: 'Loading download count',
  unavailable: 'Unavailable',
};

export const projects = [
  {
    name: 'Nekogenix',
    startYear: '2026',
    category: 'Mod',
    description:
      'A NeoForge mod that gives you a cat’s abilities and biological traits, changing how you experience Minecraft and opening up a completely different perspective on the game. It also adds laboratory equipment for creating the injection that starts your transformation. I maintain the project with my best friend, who is also a fellow dev. I also develop the mod’s website and write its wiki.',
    website: 'https://nekogenix.github.io/',
    wiki: 'https://nekogenix.github.io/wiki/',
    url: 'https://github.com/nekogenix/nekogenix-mod',
  },
  {
    name: 'Renice Shot',
    startYear: '2026',
    category: 'Mod',
    description:
      'High-resolution Minecraft screenshots with configurable output sizes, formats and HUD visibility. I adapt the Fabric mod to new game versions, fix issues in the original and add useful',
    featureLabel: 'new features',
    featureUrl: 'https://github.com/wechirok/renice-shot/issues/11',
    upstream: {
      name: 'Fabrishot',
      url: 'https://github.com/ramidzkh/fabrishot',
    },
    url: 'https://github.com/wechirok/renice-shot',
  },
  {
    name: 'Better Selective Combat',
    startYear: '2026',
    category: 'Mod',
    description:
      'Weapon-by-weapon control over Better Combat, with personal toggles and server commands. I built the selection and configuration features for players and administrators, then expanded support across Minecraft versions and the Fabric, Forge and NeoForge loaders.',
    url: 'https://github.com/wechirok/better-selective-combat',
  },
  {
    name: 'Renice Cubed',
    startYear: '2024',
    category: 'Modpack',
    description:
      'A Fabric modpack combining performance and graphics improvements with building tools and everyday conveniences. As its maintainer, I choose and configure the mods, tune keybindings, resolve compatibility issues and prepare releases for the latest game versions. I also look after the project’s wiki.',
    wiki: 'https://renice-cubed.gitbook.io/wiki',
    url: 'https://github.com/ReniceMC/renice-cubed',
  },
  {
    name: 'Renice Squared',
    startYear: '2026',
    category: 'Modpack',
    description:
      'My official fork of Renice Cubed leaves out features that give players a gameplay advantage while retaining performance and visual improvements. I adapt the mod selection and defaults, update dependencies and prepare releases alongside Cubed for the supported Minecraft versions.',
    url: 'https://github.com/ReniceMC/renice-squared',
  },
  {
    name: 'Shelley',
    startYear: '2025',
    category: 'Discord Bot',
    description:
      'Quite literally the soul of the Discord server for one of the private communities I run. Shelley awards points for text and voice activity; in our community, its voice activity tracking has worked more efficiently and reliably than larger bots. There are also leaderboards and a dedicated bridge between Minecraft chat and Discord. It automates plenty of other things too, but the full list would be far too long to put here.',
    url: 'https://github.com/METHADRENALINE/Shelley',
  },
  {
    name: 'SMP & Creative',
    startYear: '2023',
    category: 'PaperMC plugins, resources',
    description:
      'Custom plugins and a resource pack for a private Minecraft server network. I run the whole network myself, on hardware at home, and take care of its setup, maintenance and backups. I set up chat between the servers and connected it to Discord through Shelley, so people can talk whether they’re in-game or on Discord. I designed shared PostgreSQL storage for player preferences and cosmetic data, using transactions to keep related changes consistent. The plugins are also kept compatible with server updates.',
    url: 'https://github.com/METHADRENALINE/SMP-Creative',
  },
] as const;

// Public profile URLs from https://github.com/wechirok/Wechirok/blob/main/README.md.
export const profiles = [
  {
    name: 'GitHub',
    icon: 'github',
    description: 'Code, projects and issues.',
    url: 'https://github.com/wechirok',
  },
  {
    name: 'Modrinth',
    icon: 'modrinth',
    description: 'Modding projects.',
    url: 'https://modrinth.com/user/Wechirok',
  },
  {
    name: 'CurseForge',
    icon: 'curseforge',
    description: 'Another place for modding projects.',
    url: 'https://www.curseforge.com/members/wechirok',
  },
  {
    name: 'Crowdin',
    icon: 'crowdin',
    description: 'Localization and translation contributions.',
    url: 'https://crowdin.com/profile/katzeyoru',
  },
  {
    name: 'Weblate',
    icon: 'weblate',
    description:
      'Another place for localization and translation contributions.',
    url: 'https://hosted.weblate.org/user/wechirok/',
  },
  {
    name: 'Discord',
    icon: 'discord',
    description: 'A place to get in touch.',
    url: 'https://discord.com/users/526310915549691905',
  },
] as const;

export const notFound = {
  title: 'Page not found',
  heading: 'Nothing here, stranger',
  description:
    'That page may have moved, or the address might be a little off.',
  link: 'Back to my personal space',
};

export const preferences = {
  language: 'Language',
  theme: 'Theme',
  dark: 'Dark',
  light: 'Light',
};
