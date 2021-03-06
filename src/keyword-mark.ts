const escapeRegexChars = [
  '-',
  '[',
  ']',
  '/',
  '{',
  '}',
  '(',
  ')',
  '*',
  '+',
  '?',
  '.',
  '\\',
  '^',
  '$',
  '|',
];
const escapeRegexPattern = new RegExp(`[${escapeRegexChars.join('\\')}]`, 'g');
const escapeRegex = (str: string): string =>
  str.replace(escapeRegexPattern, '\\$&');

/**
 * Renders a string with keywords highlighted
 */
export class KeywordMarkElement extends HTMLElement {
  /** @inheritdoc */
  public static get observedAttributes(): string[] {
    return ['keywords', 'delimiter'];
  }

  /**
   * Keywords to highlight
   */
  public get keywords(): string {
    return this.getAttribute('keywords') ?? '';
  }

  /**
   * Sets the keywords to highlight
   * @param {string} val keywords to set
   */
  public set keywords(val: string) {
    this.setAttribute('keywords', val);
  }

  /**
   * Delimiter for keywords
   */
  public get delimiter(): string {
    return this.getAttribute('delimiter') ?? '';
  }

  /**
   * Sets delimiter for keywords
   * @param {string} val delimiter to set
   */
  public set delimiter(val: string) {
    this.setAttribute('delimiter', val);
  }

  /**
   * Observer of child nodes
   */
  private __observer?: MutationObserver;

  /** constructor */
  public constructor() {
    super();

    this.attachShadow({mode: 'open'});
  }

  /** @inheritdoc */
  public attributeChangedCallback(
    name: string,
    oldValue: string,
    newValue: string,
  ): void {
    if (name === 'keywords' || name === 'delimiter') {
      if (newValue !== oldValue) {
        this._render();
      }
    }
  }

  /** @inheritdoc */
  public connectedCallback(): void {
    this._render();

    this.__observer = new MutationObserver(() => {
      this._render();
    });

    this.__observer.observe(this, {
      childList: true,
      characterData: true,
      subtree: true,
    });
  }

  /** @inheritdoc */
  public disconnectedCallback(): void {
    if (this.__observer) {
      this.__observer.disconnect();
      this.__observer = undefined;
    }
  }

  /**
   * Renders the current string with keywords highlighted
   */
  protected _render(): void {
    if (!this.shadowRoot) {
      return;
    }

    const text = this.textContent || '';
    const keywords = this.getAttribute('keywords');
    const delimiter = this.getAttribute('delimiter') || /\s+/;

    if (!keywords) {
      this.shadowRoot.textContent = text;
      return;
    }

    const lowerText = text.toLowerCase();
    const terms = keywords
      .toLowerCase()
      .split(delimiter)
      .sort((a, b) => {
        return b.length - a.length;
      });
    const splitPattern = new RegExp(
      `${terms.map(escapeRegex).join('|')}`,
      'gi',
    );
    const parts = text.split(splitPattern);
    const result = document.createElement('div');

    let cursor = 0;

    for (const part of parts) {
      result.appendChild(document.createTextNode(part));
      cursor += part.length;

      if (cursor < lowerText.length) {
        const slice = lowerText.substring(cursor);
        const match = terms.find((t) => slice.startsWith(t));
        if (match) {
          const mark = document.createElement('mark');
          mark.textContent = text.substr(cursor, match.length);
          result.appendChild(mark);
          cursor += match.length;
        }
      }
    }

    this.shadowRoot.innerHTML = `
      <style>
        mark {
          color: var(--keyword-mark-color);
          background: var(--keyword-mark-background, yellow);
        }
      </style>
      ${result.innerHTML}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'keyword-mark': KeywordMarkElement;
  }
}

customElements.define('keyword-mark', KeywordMarkElement);
