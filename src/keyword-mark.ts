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
    return ['keywords'];
  }

  /**
   * Keywords to highlight
   */
  public get keywords(): string {
    return this.getAttribute('keywords') || '';
  }

  /**
   * Sets the keywords to highlight
   * @param {string} val keywords to set
   */
  public set keywords(val: string) {
    this.setAttribute('keywords', val);
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
    newValue: string
  ): void {
    if (name === 'keywords') {
      if (newValue !== oldValue) {
        this._render();
      }
    }
  }

  /** @inheritdoc */
  public connectedCallback(): void {
    this.__observer = new MutationObserver(() => {
      this._render();
    });

    this.__observer.observe(this, {childList: true});
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

    if (!keywords) {
      this.shadowRoot.textContent = text;
      return;
    }

    const lowerText = text.toLowerCase();
    const terms = keywords.toLowerCase().split(/\s+/);
    const splitPattern =
      new RegExp(`${terms.map(escapeRegex).join('|')}`, 'gi');
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

    this.shadowRoot.innerHTML = result.innerHTML;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'keyword-mark': KeywordMarkElement;
  }
}

customElements.define('keyword-mark', KeywordMarkElement);
