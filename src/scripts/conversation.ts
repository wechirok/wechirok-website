import { findCommand } from '../data/commands';
import { getCopy, localize } from '../lib/i18n';
import { finishAllTyping, typeText } from '../lib/typewriter';

const root = document.querySelector<HTMLElement>('[data-conversation]');

if (root) {
  const form = root.querySelector<HTMLFormElement>('[data-command-form]');
  const input = root.querySelector<HTMLInputElement>('#command-input');
  const history = root.querySelector<HTMLOListElement>('[data-history]');
  const welcome = root.querySelector<HTMLElement>('[data-welcome]');
  const empty = root.querySelector<HTMLElement>('[data-empty]');
  const announcer = root.querySelector<HTMLElement>('[data-announcer]');
  const composer = root.querySelector<HTMLElement>('[data-composer]');

  if (form && input && history && welcome && empty && announcer) {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const commandHistory: string[] = [];
    let historyPosition = 0;
    let draft = '';
    let hasStarted = false;
    let announcementFrame = 0;
    let finishPendingClear: ((animate: boolean) => void) | undefined;
    let emptyAnimation: Animation | undefined;
    let composerAnimation: Animation | undefined;
    const sendButton = form.querySelector<HTMLButtonElement>('[data-send]');
    const sendIcon = sendButton?.querySelector<SVGSVGElement>('svg');
    let sendAnimation: Animation | undefined;

    function updateSubmitState() {
      if (sendButton) sendButton.disabled = !input?.value.trim();
    }

    function animateSend() {
      if (motion.matches || !sendIcon || typeof sendIcon.animate !== 'function')
        return;
      sendAnimation?.cancel();
      const animation = sendIcon.animate(
        [
          { transform: 'rotate(-18deg)', opacity: 1, offset: 0 },
          {
            transform: 'translate(10px, -7px) rotate(-24deg) scale(0.9)',
            opacity: 0,
            offset: 0.38,
          },
          {
            transform: 'translate(-8px, 6px) rotate(-18deg) scale(0.9)',
            opacity: 0,
            offset: 0.4,
          },
          { transform: 'rotate(-18deg)', opacity: 1, offset: 1 },
        ],
        { duration: 380, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
      );
      sendAnimation = animation;
      animation.onfinish = () => {
        if (sendAnimation === animation) sendAnimation = undefined;
      };
    }

    function startConversation() {
      if (hasStarted || !welcome) return;
      hasStarted = true;

      if (motion.matches) {
        welcome.hidden = true;
        return;
      }

      welcome.style.height = `${welcome.getBoundingClientRect().height}px`;
      welcome.setAttribute('aria-hidden', 'true');
      requestAnimationFrame(() => {
        welcome.classList.add('is-leaving');
        welcome.style.height = '0px';
      });
      window.setTimeout(() => {
        welcome.hidden = true;
      }, 350);
    }

    function announce(message: string) {
      if (!announcer) return;
      cancelAnimationFrame(announcementFrame);
      announcer.textContent = '';
      announcementFrame = requestAnimationFrame(() => {
        announcer.textContent = message;
      });
    }

    function restoreFocus(target: HTMLElement, focusInput: boolean) {
      if (focusInput) input?.focus({ preventScroll: true });
      else target.focus({ preventScroll: true });
    }

    function finishClearAnimations() {
      finishPendingClear?.(false);
      emptyAnimation?.cancel();
      composerAnimation?.cancel();
      emptyAnimation = undefined;
      composerAnimation = undefined;
    }

    function clearConversation(focusInput: boolean) {
      const list = history;
      const hint = empty;
      if (!list || !hint) return;

      const canAnimate = !motion.matches && typeof list.animate === 'function';

      const commitClear = (animate: boolean) => {
        const previousTop = animate
          ? composer?.getBoundingClientRect().top
          : undefined;

        list.replaceChildren();
        list.inert = false;
        hint.hidden = false;
        announce(getCopy().interfaceCopy.cleared);
        restoreFocus(hint, focusInput);
        typeText(hint, { duration: 700 });

        if (!animate) return;

        emptyAnimation = hint.animate(
          [
            { opacity: 0, transform: 'translateY(8px)' },
            { opacity: 1, transform: 'translateY(0)' },
          ],
          { duration: 280, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
        );

        if (composer && previousTop !== undefined) {
          const distance = previousTop - composer.getBoundingClientRect().top;
          if (Math.abs(distance) > 1) {
            composerAnimation = composer.animate(
              [
                { transform: `translateY(${distance}px)` },
                { transform: 'translateY(0)' },
              ],
              { duration: 360, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
            );
          }
        }
      };

      if (!canAnimate || !list.childElementCount) {
        commitClear(canAnimate);
        return;
      }

      list.inert = true;
      const exit = list.animate(
        [
          { opacity: 1, transform: 'translateY(0)' },
          { opacity: 0, transform: 'translateY(-10px)' },
        ],
        { duration: 200, easing: 'ease-in', fill: 'forwards' },
      );

      const complete = (animate: boolean) => {
        if (finishPendingClear !== complete) return;
        finishPendingClear = undefined;
        exit.onfinish = null;
        exit.cancel();
        commitClear(animate && !motion.matches);
      };

      finishPendingClear = complete;
      exit.onfinish = () => complete(true);
    }

    function execute(raw: string, focusInput = true) {
      const value = raw.trim();
      if (!value || !input || !history || !empty) return;

      finishClearAnimations();
      finishAllTyping();
      startConversation();
      commandHistory.push(value);
      historyPosition = commandHistory.length;
      draft = '';
      input.value = '';
      updateSubmitState();

      const command = findCommand(value);
      if (command?.action === 'clear') {
        clearConversation(focusInput);
        return;
      }

      empty.hidden = true;
      const { interfaceCopy } = getCopy();
      const entry = document.createElement('li');
      entry.className = 'conversation-entry';

      const request = document.createElement('p');
      request.className = 'request-line';
      const userLabel = document.createElement('span');
      userLabel.className = 'speaker-label';
      userLabel.dataset.i18n = 'interfaceCopy.userLabel';
      userLabel.textContent = interfaceCopy.userLabel;
      const commandText = document.createElement('span');
      commandText.textContent = value;
      request.append(userLabel, commandText);

      const response = document.createElement('div');
      response.className = 'response';
      response.tabIndex = -1;
      const responseLabel = document.createElement('p');
      responseLabel.className = 'speaker-label response-label';
      responseLabel.dataset.i18n = 'interfaceCopy.responseLabel';
      responseLabel.textContent = interfaceCopy.responseLabel;

      const template = command
        ? root?.querySelector<HTMLTemplateElement>(
            `[data-response="${command.name}"]`,
          )
        : undefined;

      if (template) {
        response.append(template.content.cloneNode(true));
      } else {
        const message = document.createElement('p');
        message.dataset.unknownCommand = value;
        message.textContent = `${interfaceCopy.unknownBefore}${value}${interfaceCopy.unknownAfter}`;
        response.append(message);
      }

      entry.append(request, responseLabel, response);
      localize(entry);
      history.append(entry);
      announce(response.innerText.replace(/\s+/g, ' ').trim());
      restoreFocus(response, focusInput);
      typeText(entry);

      requestAnimationFrame(() => {
        entry.scrollIntoView({
          block: 'start',
          behavior: motion.matches ? 'instant' : 'smooth',
        });
      });
    }

    form.hidden = false;
    updateSubmitState();
    const hint = root.querySelector<HTMLElement>('[data-welcome-hint]');
    if (hint) hint.hidden = false;

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!input.value.trim()) return;
      animateSend();
      execute(input.value);
    });

    input.addEventListener('input', updateSubmitState);

    root.addEventListener('click', (event) => {
      if (!(event.target instanceof Element)) return;
      const button = event.target.closest<HTMLButtonElement>('[data-command]');
      if (button?.dataset.command) execute(button.dataset.command, false);
    });

    input.addEventListener('keydown', (event) => {
      if (event.isComposing) return;

      if (event.key === 'Escape') {
        input.value = '';
        draft = '';
        historyPosition = commandHistory.length;
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        if (historyPosition === commandHistory.length) draft = input.value;
        if (historyPosition > 0) historyPosition -= 1;
        input.value = commandHistory[historyPosition] ?? draft;
        input.setSelectionRange(input.value.length, input.value.length);
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        historyPosition = Math.min(historyPosition + 1, commandHistory.length);
        input.value = commandHistory[historyPosition] ?? draft;
        input.setSelectionRange(input.value.length, input.value.length);
      }
      updateSubmitState();
    });

    motion.addEventListener('change', () => {
      if (motion.matches) {
        sendAnimation?.cancel();
        sendAnimation = undefined;
        finishClearAnimations();
      }
    });

    document.addEventListener('localechange', () => {
      if (!empty.hidden) announce(getCopy().interfaceCopy.cleared);
      else {
        const response = history.querySelector<HTMLElement>(
          '.conversation-entry:last-child .response',
        );
        if (response) announce(response.innerText.replace(/\s+/g, ' ').trim());
      }
      const content = !hasStarted
        ? welcome
        : !empty.hidden
          ? empty
          : history.querySelector<HTMLElement>(
              '.conversation-entry:last-child',
            );
      if (content) typeText(content);
    });

    const viewport = window.visualViewport;
    if (viewport) {
      const updateKeyboardInset = () => {
        const inset = window.innerHeight - viewport.height - viewport.offsetTop;
        const keyboardVisible =
          document.activeElement === input &&
          viewport.scale === 1 &&
          inset > 100;
        root.style.setProperty(
          '--keyboard-inset',
          `${keyboardVisible ? Math.max(0, inset) : 0}px`,
        );
      };
      viewport.addEventListener('resize', updateKeyboardInset);
      viewport.addEventListener('scroll', updateKeyboardInset);
      input.addEventListener('focus', updateKeyboardInset);
      input.addEventListener('blur', updateKeyboardInset);
    }

    typeText(welcome);
  }
}
