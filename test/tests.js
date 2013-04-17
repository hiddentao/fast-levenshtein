var chai = require('chai'),
    fs = require('fs'),
    levenshtein = require('../levenshtein');

var expect = chai.expect,
    assert = chai.assert;


/**
 * Create a test function.
 * @return Function
 */
var createTestFunction = function(str1, str2, expectedLength) {
  return function() {
    expect(levenshtein.get(str1, str2)).to.eql(expectedLength);
  };
};


// ----- Basic tests ----- //

(function() {

  var tests = {},
      str = 'hello',
      str1 = str,
      str2 = str,
      i;

  for (i=0; i<=str.length; ++i) {
    str1 = str.substr(0,i);
    str2 = str;

    tests[ (0 === str1.length ? '(empty)' : str1) + ' <-> ' + str2] = createTestFunction(str1, str2, str.length - i);
  }

  for (i=str.length-1; i>=0; --i) {
    str1 = str;
    str2 = str.substr(0,i);

    tests[ str1 + ' <-> ' + (0 === str2.length ? '(empty)' : str2)] = createTestFunction(str1, str2, str.length - i);
  }

  tests['Hello <-> hello'] = createTestFunction('Hello', 'hello', 1);
  tests['book <-> back'] = createTestFunction('book', 'back', 2);
  tests['kitten <-> sitting'] = createTestFunction('kitten', 'sitting', 3);

  exports['Basic'] = tests;

})();


// ------ Advanced tests ----- //

exports['Advanced'] = {
  'non-latin': createTestFunction('因為我是中國人所以我會說中文', '因為我是英國人所以我會說英文', 2),
  'sentence': createTestFunction(
      'Morbi interdum ultricies neque varius condimentum. Donec volutpat turpis interdum metus ultricies vulputate. Duis ultricies rhoncus sapien, sit amet fermentum risus imperdiet vitae. Ut et lectus',
      'Duis erat dolor, cursus in tincidunt a, lobortis in odio. Cras magna sem, pharetra et iaculis quis, faucibus quis tellus. Suspendisse dapibus sapien in justo cursus',
      143
  ),
  'long text': (function() {
    var text1 = fs.readFileSync(__dirname + '/text1.txt', 'utf-8'),
        text2 = fs.readFileSync(__dirname + '/text2.txt', 'utf-8');

    return createTestFunction(text1, text2, 5101);
  })()
};


