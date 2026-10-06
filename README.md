# fast-levenshtein - Levenshtein algorithm in Javascript

[![Build Status](https://github.com/hiddentao/fast-levenshtein/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/hiddentao/fast-levenshtein/actions/workflows/ci.yml)
[![NPM module](https://img.shields.io/npm/v/fast-levenshtein.svg)](https://www.npmjs.com/package/fast-levenshtein)
[![NPM downloads](https://img.shields.io/npm/dm/fast-levenshtein.svg)](https://www.npmjs.com/package/fast-levenshtein)
[![Follow on X](https://img.shields.io/badge/follow-%40taoofdev-000000?style=social&logo=x)](https://x.com/taoofdev)

A Javascript implementation of the [Levenshtein algorithm](http://en.wikipedia.org/wiki/Levenshtein_distance) with locale-specific collator support. This uses [fastest-levenshtein](https://github.com/ka-weihe/fastest-levenshtein) under the hood.

## Features

* Works in node.js and in the browser.
* Locale-sensitive string comparisons if needed.
* Comprehensive test suite.

## Installation

```bash
$ npm install fast-levenshtein
```
**CDN**

The latest version is now also always available at https://unpkg.com/fast-levenshtein

## Examples

**Default usage**

```javascript
var levenshtein = require('fast-levenshtein');

var distance = levenshtein.get('back', 'book');   // 2
var distance = levenshtein.get('我愛你', '我叫你');   // 1
```

**Locale-sensitive string comparisons**

It supports using [Intl.Collator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Collator) for locale-sensitive  string comparisons:

```javascript
var levenshtein = require('fast-levenshtein');

levenshtein.get('mikailovitch', 'Mikhaïlovitch', { useCollator: true});
// 1
```
## Unicode behavior

JavaScript strings are represented as UTF-16 code units, and this affects the
sequence processed by Levenshtein distance.

The locale-sensitive comparison path in this package uses `String.length`,
`charAt()` and `charCodeAt()`, so supplementary Unicode code points represented
by surrogate pairs can occupy two sequence positions.

The default comparison path delegates to `fastest-levenshtein`, which also
operates on JavaScript string length and UTF-16 code units.

This means the calculated distance is a UTF-16 code-unit distance rather than
a Unicode code-point or grapheme-cluster distance. `Intl.Collator` can change
how individual units are compared for locale-sensitive matching, but it does
not change the underlying string segmentation model.

Applications that require code-point or user-perceived-character distance
should define and segment the comparison sequence before calculating
Levenshtein distance.

For additional background on string representations and edit-distance
implementations, see [Levenshtein implementations and Unicode sequence units](https://www.levenshtein.net/levenshtein-implementations).

## Building and Testing

To build the code and run the tests:

```bash
$ npm install -g grunt-cli
$ npm install
$ npm run build
```

## Performance

This uses [fastest-levenshtein](https://github.com/ka-weihe/fastest-levenshtein) under the hood.

## Contributing

If you wish to submit a pull request please update and/or create new tests for any changes you make and ensure the grunt build passes.

See [CONTRIBUTING.md](https://github.com/hiddentao/fast-levenshtein/blob/master/CONTRIBUTING.md) for details.

## License

MIT - see [LICENSE.md](https://github.com/hiddentao/fast-levenshtein/blob/master/LICENSE.md)
