import {KeywordMarkElement} from '../keyword-mark.js';
import '../keyword-mark.js';

const {expect} = chai;
const nextTick = (): Promise<void> =>
  new Promise((r) =>
    requestAnimationFrame(() => {
      r();
    }),
  );

describe('keyword-mark', () => {
  let element: KeywordMarkElement;

  beforeEach(() => {
    element = document.createElement('keyword-mark');
    element.innerText = 'foo BAR baz';
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  it('should do nothing if no keywords', () => {
    expect(element.shadowRoot!.innerHTML.trim()).to.equal('foo BAR baz');
  });

  it('should do nothing if no keywords with custom delimiter', () => {
    element.delimiter = ',';
    expect(element.shadowRoot!.innerHTML.trim()).to.equal('foo BAR baz');
  });

  it('should highlight individual keywords', () => {
    element.keywords = 'ba';
    expect(element.shadowRoot!.innerHTML.trim()).to.equal(`<style>
        mark {
          color: var(--keyword-mark-color);
          background: var(--keyword-mark-background, yellow);
        }
      </style>
      foo <mark>BA</mark>R <mark>ba</mark>z`);
  });

  it('should highlight multiple keywords', () => {
    element.keywords = 'foo bar';
    expect(element.shadowRoot!.innerHTML.trim()).to.equal(`<style>
        mark {
          color: var(--keyword-mark-color);
          background: var(--keyword-mark-background, yellow);
        }
      </style>
      <mark>foo</mark> <mark>BAR</mark> baz`);
  });

  it('should highlight multiple keywords including spaces', () => {
    element.delimiter = ',';
    element.keywords = 'foo b,r baz';
    expect(element.shadowRoot!.innerHTML.trim()).to.equal(`<style>
        mark {
          color: var(--keyword-mark-color);
          background: var(--keyword-mark-background, yellow);
        }
      </style>
      <mark>foo B</mark>A<mark>R baz</mark>`);
  });

  it('should react to child changes', async () => {
    element.keywords = 'foo';
    element.innerHTML = 'foo foo';
    await nextTick();
    expect(element.shadowRoot!.innerHTML.trim()).to.equal(`<style>
        mark {
          color: var(--keyword-mark-color);
          background: var(--keyword-mark-background, yellow);
        }
      </style>
      <mark>foo</mark> <mark>foo</mark>`);
  });

  it('should react to keywords attribute changes', () => {
    element.setAttribute('keywords', 'ba');
    expect(element.shadowRoot!.innerHTML.trim()).to.equal(`<style>
        mark {
          color: var(--keyword-mark-color);
          background: var(--keyword-mark-background, yellow);
        }
      </style>
      foo <mark>BA</mark>R <mark>ba</mark>z`);

    element.setAttribute('keywords', 'foo');
    expect(element.shadowRoot!.innerHTML.trim()).to.equal(`<style>
        mark {
          color: var(--keyword-mark-color);
          background: var(--keyword-mark-background, yellow);
        }
      </style>
      <mark>foo</mark> BAR baz`);

    element.removeAttribute('keywords');
    expect(element.innerHTML).to.equal('foo BAR baz');
  });

  it('should react to delimiter attribute changes', () => {
    element.setAttribute('delimiter', ',');
    element.setAttribute('keywords', 'foo,abc:bar');
    expect(element.shadowRoot!.innerHTML.trim()).to.equal(`<style>
        mark {
          color: var(--keyword-mark-color);
          background: var(--keyword-mark-background, yellow);
        }
      </style>
      <mark>foo</mark> BAR baz`);

    element.setAttribute('delimiter', ':');
    expect(element.shadowRoot!.innerHTML.trim()).to.equal(`<style>
        mark {
          color: var(--keyword-mark-color);
          background: var(--keyword-mark-background, yellow);
        }
      </style>
      foo <mark>BAR</mark> baz`);

    element.removeAttribute('keywords');
    expect(element.innerHTML).to.equal('foo BAR baz');
  });

  it('should react to property changes', () => {
    element.delimiter = ':';
    element.keywords = 'fo:ba';
    expect(element.shadowRoot!.innerHTML.trim()).to.equal(`<style>
        mark {
          color: var(--keyword-mark-color);
          background: var(--keyword-mark-background, yellow);
        }
      </style>
      <mark>fo</mark>o <mark>BA</mark>R <mark>ba</mark>z`);

    element.delimiter = ',';
    element.keywords = 'foo,bar';
    expect(element.shadowRoot!.innerHTML.trim()).to.equal(`<style>
        mark {
          color: var(--keyword-mark-color);
          background: var(--keyword-mark-background, yellow);
        }
      </style>
      <mark>foo</mark> <mark>BAR</mark> baz`);
  });

  it('should handle special characters', () => {
    element.delimiter = '$';
    element.innerText = '[baz] one (bar) two foo? three';
    element.keywords = 'foo?$(bar)$[baz]';
    expect(element.shadowRoot!.innerHTML.trim()).to.equal(`<style>
        mark {
          color: var(--keyword-mark-color);
          background: var(--keyword-mark-background, yellow);
        }
      </style>
      <mark>[baz]</mark> one <mark>(bar)</mark> two <mark>foo?</mark> three`);
  });
});
