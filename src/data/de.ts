import * as en from './en';

export const site = {
  ...en.site,
  language: 'de',
  description:
    'Meine Ecke im Netz für alles, was ich entwickle, pflege und woran ich arbeite. Projekte, ein bisschen über mich und wo du mich findest.',
  skipLink: 'Zum Inhalt springen',
};

export const introduction = {
  greeting: 'Wie geht’s denn so?',
  heading: 'Ich bin Artur Vechir.',
  description: 'Ich entwickle Projekte und betreue Systeme.',
};

export const navigation = {
  label: 'Navigation',
  home: 'Startseite',
};

export const sections = {
  about: {
    title: 'Über mich',
    description:
      'Ein bisschen über Wechirok und das, womit ich mich beschäftige.',
    paragraphs: [
      'Ich bin Artur Vechir, manchmal auch als Wechirok / Katzeyoru bekannt. Ich beschäftige mich mit Systemadministration, Software und Infrastruktur. Ich finde gerne heraus, wie Dinge funktionieren, probiere Neues aus und setze es in meinen eigenen Projekten ein.',
      'Ich entwickle und pflege eigene Projekte und meine Serverinfrastruktur zu Hause. Dienste, Bots und Spielserver verbinde ich zu einem durchdachten System und achte dabei auf ihre Konfiguration, Stabilität und Backups. Ich arbeite an Mods und Modpacks für Spiele wie Minecraft und wirke an verschiedenen ukrainischen Lokalisierungen mit. Ab und zu bearbeite ich auch Fotos, Videos und Audiodateien.',
      'Bei der Arbeit mit Code und Logik nutze ich LLMs zum Lernen und als Unterstützung bei der Entwicklung und ziehe Dokumentation und Wikis heran. Oft hilft auch die Community: Sie teilt Erfahrungen, schlägt Lösungen vor und hilft mir, Ideen durch den gemeinsamen Austausch umzusetzen. Ich gehe den Code durch und prüfe ihn, um zu verstehen, was gemacht wurde und wie es funktioniert. Für Lokalisierungen, das Schreiben von Dokumentation und das Erstellen von Assets ist der Einsatz von KI ausgeschlossen.',
    ],
  },
  work: {
    title: 'Was ich mache',
    lead: 'Womit ich meine Zeit verbringe.',
    description:
      'Systemadministration, Software, Lokalisierung, Design, Video und Audio.',
    paragraphs: [
      'Ein paar Themen, zu denen ich bei meinen Projekten und Hobbys immer wieder zurückkomme.',
    ],
  },
  projects: {
    title: 'Projekte',
    lead: 'Was ich entwickle und pflege.',
    description: 'Minecraft-Mods, Modpacks und Community-Tools von Wechirok.',
    paragraphs: ['Eigene Projekte, Modding und ein paar Tools.'],
  },
};

const translationCopy = {
  'Prism Launcher': {
    category: 'Launcher',
    description:
      'Ein quelloffener Minecraft-Launcher zur Verwaltung von Instanzen, Konten und Mods.',
  },
  'Fabulously Optimized': {
    category: 'Modpack',
    description:
      'Ein Minecraft-Modpack mit Fokus auf Performance und Grafikverbesserungen, aka eine OptiFine-Alternative.',
  },
} satisfies Record<
  (typeof en.translationContributions.projects)[number]['name'],
  { category: string; description: string }
>;
export const translationContributions = {
  title: 'Meine Übersetzungsbeiträge.',
  description:
    'Bei einigen Projekten helfe ich mit ukrainischen Lokalisierungen und Übersetzungen.',
  projects: en.translationContributions.projects.map((project) => ({
    ...project,
    ...translationCopy[project.name],
  })),
};

export const toolkit = {
  ...en.toolkit,
  title: 'Werkzeuge',
};

const workCopy = {
  server: {
    title: 'Systeme & Infrastruktur',
    description:
      'Linux-Administration, Serverinfrastruktur, Automatisierung und Datenbanken.',
  },
  'code-xml': {
    title: 'Software & Minecraft',
    description:
      'Kleine Tools, Discord-Integrationen, Minecraft-Mods, Modpacks und Serverinhalte.',
  },
  languages: {
    title: 'Lokalisierung',
    description:
      'Ich helfe bei Softwareübersetzungen ins Ukrainische, damit mehr Menschen die Projekte nutzen können.',
  },
  palette: {
    title: 'Design & Medien',
    description:
      'Grafikdesign, Foto- und Posterbearbeitung, Videoschnitt, Animation und Audiobearbeitung.',
  },
} satisfies Record<
  (typeof en.workAreas)[number]['icon'],
  { title: string; description: string }
>;
export const workAreas = en.workAreas.map((area) => ({
  ...area,
  ...workCopy[area.icon],
}));

export const projectActivity = {
  present: 'heute',
};

export const projectActions = {
  repository: 'Repository',
  downloads: 'Downloads',
  lastAvailable: 'Zuletzt verfügbare Anzahl',
  loading: 'Downloadzahl wird geladen',
  unavailable: 'Nicht verfügbar',
};

const projectCopy = {
  'Renice Cubed': {
    category: 'Modpack',
    description:
      'Ein Fabric-Modpack mit Gameplay-Anpassungen für ein flüssigeres und angenehmeres Minecraft-Erlebnis.',
  },
  'Renice Squared': {
    category: 'Modpack',
    description:
      'Eine Variante von Renice Cubed ohne Funktionen, die Spielern einen Vorteil verschaffen.',
  },
  'Renice Shot': {
    category: 'Mod',
    description:
      'Ein clientseitiger Fabric-Mod für hochauflösende Minecraft-Screenshots.',
  },
  'Better Selective Combat': {
    category: 'Mod',
    description:
      'Ein Minecraft-Mod, mit dem du festlegst, welche Waffen von Better Combat ausgenommen sein sollen.',
  },
  Shelley: {
    category: 'Community-Tool',
    description:
      'Ein Discord-Bot für die Bedürfnisse einer privaten Community.',
  },
  'SMP & Creative': {
    category: 'Serverinhalte',
    description: 'Minecraft-Serverinhalte für eine private Community.',
  },
} satisfies Record<
  (typeof en.projects)[number]['name'],
  { category: string; description: string }
>;
export const projects = en.projects.map((project) => ({
  ...project,
  ...projectCopy[project.name],
}));

const profileDescriptions = {
  GitHub: 'Code, Projekte und Issues.',
  Crowdin: 'Beiträge zu Lokalisierungen und Übersetzungen.',
  Weblate:
    'Noch ein Ort, an dem ich bei Lokalisierungen und Übersetzungen mithelfe.',
  Modrinth: 'Modding-Projekte.',
  CurseForge: 'Noch ein Ort für Modding-Projekte.',
  Discord: 'Hier kannst du mich erreichen.',
} satisfies Record<(typeof en.profiles)[number]['name'], string>;
export const profiles = en.profiles.map((profile) => ({
  ...profile,
  description: profileDescriptions[profile.name],
}));

export const notFound = {
  title: 'Seite nicht gefunden',
  heading: 'Hier gibt’s nichts, Fremder.',
  description:
    'Vielleicht ist die Seite umgezogen oder die Adresse stimmt nicht ganz.',
  link: 'Zurück zu meiner Ecke im Netz',
};

export const preferences = {
  language: 'Sprache',
  theme: 'Darstellung',
  dark: 'Dunkel',
  light: 'Hell',
};
