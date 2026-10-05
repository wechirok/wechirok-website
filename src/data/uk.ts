import * as en from './en';

export const site = {
  ...en.site,
  language: 'uk',
  title: 'Wechirok — Особистий простір',
  description:
    'Особистий простір для всього, що я створюю, підтримую й над чим працюю. Проєкти, трохи про мене та де мене знайти.',
  skipLink: 'Перейти до вмісту',
};

export const introduction = {
  greeting: 'Як справи, незнайомцю?',
  heading: 'Я Wechirok.',
  description:
    'Це мій особистий простір для всього, що я створюю, підтримую й над чим працюю.',
  hintBefore: 'Введи ',
  hintAfter: ', щоб побачити доступні команди.',
};

export const interfaceCopy = {
  commandLabel: 'Введи команду',
  placeholder: 'Твої команди сюди, будь ласка :)',
  submit: 'Надіслати',
  historyLabel: 'Розмова',
  userLabel: 'Ти',
  responseLabel: 'Wechirok',
  helpTitle: 'Кілька способів озирнутися.',
  helpDescription: 'Введи команду або обери одну нижче.',
  unknownBefore: 'Я не знаю команди «',
  unknownAfter: '». Спробуй help, щоб побачити доступні команди.',
  cleared: 'Розмову очищено.',
  clearHint: 'Куди далі? Введи «help», щоб побачити команди.',
  noScript:
    'Для розмови потрібен JavaScript. Також можна прочитати текстові сторінки:',
};

export const sections = {
  about: {
    title: 'Про мене',
    lead: 'Потроху займаюся всім підряд.',
    description: 'Трохи про Wechirok і те, чим я займаюся.',
    paragraphs: [
      'Я Wechirok, іноді також відомий як Katzeyoru. Я системний адміністратор (або принаймні намагаюся ним бути), якому цікаво, як програмне забезпечення, сервіси й інфраструктура працюють разом.',
      'Я створюю та підтримую особисті проєкти, працюю над модами й модпаками для Minecraft і долучаюся до локалізації програмного забезпечення. Ще займаюся графічним дизайном, редагуванням фото, відео та аудіо.',
      'Я роблю це з цікавості та для людей поруч зі мною. Цей простір об’єднує все це разом із місцями, де мене можна знайти в інтернеті.',
      'Я з тих лохів, які хочуть усього досягти легким шляхом. Використовую AI для коду (навіть для цього сайту, лол), а потім розумію, що весь цей підхід — лайно, і зрештою виправляю все сам. Це перетворюється на ночі досліджень і переробок, доки не отримаю хороший результат. Тож я суперечу сам собі й усе одно йду важким шляхом. Для мене важливо отримати відмінний результат. Схоже, просто спочатку я маю пройти всі дев’ять кіл пекла.',
    ],
  },
  work: {
    title: 'Заняття',
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
    paragraphs: [
      'Особисті проєкти, робота з Minecraft і кілька інструментів для приватної спільноти.',
    ],
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
      'Адміністрування Linux, серверна інфраструктура, автоматизація та бази даних. Щоб сервіси залишалися впорядкованими й корисними.',
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

export const commandDescriptions = {
  help: 'Переглянути доступні команди.',
  about: 'Трохи про мене.',
  work: 'Те, чому я приділяю час.',
  projects: 'Те, що я створюю та підтримую.',
  links: 'Знайти мене деінде.',
  clear: 'Очистити цю розмову.',
};

export const preferences = {
  language: 'Мова',
  theme: 'Тема',
  dark: 'Темна',
  light: 'Світла',
};
