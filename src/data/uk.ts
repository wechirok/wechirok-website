import * as en from './en';

export const site = {
  ...en.site,
  language: 'uk',
  description:
    'Особистий простір для всього, що я створюю, підтримую й над чим працюю. Проєкти, трохи про мене та де мене знайти.',
  skipLink: 'Перейти до вмісту',
};

export const introduction = {
  greeting: 'Ну шо ти?',
  heading: 'Я Wechirok.',
  description:
    'Це мій особистий простір для всього, що я створюю, підтримую й над чим працюю.',
};

export const navigation = {
  label: 'Розділи',
  home: 'На головну',
};

export const sections = {
  about: {
    title: 'Про мене',
    lead: 'Потроху займаюся всім підряд.',
    description: 'Трохи про Wechirok і те, чим я займаюся.',
    paragraphs: [
      'Я Wechirok, іноді також відомий як Katzeyoru. Займаюся системним адмініструванням, вивчаю програмне забезпечення та інфраструктуру. Люблю розбиратися в тому, як усе влаштовано, пробувати нове й застосовувати це у своїх проєктах.',
      'Створюю та підтримую особисті проєкти й домашню серверну інфраструктуру. Об’єдную сервіси, ботів та ігрові сервери в продуману систему, приділяючи увагу їхньому налаштуванню, стабільності та резервному копіюванню. Працюю над ігровими модифікаціями й модпаками для таких ігор, як Minecraft; беру участь у різних українських локалізаціях. Ще зрідка займаюся редагуванням фото, відео та аудіо.',
      'У роботі з кодом і логікою використовую LLM для навчання та допомоги в розробці, звертаюся до документації й вікі. Часто допомагає і спільнота: ділиться досвідом, підказує рішення й допомагає втілити ідеї в життя через звичайне спілкування. Код розбираю та перевіряю, щоб розуміти, що зроблено і як це працює. Для локалізацій, написання документації та створення асетів використання ШІ виключене.',
    ],
  },
  work: {
    title: 'Чим займаюся',
    lead: 'Те, чому я приділяю час.',
    description:
      'Системне адміністрування, програмне забезпечення, локалізація, дизайн, відео та аудіо.',
    paragraphs: [
      'Кілька напрямів, до яких я постійно повертаюся у власних проєктах і захопленнях.',
    ],
  },
  projects: {
    title: 'Проєкти',
    lead: 'Те, що я створюю та підтримую.',
    description:
      'Моди, модпаки для Minecraft і спільнотні інструменти від Wechirok.',
    paragraphs: ['Особисті проєкти, модинг і кілька інструментів.'],
  },
  links: {
    title: 'Посилання',
    lead: 'Де ще мене знайти в інтернеті.',
    description: 'Публічні профілі й місця, де можна знайти Wechirok онлайн.',
    paragraphs: ['Мої профілі, проєкти й способи зв’язатися зі мною.'],
  },
};

const workCopy = {
  server: {
    title: 'Системи та інфраструктура',
    description:
      'Адміністрування Linux, серверна інфраструктура, автоматизація та бази даних.',
  },
  'code-xml': {
    title: 'Програмне забезпечення та Minecraft',
    description:
      'Невеликі інструменти, інтеграції з Discord, моди, модпаки та серверний контент для Minecraft.',
  },
  languages: {
    title: 'Локалізація',
    description:
      'Участь у перекладах програмного забезпечення, щоб проєкти були доступні більшій кількості людей.',
  },
  palette: {
    title: 'Дизайн і медіа',
    description:
      'Графічний дизайн, редагування фото й постерів, монтаж відео, анімація та обробка аудіо.',
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
      'Модпак на Fabric із покращеннями ігрового процесу для плавнішої та приємнішої гри в Minecraft.',
  },
  'Renice Squared': {
    category: 'Модпак',
    description:
      'Варіація Renice Cubed без функцій, які дають гравцям перевагу.',
  },
  'Renice Shot': {
    category: 'Мод',
    description:
      'Клієнтський мод на Fabric для створення скриншотів Minecraft у високій роздільній здатності.',
  },
  'Better Selective Combat': {
    category: 'Мод',
    description:
      'Мод для Minecraft, який дозволяє обрати зброю, на яку не має впливати Better Combat.',
  },
  Shelley: {
    category: 'Інструмент для спільноти',
    description: 'Discord-бот, створений для потреб приватної спільноти.',
  },
  'SMP & Creative': {
    category: 'Серверний контент',
    description:
      'Контент сервера Minecraft, створений для приватної спільноти.',
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
  GitHub: 'Код, проєкти й обговорення проблем.',
  Discord: 'Місце, де можна зі мною зв’язатися.',
  Steam: 'Мій профіль Steam.',
  Crowdin: 'Участь у локалізації та перекладах.',
  Weblate: 'Ще одне місце для участі в локалізації та перекладах.',
  Modrinth: 'Модинг і проєкти.',
  CurseForge: 'Ще одне місце для модингу та проєктів.',
} satisfies Record<(typeof en.profiles)[number]['name'], string>;
export const profiles = en.profiles.map((profile) => ({
  ...profile,
  description: profileDescriptions[profile.name],
}));

export const notFound = {
  title: 'Сторінку не знайдено',
  heading: 'Тут нічого немає, незнайомцю.',
  description: 'Можливо, сторінка переїхала або в адресі є помилка.',
  link: 'Назад до мого особистого простору',
};

export const preferences = {
  language: 'Мова',
  theme: 'Тема',
  dark: 'Темна',
  light: 'Світла',
};
