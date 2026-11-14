import * as en from './en';

export const site = {
  ...en.site,
  language: 'ru',
  description: 'Всё, что вы хотите и не хотите знать обо мне и моих проектах!',
  skipLink: 'Перейти к содержимому',
};

export const introduction = {
  greeting: 'Приветствую!',
  heading: 'Я Артур Вечир',
  description: 'Создаю проекты и поддерживаю системы.',
};

export const navigation = {
  label: 'Разделы',
  menu: 'Меню',
  home: 'На главную',
};

export const sections = {
  about: {
    title: 'Обо мне',
    description: 'Немного о Wechirok и о том, чем я занимаюсь.',
    paragraphs: [
      'Я Артур Вечир, иногда также известный как Wechirok / Katzeyoru. Мои интересы связаны с системным администрированием, программным обеспечением и инфраструктурой: в основном мне любопытно, как всё работает, хочется попробовать что-то новое и найти способы применить полученные знания в собственных проектах.',
      'Большую часть опыта я получаю благодаря личным проектам и поддержке собственной домашней серверной инфраструктуры. Это самостоятельно размещённые сервисы, боты и игровые серверы, с вниманием к тому, как всё развёрнуто, настроено, обслуживается и резервируется. Помимо инфраструктуры, занимаюсь моддингом Minecraft и модпаками, участвую в проектах украинской локализации и время от времени редактирую фото, видео и аудио.',
    ],
  },
  work: {
    title: 'Чем занимаюсь',
    description:
      'Системное администрирование, программное обеспечение, локализация, дизайн, видео и аудио.',
    paragraphs: [
      'Несколько направлений, к которым я постоянно возвращаюсь в своих проектах и увлечениях.',
    ],
  },
  projects: {
    title: 'Проекты',
    description:
      'Моды, модпаки для Minecraft и инструменты для сообществ от Wechirok.',
    paragraphs: ['Личные проекты, моддинг и несколько инструментов.'],
  },
};

const translationCopy = {
  'Prism Launcher': {
    category: 'Лаунчер',
    description:
      'Лаунчер Minecraft с открытым кодом для управления сборками, учётными записями и модами.',
  },
  'Fabulously Optimized': {
    category: 'Модпак',
    description:
      'Модпак для Minecraft с упором на производительность и улучшение графики, aka альтернатива OptiFine.',
  },
} satisfies Record<
  (typeof en.translationContributions.projects)[number]['name'],
  { category: string; description: string }
>;
export const translationContributions = {
  title: 'Мой вклад в переводы',
  description: 'В некоторых проектах занимаюсь украинской локализацией.',
  projects: en.translationContributions.projects.map((project) => ({
    ...project,
    ...translationCopy[project.name],
  })),
};

export const toolkit = {
  ...en.toolkit,
  title: 'Инструменты',
  description: 'То, чем я пользовался / пользуюсь сейчас.',
  items: en.toolkit.items.map((item) =>
    item.technologies[0].icon === 'csharp'
      ? {
          ...item,
          details: 'Плагины для SCP SL: EXILED, LabAPI, Harmony',
        }
      : item,
  ),
};

