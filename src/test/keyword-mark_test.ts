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
    expect(element.innerHTML).to.equal('foo BAR baz');
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

  it('should react to attribute changes', () => {
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

  it('should react to property changes', () => {
    element.keywords = 'ba';
    expect(element.shadowRoot!.innerHTML.trim()).to.equal(`<style>
        mark {
          color: var(--keyword-mark-color);
          background: var(--keyword-mark-background, yellow);
        }
      </style>
      foo <mark>BA</mark>R <mark>ba</mark>z`);

    element.keywords = 'foo';
    expect(element.shadowRoot!.innerHTML.trim()).to.equal(`<style>
        mark {
          color: var(--keyword-mark-color);
          background: var(--keyword-mark-background, yellow);
        }
      </style>
      <mark>foo</mark> BAR baz`);
  });

  it('should handle special characters', () => {
    element.innerText = '[baz] one (bar) two foo? three';
    element.keywords = 'foo? (bar) [baz]';
    expect(element.shadowRoot!.innerHTML.trim()).to.equal(`<style>
        mark {
          color: var(--keyword-mark-color);
          background: var(--keyword-mark-background, yellow);
        }
      </style>
      <mark>[baz]</mark> one <mark>(bar)</mark> two <mark>foo?</mark> three`);
  });
});
