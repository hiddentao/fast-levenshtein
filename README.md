# fast-levenshtein - Levenshtein algorithm in Javascript

[![Build Status](https://secure.travis-ci.org/hiddentao/fast-levenshtein.png)](http://travis-ci.org/hiddentao/fast-levenshtein)

An efficient Javascript implementation of the [Levenshtein algorithm](http://en.wikipedia.org/wiki/Levenshtein_distance) with asynchronous callback support.

## Features

* Works in node.js and in the browser.
* Reduced memory usage compared to other implementations by not needing to store the whole matrix ([more info](http://www.codeproject.com/Articles/13525/Fast-memory-efficient-Levenshtein-algorithm)).
* Provides synchronous and asynchronous versions of the algorithm.
* Asynchronous version is almost as fast as the synchronous version for small strings and can also provide progress updates.
* Comprehensive test suite.
* Small: <1 KB minified and gzipped

## Installation

### node.js

Install using [npm](http://npmjs.org/):

    $ npm install fast-levenshtein

### Browser

Using bower:

    $ bower install fast-levenshtein

Or the following inside your HTML:

    <script type="text/javascript" src="https://github.com/hiddentao/fast-levenshtein/raw/master/levenshtein.min.js"></script>

The API will then be accessible via the `window.Levenshtein` object.

## Examples

**Synchronous**

    var levenshtein = require('fast-levenshtein');

    var distance = levenshtein.get('back', 'book');   // 2
    var distance = levenshtein.get('我愛你', '我叫你');   // 1


**Asynchronous**

    var levenshtein = require('fast-levenshtein');

    levenshtein.getAsync('back', 'book', function (err, distance) {
      // err is null unless an error was thrown
      // distance equals 2
    });

**Asynchronous with progress updates**

    var levenshtein = require('fast-levenshtein');

    var hugeText1 = fs.readFileSync(...);
    var hugeText2 = fs.readFileSync(...);

    levenshtein.getAsync(hugeText1, hugeText2, function (err, distance) {
      // process the results as normal
    }, {
      progress: function(percentComplete) {
        console.log(percentComplete + ' % completed so far...');
      }
    );

## Building and Testing

To build the code simply run [grunt](http://gruntjs.com/):

    $ grunt

This will run the tests followed by [jshint](http://jshint.com) followed by [uglify](https://github.com/mishoo/UglifyJS). To run the tests on their own do:

    $ grunt mochaTest


## Contributing

If you wish to submit a pull request please update and/or create new tests for any changes you make and ensure the grunt build passes.

See [CONTRIBUTING.md](https://github.com/hiddentao/fast-levenshtein/blob/master/CONTRIBUTING.md) for details.

## License

MIT - see [LICENSE.md](https://github.com/hiddentao/fast-levenshtein/blob/master/LICENSE.md)