const workCopy = {
  server: {
    title: 'Системы и инфраструктура',
    description:
      'Администрирование Linux, серверная инфраструктура, автоматизация и базы данных.',
  },
  'code-xml': {
    title: 'Программное обеспечение и моддинг',
    description:
      'Небольшие инструменты, интеграции с Discord, моды, модпаки и серверный контент для Minecraft.',
  },
  languages: {
    title: 'Локализация',
    description:
      'Участие в переводах программного обеспечения на украинский, чтобы проекты были доступны большему числу людей.',
  },
  palette: {
    title: 'Дизайн и медиа',
    description:
      'Графический дизайн, редактирование фото и постеров, монтаж видео, анимация и обработка аудио.',
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
  present: 'по настоящее время',
};

export const projectAttribution = {
  forkOf: 'Форк',
};

export const projectActions = {
  website: 'Вебсайт',
  wiki: 'Вики',
  repository: 'Репозиторий',
  downloads: 'Скачивания',
  lastAvailable: 'Последнее доступное значение',
  loading: 'Загрузка количества скачиваний',
  unavailable: 'Недоступно',
};

const projectCopy = {
  'Renice Cubed': {
    category: 'Модпак',
    description:
      'Модпак на Fabric, который объединяет улучшения производительности и графики с инструментами для строительства и более удобной игры. Как мейнтейнер, подбираю и настраиваю моды, согласовываю назначения клавиш, устраняю проблемы совместимости и готовлю выпуски для последних версий игры. Также веду вики проекта.',
  },
  'Renice Squared': {
    category: 'Модпак',
    description:
      'Мой официальный форк Renice Cubed без функций, которые дают игрокам игровое преимущество, с сохранением улучшений производительности и графики. Для него адаптирую набор модов и настройки по умолчанию, обновляю зависимости и готовлю выпуски параллельно с Cubed для поддерживаемых версий Minecraft.',
  },
  'Renice Shot': {
    category: 'Мод',
    description:
      'Скриншоты Minecraft в высоком разрешении с выбором размера, формата и видимости HUD. Адаптирую мод на Fabric к новым версиям игры, исправляю проблемы оригинала и добавляю',
    featureLabel: 'новый полезный функционал',
  },
  'Better Selective Combat': {
    category: 'Мод',
    description:
      'Управление Better Combat для каждого оружия отдельно, с персональными переключателями и серверными командами. Я реализовал выбор и настройку оружия для игроков и администраторов, а затем расширил поддержку разных версий Minecraft и загрузчиков Fabric, Forge и NeoForge.',
  },
  Nekogenix: {
    category: 'Мод',
    description:
      'Мод на NeoForge, который наделяет тебя способностями и биологическими особенностями кота, меняя привычный игровой опыт и открывая Minecraft с совершенно другой стороны. Лабораторное оборудование позволяет создать инъекцию, с которой начинается превращение. Поддерживаю проект вместе со своим лучшим другом, который тоже занимается разработкой. Кроме того, разрабатываю вебсайт и пишу вики для мода.',
  },
  Shelley: {
    category: 'Discord-бот',
    description:
      'Буквально душа Discord-сервера одного из приватных сообществ, которыми я управляю. Shelley начисляет баллы за активность в текстовых и голосовых каналах; учёт голосовой активности у нас оказался эффективнее и стабильнее, чем у крупных ботов. Здесь также есть рейтинги и отдельная интеграция чатов Minecraft и Discord. А ещё множество другой автоматизации, о которой я тут не расскажу, потому что полный список получился бы слишком длинным.',
  },
  'SMP & Creative': {
    category: 'Плагины PaperMC, ресурсы',
    description:
      'Собственные плагины и пакет ресурсов для частной сети серверов Minecraft. Всю сеть содержу сам на собственном оборудовании дома: занимаюсь настройкой, обслуживанием и резервным копированием. Настроил чат между серверами и связал его с Discord через Shelley, чтобы можно было общаться и из игры, и из Discord. Для настроек игроков и косметики спроектировал общее хранилище PostgreSQL, где транзакции обеспечивают согласованность связанных изменений. Плагины также адаптирую к обновлениям серверов.',
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
  GitHub: 'Код, проекты и обсуждение проблем.',
  Discord: 'Место, где можно со мной связаться.',
  Crowdin: 'Участие в локализации и переводах.',
  Weblate: 'Ещё одно место для участия в локализации и переводах.',
  Modrinth: 'Моддинг и проекты.',
  CurseForge: 'Ещё одно место для моддинга и проектов.',
} satisfies Record<(typeof en.profiles)[number]['name'], string>;
export const profiles = en.profiles.map((profile) => ({
  ...profile,
  description: profileDescriptions[profile.name],
}));

export const notFound = {
  title: 'Страница не найдена',
  heading: 'Здесь ничего нет, незнакомец',
  description: 'Возможно, страница переехала или в адресе есть ошибка.',
  link: 'Назад в моё личное пространство',
};

export const preferences = {
  language: 'Язык',
  theme: 'Тема',
  dark: 'Тёмная',
  light: 'Светлая',
};
