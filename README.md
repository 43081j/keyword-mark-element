# `<keyword-mark>`

A simple web component to mark keywords in a string.

[Demo](https://keyword-mark.glitch.me)

## Usage

Install:

```
$ npm i -S keyword-mark-element
```

Include:

```html
<script src="node_modules/keyword-mark-element/lib/keyword-mark.js"></script>
```

Or in JavaScript:

```ts
import "./node_modules/keyword-mark-element/lib/keyword-mark.js";
```

Use:

```html
<keyword-mark keywords="foo">foo bar baz</keyword-mark>
```

Essentially, any keywords specified in the `keywords` attribute will be
highlighted in the text content of the element.

## License

MIT
