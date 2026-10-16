interface Digit {
  track: HTMLElement;
  current: HTMLElement;
  next: HTMLElement;
  position: number;
  start: number;
  end: number;
}

// Both the compact badge and its exact tooltip use the same clock and digit phases.
export class DownloadCounter {
  private digits: Digit[] = [];
  private started = 0;
  private mode: 'loading' | 'settling' | 'ready' = 'ready';
  private text = '';
  private outgoing?: HTMLElement;
  private element: HTMLElement;

  constructor(element: HTMLElement) {
    this.element = element;
  }

  get active() {
    return this.mode !== 'ready';
  }

  loading(now: number) {
    if (this.mode === 'loading') return;
    this.started = now;
    this.mode = 'loading';
    this.element.dataset.state = 'loading';
    this.create('000000');
    this.tick(now);
  }

  settle(text: string, now: number, animate: boolean) {
    if (this.mode !== 'loading' && text === this.text) return;
    this.text = text;
    if (!animate) {
      this.mode = 'ready';
      this.element.dataset.state = 'ready';
      this.element.textContent = text;
      this.digits = [];
      this.outgoing = undefined;
      return;
    }
    this.started = now;
    this.mode = 'settling';
    this.element.dataset.state = 'settling';
    this.create(text, true);
    this.tick(now);
  }

  tick(now: number, reduced = false) {
    if (this.mode === 'ready') return;
    if (reduced) {
      if (this.mode === 'settling') this.finish();
      else this.element.textContent = '…';
      return;
    }
    // Restore the reels if reduced motion was switched off while loading.
    if (this.mode === 'loading' && !this.element.firstElementChild)
      this.create('000000');
    const elapsed = Math.max(0, now - this.started);
    if (this.mode === 'settling' && elapsed >= 1_100) {
      this.finish();
      return;
    }
    if (this.outgoing && elapsed >= 260) {
      this.outgoing.remove();
      this.outgoing = undefined;
    }
    const progress = 1 - (1 - Math.min(1, elapsed / 1_100)) ** 4;
    this.digits.forEach((digit, index) => {
      const position =
        this.mode === 'loading'
          ? ((elapsed / 900) * 10 + index * 1.7) % 10
          : digit.start + (digit.end - digit.start) * progress;
      digit.position = position;
      const whole = Math.floor(position);
      const current = String(whole % 10);
      const next = String((whole + 1) % 10);
      if (digit.current.textContent !== current)
        digit.current.textContent = current;
      if (digit.next.textContent !== next) digit.next.textContent = next;
      digit.track.style.transform = `translateY(${-(position - whole) * 1.25}em)`;
    });
  }

  private finish() {
    this.mode = 'ready';
    this.element.dataset.state = 'ready';
    this.element.textContent = this.text;
    this.digits = [];
    this.outgoing = undefined;
  }

  private create(text: string, transition = false) {
    this.outgoing?.remove();
    this.outgoing = undefined;
    const document = this.element.ownerDocument;
    const previous = this.digits;
    const oldLayer = this.element.firstElementChild as HTMLElement | null;
    const layer = document.createElement('span');
    layer.className = 'download-roll-layer';
    this.digits = [];
    for (const character of text) {
      const cell = document.createElement('span');
      if (/\d/.test(character)) {
        cell.className = 'download-digit';
        const track = document.createElement('span');
        track.className = 'download-digit-track';
        const current = document.createElement('span');
        const next = document.createElement('span');
        track.append(current, next);
        cell.append(track);
        const start = previous[this.digits.length]?.position ?? 0;
        let end = Math.ceil(start / 10) * 10 + Number(character);
        if (end - start < 6) end += 10;
        this.digits.push({ track, current, next, position: start, start, end });
      } else {
        cell.textContent = character;
      }
      layer.append(cell);
    }
    if (transition && oldLayer) {
      oldLayer.dataset.outgoing = '';
      layer.dataset.incoming = '';
      this.outgoing = oldLayer;
      this.element.append(layer);
    } else this.element.replaceChildren(layer);
  }
}
