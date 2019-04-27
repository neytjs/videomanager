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

// method to extract text between quotation marks in a string
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

// for pruning out the songs that are not in the passed in year range
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

    static occurrenceCounter(the_array, test_value) {
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
          var occur_counter = 0;
          for (var i = 0; i < occurrences.length; i++) {
            if (occurrences[i][test_value] === last_occurrence_entry) {
              occurrences[i].quantity = occurrences[i].quantity + 1;
              occur_counter = occur_counter + 1;
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
}

export default Utilities;
