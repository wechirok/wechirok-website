import * as en from './en';

export const site = {
  ...en.site,
  language: 'de',
  description:
    'Meine Ecke im Netz für alles, was ich entwickle, pflege und woran ich arbeite. Projekte, ein bisschen über mich und wo du mich findest.',
  skipLink: 'Zum Inhalt springen',
};

export const introduction = {
  greeting: 'Hallo!',
  heading: 'Ich bin Artur Vechir',
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
      'Ich bin Artur Vechir, manchmal auch als Wechirok / Katzeyoru bekannt. Meine Interessen drehen sich um Systemadministration, Software und Infrastruktur, vor allem aus Neugier darauf, wie Dinge funktionieren, dem Wunsch, etwas Neues auszuprobieren, und der Suche nach Möglichkeiten, das Gelernte in eigenen Projekten anzuwenden.',
      'Ein großer Teil meiner Erfahrung stammt aus eigenen Projekten und dem Betrieb meines Homelabs. Dazu gehören selbst gehostete Dienste, Bots und Spielserver, wobei ich darauf achte, wie alles eingerichtet, konfiguriert, gewartet und gesichert wird. Neben Infrastruktur beschäftige ich mich auch mit Minecraft-Modding und Modpacks, wirke an ukrainischen Lokalisierungsprojekten mit und bearbeite gelegentlich Fotos, Videos und Audio.',
    ],
  },
  work: {
    title: 'Was ich mache',
    description:
      'Systemadministration, Software, Lokalisierung, Design, Video und Audio.',
    paragraphs: [
      'Ein paar Themen, zu denen ich bei meinen Projekten und Hobbys immer wieder zurückkomme.',
    ],
  },
  projects: {
    title: 'Projekte',
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
  title: 'Meine Übersetzungsbeiträge',
  description:
    'Bei einigen Projekten helfe ich mit der ukrainischen Lokalisierung.',
  projects: en.translationContributions.projects.map((project) => ({
    ...project,
    ...translationCopy[project.name],
  })),
};

export const toolkit = {
  ...en.toolkit,
  title: 'Werkzeuge',
  description: 'Was ich früher verwendet habe / heute verwende.',
  items: en.toolkit.items.map((item) =>
    item.technologies[0].icon === 'csharp'
      ? {
          ...item,
          details: 'Plugins für SCP SL: EXILED, LabAPI, Harmony',
        }
      : item,
  ),
};

const workCopy = {
  server: {
    title: 'Systeme & Infrastruktur',
    description:
      'Linux-Administration, Serverinfrastruktur, Automatisierung und Datenbanken.',
  },
  'code-xml': {
    title: 'Software & Modding',
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

export const projectAttribution = {
  forkOf: 'Ein Fork von',
};

export const projectActions = {
  website: 'Website',
  wiki: 'Wiki',
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
      'Ein Fabric-Modpack, das Performance- und Grafikverbesserungen mit Bauhilfen und mehr Komfort beim Spielen verbindet. Als Maintainer wähle ich die Mods aus, konfiguriere sie, passe Tastenbelegungen an, behebe Kompatibilitätsprobleme und bereite Releases für die neuesten Spielversionen vor. Auch das Wiki des Projekts betreue ich.',
  },
  'Renice Squared': {
    category: 'Modpack',
    description:
      'Mein offizieller Fork von Renice Cubed verzichtet auf Funktionen, die Spielern einen spielerischen Vorteil verschaffen, und behält Performance- und Grafikverbesserungen bei. Dafür passe ich die Modauswahl und Standardeinstellungen an, aktualisiere Abhängigkeiten und bereite parallel zu Cubed Releases für die unterstützten Minecraft-Versionen vor.',
  },
  'Renice Shot': {
    category: 'Mod',
    description:
      'Hochauflösende Minecraft-Screenshots mit einstellbarer Ausgabegröße, verschiedenen Formaten und optional ausgeblendetem HUD. Ich passe den Fabric-Mod an neue Spielversionen an, behebe Probleme des Originals und ergänze',
    featureLabel: 'nützliche neue Funktionen',
  },
  'Better Selective Combat': {
    category: 'Mod',
    description:
      'Better Combat für jede Waffe einzeln steuern, mit persönlichen Schaltern und Serverbefehlen. Ich habe die Auswahl- und Einstellungsfunktionen für Spieler und Administratoren umgesetzt und anschließend die Unterstützung auf weitere Minecraft-Versionen sowie Fabric, Forge und NeoForge ausgeweitet.',
  },
  Nekogenix: {
    category: 'Mod',
    description:
      'Ein NeoForge-Mod, der dir die Fähigkeiten und biologischen Eigenschaften einer Katze verleiht. Dadurch verändert sich dein Minecraft-Erlebnis und du entdeckst das Spiel aus einer völlig anderen Perspektive. Mit Laborausrüstung stellst du die Injektion her, die deine Verwandlung auslöst. Ich betreue das Projekt gemeinsam mit meinem besten Freund, der ebenfalls Entwickler ist. Außerdem entwickle ich die Website des Mods und schreibe das Wiki dazu.',
  },
  Shelley: {
    category: 'Discord-Bot',
    description:
      'Buchstäblich die Seele des Discord-Servers einer der privaten Communitys, die ich betreue. Shelley vergibt Punkte für Aktivität in Text- und Sprachkanälen; bei uns hat die Erfassung der Sprachaktivität effizienter und zuverlässiger funktioniert als bei größeren Bots. Dazu kommen Ranglisten und eine eigene Verbindung zwischen Minecraft-Chat und Discord. Vieles andere läuft ebenfalls automatisch, aber die vollständige Liste wäre für diese Seite viel zu lang.',
  },
  'SMP & Creative': {
    category: 'PaperMC-Plugins, Ressourcen',
    description:
      'Eigene Plugins und ein Ressourcenpaket für ein privates Minecraft-Servernetzwerk. Das gesamte Netzwerk betreibe ich selbst auf Hardware bei mir zu Hause und kümmere mich um Einrichtung, Wartung und Backups. Ich habe den Chat zwischen den Servern eingerichtet und über Shelley mit Discord verbunden, damit man sich im Spiel und auf Discord miteinander unterhalten kann. Für Spielereinstellungen und kosmetische Daten habe ich eine gemeinsame PostgreSQL-Datenhaltung entworfen, in der Transaktionen zusammengehörige Änderungen konsistent halten. Die Plugins werden außerdem an Serverupdates angepasst.',
  },
} satisfies Record<
  (typeof en.projects)[number]['name'],
  { category: string; description: string; featureLabel?: string }
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
  heading: 'Hier gibt’s nichts, Fremder',
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
