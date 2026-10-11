import GitHub from '../assets/icons/brands/github.svg';
import Discord from '../assets/icons/brands/discord.svg';
import Steam from '../assets/icons/brands/steam.svg';
import Crowdin from '../assets/icons/brands/crowdin.svg';
import Weblate from '../assets/icons/brands/weblate.svg';
import Modrinth from '../assets/icons/brands/modrinth.svg';
import CurseForge from '../assets/icons/brands/curseforge.svg';
import Java from '../assets/icons/brands/java.svg';
import Python from '../assets/icons/brands/python.svg';
import JavaScript from '../assets/icons/brands/javascript.svg';
import Html5 from '../assets/icons/brands/html5.svg';
import Css3 from '../assets/icons/brands/css3.svg';
import PostgreSql from '../assets/icons/brands/postgresql.svg';
import MySql from '../assets/icons/brands/mysql.svg';
import Blender from '../assets/icons/brands/blender.svg';
import Blockbench from '../assets/icons/brands/blockbench.svg';
import Aseprite from '../assets/icons/brands/aseprite.svg';
import Photoshop from '../assets/icons/brands/adobephotoshop.svg';
import Illustrator from '../assets/icons/brands/adobeillustrator.svg';
import MediaComposer from '../assets/icons/brands/media-composer.svg';
import DaVinciResolve from '../assets/icons/brands/davinciresolve.svg';
import Premiere from '../assets/icons/brands/adobepremierepro.svg';
import AfterEffects from '../assets/icons/brands/adobeaftereffects.svg';
import Audition from '../assets/icons/brands/adobeaudition.svg';
import CircleHelp from '../assets/icons/interface/circle-help.svg';
import UserRound from '../assets/icons/interface/user-round.svg';
import BriefcaseBusiness from '../assets/icons/interface/briefcase-business.svg';
import FolderCode from '../assets/icons/interface/folder-code.svg';
import Link from '../assets/icons/interface/link.svg';
import Trash from '../assets/icons/interface/trash-2.svg';
import Server from '../assets/icons/interface/server.svg';
import Code from '../assets/icons/interface/code-xml.svg';
import Languages from '../assets/icons/interface/languages.svg';
import Palette from '../assets/icons/interface/palette.svg';
import Send from '../assets/icons/interface/send-horizontal.svg';
import ArrowLeft from '../assets/icons/interface/arrow-left.svg';
import House from '../assets/icons/interface/house.svg';
import ArrowRight from '../assets/icons/interface/arrow-right.svg';
import Moon from '../assets/icons/interface/moon.svg';
import Sun from '../assets/icons/interface/sun.svg';
import ChevronDown from '../assets/icons/interface/chevron-down.svg';
import Check from '../assets/icons/interface/check.svg';

// Build-time SVG components. No icon library is shipped as browser JavaScript.
export const icons = {
  github: GitHub,
  discord: Discord,
  steam: Steam,
  crowdin: Crowdin,
  weblate: Weblate,
  modrinth: Modrinth,
  curseforge: CurseForge,
  java: Java,
  python: Python,
  javascript: JavaScript,
  html5: Html5,
  css3: Css3,
  postgresql: PostgreSql,
  mysql: MySql,
  blender: Blender,
  blockbench: Blockbench,
  aseprite: Aseprite,
  adobephotoshop: Photoshop,
  adobeillustrator: Illustrator,
  'media-composer': MediaComposer,
  davinciresolve: DaVinciResolve,
  adobepremierepro: Premiere,
  adobeaftereffects: AfterEffects,
  adobeaudition: Audition,
  'circle-help': CircleHelp,
  'user-round': UserRound,
  'briefcase-business': BriefcaseBusiness,
  'folder-code': FolderCode,
  link: Link,
  'trash-2': Trash,
  server: Server,
  'code-xml': Code,
  languages: Languages,
  palette: Palette,
  'send-horizontal': Send,
  'arrow-left': ArrowLeft,
  house: House,
  'arrow-right': ArrowRight,
  moon: Moon,
  sun: Sun,
  'chevron-down': ChevronDown,
  check: Check,
} as const;

export type IconName = keyof typeof icons;
