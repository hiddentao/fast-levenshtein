(function() {
  'use strict';

  var Levenshtein = {

      /**
       * Calculate levenshtein distance of the two strings.
       *
       * Based on the algorithm at http://en.wikipedia.org/wiki/Levenshtein_distance.
       *
       * @param str1 String the first string.
       * @param str2 String the second string.
       * @return Integer the levenshtein distance (0 and above).
       */
      get: function(str1, str2) {
        // base cases
        if (str1 === str2) return 0;
        if (str1.length === 0) return str2.length;
        if (str2.length === 0) return str1.length;

        // two rows
        var previous  = new Array(str2.length + 1),
            current = new Array(str2.length + 1),
            i, j, tmp;

        // initialise previous row
        for (i=0; i<previous.length; ++i) {
          previous[i] = i;
        }

        // calculate current row distance from previous row
        for (i=0; i<str1.length; ++i) {
          current[0] = i + 1;

          for (j=0; j<str2.length; ++j) {
            current[j + 1] = Math.min(
                previous[j] + ( (str1.charAt(i) === str2.charAt(j)) ? 0 : 1 ),    // substitution
                current[j] + 1,    // insertion
                previous[j + 1] + 1 // deletion
            );

            // copy current into previous (in preparation for next iteration)
            previous[j] = current[j];
          }

          // copy current into previous (in preparation for next iteration)
          previous[j] = current[j];
        }

        return current[str2.length];
      }

  };


  if (typeof define !== "undefined" && define !== null && define.amd) {
    define(function() {
      return Levenshtein;
    });
  } else if (typeof module !== "undefined" && module !== null) {
    module.exports = Levenshtein;
  } else {
    if (typeof window !== "undefined" && window !== null) {
      window.Levenshtein = Levenshtein;
    }
  }
}());

