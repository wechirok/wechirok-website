import * as en from './en';

export const site = {
  ...en.site,
  language: 'uk',
  description: 'Усе, що ви хочете й не хочете знати про мене та мої проєкти!',
  skipLink: 'Перейти до вмісту',
};

export const introduction = {
  greeting: 'Ну шо ти?',
  heading: 'Я Артур Вечір',
  description: 'Створюю проєкти й підтримую системи.',
};

export const navigation = {
  label: 'Розділи',
  menu: 'Меню',
  home: 'На головну',
};

export const sections = {
  about: {
    title: 'Про мене',
    description: 'Трохи про Wechirok і те, чим я займаюся.',
    paragraphs: [
      'Я Артур Вечір, іноді також відомий як Wechirok / Katzeyoru. Мої інтереси пов’язані із системним адмініструванням, програмним забезпеченням та інфраструктурою: здебільшого мені цікаво, як усе працює, хочеться спробувати щось нове й знайти способи застосувати здобуті знання у власних проєктах.',
      'Значну частину досвіду я здобуваю завдяки особистим проєктам і підтримці власної домашньої серверної інфраструктури. Це сервіси, які я розміщую самостійно, боти та ігрові сервери, з увагою до того, як усе розгорнуто, налаштовано, обслуговується та резервується. Окрім інфраструктури, займаюся модингом Minecraft і модпаками, долучаюся до проєктів української локалізації та час від часу редагую фото, відео й аудіо.',
    ],
  },
  work: {
    title: 'Чим займаюся',
    description:
      'Системне адміністрування, програмне забезпечення, локалізація, дизайн, відео та аудіо.',
    paragraphs: [
      'Кілька напрямів, до яких я постійно повертаюся у власних проєктах і захопленнях.',
    ],
  },
  projects: {
    title: 'Проєкти',
    description:
      'Моди, модпаки для Minecraft і спільнотні інструменти від Wechirok.',
    paragraphs: ['Особисті проєкти, модинг і кілька інструментів.'],
  },
};

const translationCopy = {
  'Prism Launcher': {
    category: 'Лаунчер',
    description:
      'Лаунчер Minecraft із відкритим кодом для керування збірками, обліковими записами та модами.',
  },
  'Fabulously Optimized': {
    category: 'Модпак',
    description:
      'Модпак для Minecraft, зосереджений на продуктивності та покращенні графіки, aka альтернатива OptiFine.',
  },
} satisfies Record<
  (typeof en.translationContributions.projects)[number]['name'],
  { category: string; description: string }
>;
export const translationContributions = {
  title: 'Мій внесок у переклади',
  description: 'У деяких проєктах займаюся українською локалізацією.',
  projects: en.translationContributions.projects.map((project) => ({
    ...project,
    ...translationCopy[project.name],
  })),
};

export const toolkit = {
  ...en.toolkit,
  title: 'Інструменти',
  description: 'Те, чим я користувався / користуюся зараз.',
  items: en.toolkit.items.map((item) =>
    item.technologies[0].icon === 'csharp'
      ? {
          ...item,
          details: 'Плагіни для SCP SL: EXILED, LabAPI, Harmony',
        }
      : item,
  ),
};

const workCopy = {
  server: {
    title: 'Системи та інфраструктура',
    description:
      'Адміністрування Linux, серверна інфраструктура, автоматизація та бази даних.',
  },
  'code-xml': {
    title: 'Програмне забезпечення та модинг',
    description:
      'Невеликі інструменти, інтеграції з Discord, моди, модпаки та серверний контент для Minecraft.',
  },
  languages: {
    title: 'Локалізація',
    description:
      'Участь у перекладах програмного забезпечення українською, щоб проєкти були доступні більшій кількості людей.',
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

export const projectActivity = {
  present: 'дотепер',
};

export const projectAttribution = {
  forkOf: 'Форк',
};

export const projectActions = {
  website: 'Вебсайт',
  wiki: 'Вікі',
  repository: 'Репозиторій',
  downloads: 'Завантаження',
  lastAvailable: 'Остання доступна кількість',
  loading: 'Отримання кількості завантажень',
  unavailable: 'Недоступно',
};

const projectCopy = {
  'Renice Cubed': {
    category: 'Модпак',
    description:
      'Модпак на Fabric, що поєднує покращення продуктивності й графіки з інструментами для будівництва та зручнішої гри. Як мейнтейнер, добираю й налаштовую моди, узгоджую прив’язки клавіш, усуваю проблеми сумісності та готую випуски для останніх версій гри. Також веду вікі проєкту.',
  },
  'Renice Squared': {
    category: 'Модпак',
    description:
      'Мій офіційний форк Renice Cubed без функцій, що дають гравцям ігрову перевагу, зі збереженням покращень продуктивності та графіки. Для нього адаптую набір модів і типові налаштування, оновлюю залежності та готую випуски паралельно з Cubed для підтримуваних версій Minecraft.',
  },
  'Renice Shot': {
    category: 'Мод',
    description:
      'Скриншоти Minecraft у високій роздільній здатності з вибором розміру, формату та видимості HUD. Адаптую мод на Fabric до нових версій гри, виправляю проблеми оригіналу й додаю',
    featureLabel: 'нові корисні функції',
  },
  'Better Selective Combat': {
    category: 'Мод',
    description:
      'Керування Better Combat для кожної зброї окремо, з особистими перемикачами та серверними командами. Я реалізував вибір і налаштування зброї для гравців та адміністраторів, а згодом розширив підтримку різних версій Minecraft і завантажувачів Fabric, Forge та NeoForge.',
  },
  Nekogenix: {
    category: 'Мод',
    description:
      'Мод на NeoForge, який наділяє тебе здібностями й біологічними особливостями кота, змінюючи звичний ігровий досвід і відкриваючи Minecraft із зовсім іншого боку. Лабораторне обладнання дозволяє створити ін’єкцію, з якої починається перетворення. Підтримую проєкт разом зі своїм найкращим другом, який теж займається розробкою. Крім того, розробляю вебсайт і пишу вікі для моду.',
  },
  Shelley: {
    category: 'Discord-бот',
    description:
      'Буквально душа Discord-сервера однієї з приватних спільнот, якими я керую. Shelley нараховує бали за активність у текстових і голосових каналах; облік голосової активності в нас виявився ефективнішим і стабільнішим, ніж у великих ботів. Тут також є рейтинги й окрема інтеграція чатів Minecraft і Discord. А ще чимало іншої автоматизації, про яку тут не розповідатиму, бо повний список був би надто довгим.',
  },
  'SMP & Creative': {
    category: 'Плагіни PaperMC, ресурси',
    description:
      'Власні плагіни й пакет ресурсів для приватної мережі серверів Minecraft. Усю мережу утримую сам на власному обладнанні вдома: займаюся налаштуванням, обслуговуванням і резервним копіюванням. Налаштував чат між серверами та поєднав його з Discord через Shelley, щоб можна було спілкуватися і з гри, і з Discord. Для налаштувань гравців і косметики спроєктував спільне сховище PostgreSQL, де транзакції забезпечують узгодженість пов’язаних змін. Плагіни також адаптую до оновлень серверів.',
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
  GitHub: 'Код, проєкти й обговорення проблем.',
  Discord: 'Місце, де можна зі мною зв’язатися.',
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
  heading: 'Тут нічого немає, незнайомцю',
  description: 'Можливо, сторінка переїхала або в адресі є помилка.',
  link: 'Назад до мого особистого простору',
};

export const preferences = {
  language: 'Мова',
  theme: 'Тема',
  dark: 'Темна',
  light: 'Світла',
};
