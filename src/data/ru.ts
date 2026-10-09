import * as en from './en';

export const site = {
  ...en.site,
  language: 'ru',
  description:
    'Личное пространство для всего, что я создаю, поддерживаю и над чем работаю. Проекты, немного обо мне и где меня найти.',
  skipLink: 'Перейти к содержимому',
};

export const introduction = {
  greeting: 'Опа, незнакомец!',
  heading: 'Я Wechirok.',
  description:
    'Это моё личное пространство для всего, что я создаю, поддерживаю и над чем работаю.',
};

export const navigation = {
  label: 'Разделы',
  home: 'На главную',
};

export const sections = {
  about: {
    title: 'Обо мне',
    lead: 'Понемногу занимаюсь всем подряд.',
    description: 'Немного о Wechirok и о том, чем я занимаюсь.',
    paragraphs: [
      'Я Wechirok, иногда также известный как Katzeyoru. Занимаюсь системным администрированием, изучаю программное обеспечение и инфраструктуру. Люблю разбираться в том, как всё устроено, пробовать новое и применять это в своих проектах.',
      'Создаю и поддерживаю личные проекты и домашнюю серверную инфраструктуру. Объединяю сервисы, ботов и игровые серверы в продуманную систему, уделяя внимание их настройке, стабильности и резервному копированию. Работаю над игровыми модификациями и модпаками для таких игр, как Minecraft; участвую в различных украинских локализациях. Ещё изредка занимаюсь редактированием фото, видео и аудио.',
      'В работе с кодом и логикой использую LLM для обучения и помощи в разработке, обращаюсь к документации и вики. Часто помогает и сообщество: делится опытом, подсказывает решения и помогает воплотить идеи в жизнь через обычное общение. Код разбираю и проверяю, чтобы понимать, что сделано и как это работает. Для локализаций, написания документации и создания ассетов использование ИИ исключено.',
    ],
  },
  work: {
    title: 'Чем занимаюсь',
    lead: 'То, чему я уделяю время.',
    description:
      'Системное администрирование, программное обеспечение, локализация, дизайн, видео и аудио.',
    paragraphs: [
      'Несколько направлений, к которым я постоянно возвращаюсь в своих проектах и увлечениях.',
    ],
  },
  projects: {
    title: 'Проекты',
    lead: 'То, что я создаю и поддерживаю.',
    description:
      'Моды, модпаки для Minecraft и инструменты для сообществ от Wechirok.',
    paragraphs: ['Личные проекты, моддинг и несколько инструментов.'],
  },
  links: {
    title: 'Ссылки',
    lead: 'Где ещё меня найти в интернете.',
    description: 'Публичные профили и места, где можно найти Wechirok онлайн.',
    paragraphs: ['Мои профили, проекты и способы связаться со мной.'],
  },
};

const workCopy = {
  server: {
    title: 'Системы и инфраструктура',
    description:
      'Администрирование Linux, серверная инфраструктура, автоматизация и базы данных.',
  },
  'code-xml': {
    title: 'Программное обеспечение и Minecraft',
    description:
      'Небольшие инструменты, интеграции с Discord, моды, модпаки и серверный контент для Minecraft.',
  },
  languages: {
    title: 'Локализация',
    description:
      'Участие в переводах программного обеспечения, чтобы проекты были доступны большему числу людей.',
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

const projectCopy = {
  'Renice Cubed': {
    category: 'Модпак',
    description:
      'Модпак на Fabric с улучшениями игрового процесса для более плавной и приятной игры в Minecraft.',
  },
  'Renice Squared': {
    category: 'Модпак',
    description:
      'Вариация Renice Cubed без функций, которые дают игрокам преимущество.',
  },
  'Renice Shot': {
    category: 'Мод',
    description:
      'Клиентский мод на Fabric для создания скриншотов Minecraft в высоком разрешении.',
  },
  'Better Selective Combat': {
    category: 'Мод',
    description:
      'Мод для Minecraft, который позволяет выбрать оружие, на которое не должен влиять Better Combat.',
  },
  Shelley: {
    category: 'Инструмент для сообщества',
    description: 'Discord-бот, созданный для нужд частного сообщества.',
  },
  'SMP & Creative': {
    category: 'Серверный контент',
    description:
      'Контент сервера Minecraft, созданный для частного сообщества.',
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
  GitHub: 'Код, проекты и обсуждение проблем.',
  Discord: 'Место, где можно со мной связаться.',
  Steam: 'Мой профиль Steam.',
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
  heading: 'Здесь ничего нет, незнакомец.',
  description: 'Возможно, страница переехала или в адресе есть ошибка.',
  link: 'Назад в моё личное пространство',
};

export const preferences = {
  language: 'Язык',
  theme: 'Тема',
  dark: 'Тёмная',
  light: 'Светлая',
};
