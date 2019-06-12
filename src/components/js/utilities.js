/*
The Utilities class contains many important utilities methods that are called at various points
throughout the application. They help manipulate string data that is used in conducting video
searches, for insert/update queries, and for converting into objects/arrays for further use.
The methods also assist in counting the number of occurrences of values in arrays, comparing
two sets of arrays' values, and shuffling values inside arrays. This small utilities library
helps in cleaning, screening, and analyzing much of the application's data.
*/

class Utilities {

  static arrayComparer(search_lyrics, songs_lyrics, property_name) {
    let search_lyrics_length = search_lyrics.length;
    let songs_lyrics_length = songs_lyrics.length;

    if (search_lyrics_length > 0) {
      let matches = [];

      for (var j = 0; j < songs_lyrics_length; j++) {

        let song_string = "";

        if (typeof songs_lyrics[j][property_name] !== "string") {
          song_string = songs_lyrics[j][property_name].join(" ");
        } else {
          song_string = songs_lyrics[j][property_name];
        }

        var searched = search_lyrics.join(" ");
        searched = searched.toLowerCase();
        searched = searched.trim();
        song_string = song_string.replace(/[^A-Za-z0-9"\s]/g, "");
        song_string = song_string.toLowerCase();
        song_string = song_string.trim();

        if (property_name === "video_lyrics" || property_name === "video_tags") {
          let searchedRegExp = new RegExp(`\\b${searched}\\b`, 'i');

          if (searchedRegExp.test(song_string) === true) {

            matches.push(songs_lyrics[j]);
          }
        } else {
          let searchedRegExp = new RegExp(`^\\b${searched}\\b$`, 'i');

          if (searchedRegExp.test(song_string) === true) {

            matches.push(songs_lyrics[j]);
          }
        }
      }

      return matches;
    } else {
      return songs_lyrics;
    }
  }

  static arrayComparerFindAll(search_lyrics, songs_lyrics, property_name) {
    let search_lyrics_length = search_lyrics.length;
    let songs_lyrics_length = songs_lyrics.length;

    if (search_lyrics_length > 0) {
      let matches = [];

        for (var j = 0; j < songs_lyrics_length; j++) {

          let counter = 0;

          for (var i = 0; i < search_lyrics_length; i++) {

            let song_string = "";
            let search_string = "";

            if (typeof songs_lyrics[j][property_name] !== "string") {
              song_string = songs_lyrics[j][property_name].join(" ");
            } else {
              song_string = songs_lyrics[j][property_name];
            }

            var searched = search_lyrics[i];
            searched = searched.toLowerCase();
            searched = searched.trim();
            song_string = song_string.replace(/[^A-Za-z0-9"\s]/g, "");
            song_string = song_string.toLowerCase();
            song_string = song_string.trim();

            let searchedRegExp = new RegExp(`\\b${searched}\\b`, 'i');

            if (searchedRegExp.test(song_string) === true) {

              counter = counter + 1;


              if (counter === search_lyrics_length) {

                matches.push(songs_lyrics[j]);
              }
            }
          }
        }

        return matches;
      } else {
        return songs_lyrics;
      }
  }

  static customSplit(strng) {
    let test_strng = strng.replace(/[^A-Za-z0-9"]/g, "");

    if (test_strng.length > 0) {
      strng = strng.replace(/[^A-Za-z0-9"\s]/g, "");
      strng = strng.toLowerCase();
      strng = strng.trim();

      let reg_exp = /"(.*?)"/g;

      let quotes = strng.match(reg_exp) ? strng.match(reg_exp) : [];
        quotes = quotes.join();
        quotes = quotes.replace(/[^A-Za-z0-9\s]/g, "");
        quotes = quotes.trim();
        quotes = quotes.split(" ");

        if (quotes[0] === "") {
          quotes = [];
        }

      let notquotes = strng.replace(/"(.*?)"/g, "");
        notquotes = notquotes.trim();
        notquotes = notquotes.split(" ");

        if (notquotes[0] === "") {
          notquotes = [];
        }

      return { quotes: quotes, notquotes: notquotes };
    } else {
      return { quotes: [], notquotes: [] };
    }
  }

  static yearPruning(songs, min, max) {
    let songs_length = songs.length;
    let matches = [];

    for (var i = 0; i < songs_length; i++) {

      if (songs[i].video_year >= min && songs[i].video_year <= max) {

        matches.push(songs[i]);
      }
    }

    return matches;
  }

  static splicer(videos, history) {
      var filtering = videos.filter(function (value, index, array) {

          for (var i = 0; i < history.length; i++) {

            if (value.video_code === history[i].video_code) {

              return false;
            }
          }

          return true;
      });
      return filtering;
  }

    static occurrenceCounter(the_array, test_value, count_property) {

      var arguments_length = arguments.length;

      if (the_array.length > 0) {

        var occurrences = [];

        var counter = 0;

        var new_array = [];

        for (var i = 0; i < the_array.length; i++) {
          new_array.push( Object.assign({}, the_array[i]) );
        }

        var nwarlen = the_array.length;

        function recursiveCounter() {

          occurrences.push(new_array[0]);

          new_array.splice(0, 1);

          var last_occurrence_element = occurrences.length - 1;

          var last_occurrence_entry = occurrences[last_occurrence_element][test_value];

          occurrences[last_occurrence_element].quantity = 0;
          if (arguments_length > 2) {
            var last_occurrence_count_property = parseInt(occurrences[last_occurrence_element][count_property]);
            occurrences[last_occurrence_element].count_property = [];
          }

          var occur_counter = 0;

          for (var i = 0; i < occurrences.length; i++) {
            if (occurrences[i][test_value] === last_occurrence_entry) {

              occurrences[i].quantity = occurrences[i].quantity + 1;

              occur_counter = occur_counter + 1;
              if (arguments_length > 2) {

                occurrences[i].count_property.push(last_occurrence_count_property);
              }
            }
          }

          if (occur_counter > 1) {
            occurrences.splice(last_occurrence_element, 1);
          }


          counter = counter + 1;


          if (counter < nwarlen) {
            recursiveCounter();
          }
        }

        recursiveCounter();

        return occurrences;
      }
    }

    static arrayShuffler(the_array) {
    	Array.prototype.shuffle = function (old_index, new_index) {
    		this.splice(new_index, 0, this.splice(old_index, 1)[0]);
    		return this[new_index];
    	};

      let shuffled_array = [];

      let array_length = the_array.length;

      let numbers = [];

      for (var i = 0; i < array_length; i++) {
        numbers.push(i);
      }

      let array_counter = array_length;

      let counter = 0;

      function randomize() {

        array_counter = array_counter - 1;

        counter = counter + 1;

        let random = Math.round(array_counter * Math.random());

        let num = numbers.shuffle(random, array_counter);

        shuffled_array.push(the_array[num]);

        if (counter < array_length) {
          randomize();
        }
      }

      randomize();

      return shuffled_array;
    }

    static doubleShuffler(first_array, second_array) {

    	Array.prototype.shuffle = function (old_index, new_index) {
    		this.splice(new_index, 0, this.splice(old_index, 1)[0]);
    		return this[new_index];
    	};

      let first_shuffled_array = [];
      let second_shuffled_array = [];

      let array_length = first_array.length;

      let numbers = [];

      for (var i = 0; i < array_length; i++) {
        numbers.push(i);
      }

      let array_counter = array_length;

      let counter = 0;

      function randomize() {

        array_counter = array_counter - 1;

        counter = counter + 1;

        let random = Math.round(array_counter * Math.random());

        let num = numbers.shuffle(random, array_counter);

        first_shuffled_array.push(first_array[num]);

        second_shuffled_array.push(second_array[num]);

        if (counter < array_length) {
          randomize();
        }
      }

      randomize();

      return { first_array: first_shuffled_array, second_array: second_shuffled_array };
    }

  static htmlStringCleanerArrayConverter(string) {

    string = string.replace(/(&nbsp;|<([^>]+)>)/ig, " ");

    string = string.replace(/\n/ig, " ");

    string= string.replace(/\s+/g, " ");

    string = string.replace(/[^A-Za-z0-9\s]/g,'');

    string = string.toLowerCase();

    string = string.trim();

    string = string.split(" ");

    return string;
  }

  static htmlTagStyleCleaner(tags) {
    for (var i = 0; i < tags.length; i++) {

      if (tags[i].style.backgroundColor) {
          tags[i].style.backgroundColor = '';
      }

      if (tags[i].style.color) {
        tags[i].style.color = "#000000";
      }

      if (tags[i].style.fontFamily) {
        tags[i].style.fontFamily = '"Times New Roman", Times, serif';
      }

      if (tags[i].style.fontSize) {
        tags[i].style.fontSize = '1rem';
      }

      if (tags[i].style.overflow) {
        tags[i].style.overflow = 'visible';
      }

      if (tags[i].style.lineHeight) {
        tags[i].style.lineHeight = 'normal';
      }

      if (tags[i].style.maxHeight) {
        tags[i].style.maxHeight = 'none';
      }

      if (tags[i].style.margin) {
        tags[i].style.margin = '0';
      }
    }

    return tags;
  }

  static removeDangerousTags(innerHTML) {

    innerHTML = innerHTML.replace(/<\/?(?!br)(?!p)(?!pre)(?!div)(?!span)(?!strong)(?!b)(?!u)(?!i)\w*\b[^>]*>/ig, '');

    innerHTML = innerHTML.replace(/\n/ig, '<br>');    

    innerHTML = innerHTML.replace(/\t/ig, "&nbsp; &nbsp; &nbsp; &nbsp;");

    innerHTML = innerHTML.replace(/\s+(?![^<>]*>)/ig, "&nbsp;");

    return innerHTML;
  }
}

export default Utilities;
