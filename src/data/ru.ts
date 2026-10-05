import * as en from './en';

export const site = {
  ...en.site,
  language: 'ru',
  title: 'Wechirok — Личное пространство',
  description:
    'Личное пространство для всего, что я создаю, поддерживаю и над чем работаю. Проекты, немного обо мне и где меня найти.',
  skipLink: 'Перейти к содержимому',
};

export const introduction = {
  greeting: 'Как дела, незнакомец?',
  heading: 'Я Wechirok.',
  description:
    'Это моё личное пространство для всего, что я создаю, поддерживаю и над чем работаю.',
  hintBefore: 'Введи ',
  hintAfter: ', чтобы увидеть доступные команды.',
};

export const interfaceCopy = {
  commandLabel: 'Введи команду',
  placeholder: 'Твои команды сюда, пожалуйста :)',
  submit: 'Отправить',
  historyLabel: 'Разговор',
  userLabel: 'Ты',
  responseLabel: 'Wechirok',
  helpTitle: 'Несколько способов осмотреться.',
  helpDescription: 'Введи команду или выбери одну ниже.',
  unknownBefore: 'Я не знаю команды «',
  unknownAfter: '». Попробуй help, чтобы увидеть доступные команды.',
  cleared: 'Разговор очищен.',
  clearHint: 'Куда дальше? Введи «help», чтобы увидеть команды.',
  noScript:
    'Для разговора нужен JavaScript. Также можно прочитать текстовые страницы:',
};

export const sections = {
  about: {
    title: 'Обо мне',
    lead: 'Понемногу занимаюсь всем подряд.',
    description: 'Немного о Wechirok и о том, чем я занимаюсь.',
    paragraphs: [
      'Я Wechirok, иногда также известный как Katzeyoru. Я системный администратор (или, по крайней мере, пытаюсь им быть), которому интересно, как программное обеспечение, сервисы и инфраструктура работают вместе.',
      'Я создаю и поддерживаю личные проекты, работаю над модами и модпаками для Minecraft и участвую в локализации программного обеспечения. Ещё занимаюсь графическим дизайном, редактированием фото, видео и аудио.',
      'Я делаю это из любопытства и для людей рядом со мной. Это пространство объединяет всё это вместе с местами, где меня можно найти в интернете.',
      'Я из тех лохов, которые хотят всего добиться лёгким путём. Использую AI для кода (даже для этого сайта, лол), а потом понимаю, что весь этот подход — дерьмо, и в итоге исправляю всё сам. Это превращается в ночи исследований и переделок, пока не получу хороший результат. Так что я противоречу сам себе и всё равно иду тяжёлым путём. Для меня важно получить отличный результат. Похоже, просто сначала я должен пройти все девять кругов ада.',
    ],
  },
  work: {
    title: 'Занятия',
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
    paragraphs: [
      'Личные проекты, работа с Minecraft и несколько инструментов для частного сообщества.',
    ],
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
      'Администрирование Linux, серверная инфраструктура, автоматизация и базы данных. Чтобы сервисы оставались организованными и полезными.',
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

export const commandDescriptions = {
  help: 'Посмотреть доступные команды.',
  about: 'Немного обо мне.',
  work: 'То, чему я уделяю время.',
  projects: 'То, что я создаю и поддерживаю.',
  links: 'Найти меня где-нибудь ещё.',
  clear: 'Очистить этот разговор.',
};

export const preferences = {
  language: 'Язык',
  theme: 'Тема',
  dark: 'Тёмная',
  light: 'Светлая',
};
