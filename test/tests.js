var _ = require('lodash'),
    chai = require('chai'),
    fs = require('fs'),
    levenshtein = require('../levenshtein.min');

var expect = chai.expect,
    assert = chai.assert;


/**
 * Create test functions.
 * @return Object
 */
var createTests = function(str1, str2, expectedLength, options) {
  options = _.extend({}, {
    description: null
  }, options);

  if (!options.description) {
    options.description = (0 === str1.length ? '(empty)' : str1) + ' <-> ' + (0 === str2.length ? '(empty)' : str2);
  }

  var ret = {};

  ret[options.description + ' (len: ' + expectedLength + ')'] = function() {
    expect(levenshtein.get(str1, str2, options)).to.eql(expectedLength);
  };

  return ret;
};


// ----- Basic tests ----- //

(function() {

  var tests = {},
      str = 'hello',
      str1 = str,
      str2 = str,
      i;

  // equal strings
  _.extend(tests, createTests('hello', 'hello', 0));

  // inserts
  for (i=0; i<=str.length; ++i) {
    str1 = str.substr(0,i);
    str2 = str;

    _.extend(tests, createTests(str1, str2, str.length - i));
  }

  // deletes
  for (i=str.length-1; i>=0; --i) {
    str1 = str;
    str2 = str.substr(0,i);

    _.extend(tests, createTests(str1, str2, str.length - i));
  }

  // substitutions
  _.extend(tests, createTests("a",   "b", 1 ));
  _.extend(tests, createTests("ab",  "ac", 1 ));
  _.extend(tests, createTests("ac",  "bc",  1 ));
  _.extend(tests, createTests("abc", "axc", 1 ));
  _.extend(tests, createTests("xabxcdxxefxgx", "1ab2cd34ef5g6", 6 ));

  // many ops
  _.extend(tests, createTests('xabxcdxxefxgx', 'abcdefg', 6));
  _.extend(tests, createTests('javawasneat', 'scalaisgreat', 7));
  _.extend(tests, createTests("example", "samples", 3));
  _.extend(tests, createTests("forward", "drawrof", 6));
  _.extend(tests, createTests("sturgeon", "urgently", 6 ));
  _.extend(tests, createTests("levenshtein", "frankenstein", 6 ));
  _.extend(tests, createTests("distance", "difference", 5 ));
  _.extend(tests, createTests("distance", "eistancd", 2 ));

  // non-latin
  _.extend(tests, createTests('你好世界', '你好', 2, {
    description: 'non-latin'
  }));
  _.extend(tests, createTests('因為我是中國人所以我會說中文', '因為我是英國人所以我會說英文', 2, {
    description: 'non-latin'
  }));

  // collation (see https://github.com/hiddentao/fast-levenshtein/issues/7)
  _.extend(tests, createTests('mikailovitch', 'Mikhaïlovitch', 3, {
    description: 'collator OFF'
  }));
  _.extend(tests, createTests('mikailovitch', 'Mikhaïlovitch', 1, {
    useCollator: true,
    description: 'collator ON'
  }));

  // long text
  _.extend(tests, createTests(
      'Morbi interdum ultricies neque varius condimentum. Donec volutpat turpis interdum metus ultricies vulputate. Duis ultricies rhoncus sapien, sit amet fermentum risus imperdiet vitae. Ut et lectus',
      'Duis erat dolor, cursus in tincidunt a, lobortis in odio. Cras magna sem, pharetra et iaculis quis, faucibus quis tellus. Suspendisse dapibus sapien in justo cursus',
      143,
      {
        description: 'long text'
      }
  ));

  exports['Basic'] = tests;
})();

// ------ Huge tests ----- //

var text1 = fs.readFileSync(__dirname + '/text1.txt', 'utf-8'),
    text2 = fs.readFileSync(__dirname + '/text2.txt', 'utf-8');

exports['Huge'] = {
  'default': function() {
    var startTime = new Date().valueOf();

    var distance = levenshtein.get(text1, text2);

    var timeElapsed = new Date().valueOf() - startTime;

    console.log(timeElapsed + ' ms');
    
    expect(distance).to.eql(194);
  },
};

