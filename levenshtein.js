(function() {
  'use strict';

  /**
   * Extend an Object with another Object's properties.
   *
   * The source objects are specified as additional arguments.
   *
   * @param dst Object the object to extend.
   *
   * @return Object the final object.
   */
  var _extend = function(dst) {
    var sources = Array.prototype.slice.call(arguments, 1);
    for (var i=0; i<sources.length; ++i) {
      var src = sources[i];
      for (var p in src) {
        if (src.hasOwnProperty(p)) dst[p] = src[p];
      }
    }
    return dst;
  };

  /**
   * Based on the algorithm at http://en.wikipedia.org/wiki/Levenshtein_distance.
   */
  var Levenshtein = {
    /**
     * Calculate levenshtein distance of the two strings.
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
          i, j;

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
    },

    /**
     * Asynchronously calculate levenshtein distance of the two strings.
     *
     * @param str1 String the first string.
     * @param str2 String the second string.
     * @param cb Function callback function with signature: function(Error err, int distance)
     * @param [options] Object additional options.
     * @param [options.progress] Function progress callback with signature: function(percentComplete)
     */
    getAsync: function(str1, str2, cb, options) {
      options = _extend({}, {
        progress: null
      }, options);

      // base cases
      if (str1 === str2) return cb(null, 0);
      if (str1.length === 0) return cb(null, str2.length);
      if (str2.length === 0) return cb(null, str1.length);

      // two rows
      var previous  = new Array(str2.length + 1),
          current = new Array(str2.length + 1),
          i, j, startTime, currentTime;

      // initialise previous row
      for (i=0; i<previous.length; ++i) {
        previous[i] = i;
      }

      current[0] = 1;

      i = 0;
      j = -1;

      var __calculate = function() {
        // reset timer
        startTime = new Date().valueOf();
        currentTime = startTime;

        // keep going until one second has elapsed
        while (currentTime - startTime < 1000) {
          // reached end of current row?
          if (str2.length <= (++j)) {
            // copy current into previous (in preparation for next iteration)
            previous[j] = current[j];

            // if already done all chars
            if (str1.length <= (++i)) {
              return cb(null, current[str2.length]);
            }
            // else if we have more left to do
            else {
              current[0] = i + 1;
              j = 0;
            }
          }

          // calculation
          current[j + 1] = Math.min(
              previous[j] + ( (str1.charAt(i) === str2.charAt(j)) ? 0 : 1 ),    // substitution
              current[j] + 1,    // insertion
              previous[j + 1] + 1 // deletion
          );

          // copy current into previous (in preparation for next iteration)
          previous[j] = current[j];

          // get current time
          currentTime = new Date().valueOf();
        }

        // send a progress update?
        if (null !== options.progress) {
          try {
            options.progress.call(null, (i * 100.0/ str1.length));
          } catch (err) {
            return cb('Progress callback: ' + err.toString());
          }
        }

        // next iteration
        setTimeout(__calculate(), 0);
      };

      __calculate();
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

