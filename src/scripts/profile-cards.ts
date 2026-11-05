const links = Array.from(
  document.querySelectorAll<HTMLAnchorElement>('[data-profile-link]'),
);
let active: HTMLAnchorElement | undefined;

function positionCard(link: HTMLAnchorElement) {
  const card = link.querySelector<HTMLElement>('.profile-preview');
  if (!card || link.getClientRects().length === 0) return;
  const gutter = 18;
  const viewportWidth = document.documentElement.clientWidth;
  card.style.maxWidth = `${Math.max(0, viewportWidth - gutter * 2)}px`;
  const bounds = link.getBoundingClientRect();
  const left = Math.max(
    gutter,
    Math.min(bounds.left, viewportWidth - gutter - card.offsetWidth),
  );
  link.style.setProperty('--profile-card-offset', `${left - bounds.left}px`);
  link.style.setProperty(
    '--profile-card-origin',
    `${bounds.left + bounds.width / 2 - left}px`,
  );
}

function closeCard() {
  active?.removeAttribute('data-profile-open');
  active = undefined;
}

function openCard(link: HTMLAnchorElement) {
  if (active !== link) closeCard();
  positionCard(link);
  active = link;
  link.setAttribute('data-profile-open', '');
}

for (const link of links) {
  positionCard(link);
  link.addEventListener('pointerenter', (event) => {
    if (event.pointerType !== 'touch') openCard(link);
  });
  link.addEventListener('pointerleave', () => {
    if (active === link && document.activeElement !== link) closeCard();
  });
  link.addEventListener('focus', () => openCard(link));
  link.addEventListener('blur', () => {
    if (active === link && !link.matches(':hover')) closeCard();
  });
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeCard();
});
window.addEventListener('resize', () => {
  for (const link of links) positionCard(link);
});
document.addEventListener('localechange', () => {
  if (active) positionCard(active);
});

const list = links[0]?.closest('.profile-list');
if (list) {
  new ResizeObserver(() => {
    for (const link of links) positionCard(link);
  }).observe(list);
}
