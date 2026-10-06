export const site = {
  name: 'Wechirok',
  language: 'en',
  title: 'Wechirok — Personal space',
  description:
    'A personal space for the things I build, maintain and work on. Projects, a little about me, and where to find me.',
  skipLink: 'Skip to content',
};

export const introduction = {
  greeting: "What's up, stranger.",
  heading: "I'm Wechirok.",
  description:
    'This is my personal space for things I build, maintain and work on.',
  hintBefore: 'Type ',
  hintAfter: ' to see available commands.',
};

export const interfaceCopy = {
  commandLabel: 'Enter a command',
  placeholder: 'Your commands here, please :)',
  submit: 'Send',
  historyLabel: 'Conversation',
  userLabel: 'You',
  responseLabel: 'Wechirok',
  helpTitle: 'A few ways to explore.',
  helpDescription: 'Type a command or choose one below.',
  unknownBefore: 'I don’t know the command “',
  unknownAfter: '”. Try help to see what’s available.',
  cleared: 'Conversation cleared.',
  clearHint: 'Where next? Type "help" to see the commands.',
  noScript:
    'The conversation needs JavaScript. You can also read the text pages:',
};

export const sections = {
  about: {
    title: 'About',
    lead: 'I do a little bit of this and that.',
    description: 'A little about Wechirok and the things I spend my time on.',
    paragraphs: [
      'I’m Wechirok, sometimes also known as Katzeyoru. I do system administration (or at least I’m trying to), and I learn and make all sorts of things.',
      'I build and maintain personal projects, work on mods and modpacks for games like Minecraft, and sometimes contribute to localization projects. I also occasionally edit photos, video and audio.',
      'I’m one of those people who want everything the easy way. I use AI for code (even this site, lol), then realize the whole approach is shit and end up fixing everything myself. That turns into nights of research and reworking things until I get a good result. So I contradict myself and take the hard way anyway, because however much I want things to be easy and simple, getting a great result matters to me. I just have to go through all nine circles of hell first.',
    ],
  },
  work: {
    title: 'Work',
    lead: 'Things I spend my time on.',
    description:
      'System administration, software, localization, design, video and audio.',
    paragraphs: [
      'A few areas I keep coming back to through my own projects and hobbies.',
    ],
  },
  projects: {
    title: 'Projects',
    lead: 'Things I build and look after.',
    description: 'Minecraft mods, modpacks and community tools by Wechirok.',
    paragraphs: ['Personal projects, modding, and a few tools.'],
  },
  links: {
    title: 'Links',
    lead: 'Elsewhere on the internet.',
    description: 'Public profiles and places to find Wechirok online.',
    paragraphs: ['My profiles, projects and places to get in touch.'],
  },
} as const;

export type SectionName = keyof typeof sections;

export const workAreas = [
  {
    title: 'Systems & infrastructure',
    icon: 'server',
    description:
      'Linux administration, server infrastructure, automation and databases.',
  },
  {
    title: 'Software & Minecraft',
    icon: 'code-xml',
    description:
      'Small tools, Discord integrations, Minecraft mods, modpacks and server content.',
  },
  {
    title: 'Localization',
    icon: 'languages',
    description:
      'Contributing to software translations and helping projects reach more people.',
  },
  {
    title: 'Design & media',
    icon: 'palette',
    description:
      'Graphic design, photo and poster editing, video editing, animation and audio processing.',
  },
] as const;

export const projects = [
  {
    name: 'Renice Cubed',
    category: 'Modpack',
    description:
      'A Fabric modpack focused on gameplay tweaks for a smoother, more enjoyable Minecraft experience.',
    url: 'https://github.com/ReniceMC/renice-cubed',
  },
  {
    name: 'Renice Squared',
    category: 'Modpack',
    description:
      'A variation of Renice Cubed that removes features which give players an advantage.',
    url: 'https://github.com/ReniceMC/renice-squared',
  },
  {
    name: 'Renice Shot',
    category: 'Mod',
    description:
      'A Fabric client mod for taking high-resolution Minecraft screenshots.',
    url: 'https://github.com/wechirok/renice-shot',
  },
  {
    name: 'Better Selective Combat',
    category: 'Mod',
    description:
      'A Minecraft mod that lets you choose which weapons should ignore Better Combat.',
    url: 'https://github.com/wechirok/better-selective-combat',
  },
  {
    name: 'Shelley',
    category: 'Community tool',
    description: 'A Discord bot built for a private community’s needs.',
    url: 'https://github.com/METHADRENALINE/Shelley',
  },
  {
    name: 'SMP & Creative',
    category: 'Server content',
    description: 'Minecraft server content made for a private community.',
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
    name: 'Discord',
    icon: 'discord',
    description: 'A place to get in touch.',
    url: 'https://discord.com/users/526310915549691905',
  },
  {
    name: 'Steam',
    icon: 'steam',
    description: 'My Steam profile.',
    url: 'https://steamcommunity.com/id/wechirok/',
  },
] as const;

export const notFound = {
  title: 'Page not found',
  heading: 'Nothing here, stranger.',
  description:
    'That page may have moved, or the address might be a little off.',
  link: 'Back to my personal space',
};

export const commandDescriptions = {
  help: 'See the available commands.',
  about: 'A little about me.',
  work: 'Things I spend my time on.',
  projects: 'Things I build and maintain.',
  links: 'Find me elsewhere.',
  clear: 'Clear this conversation.',
};

export const preferences = {
  language: 'Language',
  theme: 'Theme',
  dark: 'Dark',
  light: 'Light',
};
