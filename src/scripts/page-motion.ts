import { typeText } from '../lib/typewriter';

const page = document.querySelector<HTMLElement>('.document-page');
if (page) {
  typeText(page);
  document.addEventListener('localechange', () => typeText(page));
}
