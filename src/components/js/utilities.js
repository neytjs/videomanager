import XRegExp from 'xregexp';

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
        song_string = this.keepAllLettersNumbersSpacesQuotes(song_string);
        song_string = song_string.toLowerCase();
        song_string = song_string.trim();

        if (property_name === "video_lyrics" || property_name === "video_tags") {
          let searchedRegExp = XRegExp(`(^|[^\\pL])(${searched})(?![\\pL])`, 'gi');

          if (searchedRegExp.test(song_string) === true) {

            matches.push(songs_lyrics[j]);
          }
        } else {
          let searchedRegExp = XRegExp(`(^|[^\\pL])(${searched})(?![\\pL])`, 'gi');

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
            song_string = this.keepAllLettersNumbersSpacesQuotes(song_string);
            song_string = song_string.toLowerCase();
            song_string = song_string.trim();

            let searchedRegExp = XRegExp(`(^|[^\\pL])(${searched})(?![\\pL])`, 'gi');

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


  static arrayComparerFindAny(search_lyrics, songs_lyrics, property_name) {
    let search_lyrics_length = search_lyrics.length;
    let songs_lyrics_length = songs_lyrics.length;

    if (search_lyrics_length > 0) {
      let matches = [];

        for (var j = 0; j < songs_lyrics_length; j++) {

          for (var i = 0; i < search_lyrics_length; i++) {
            if (songs_lyrics[j][property_name] === search_lyrics[i]) {
              matches.push(songs_lyrics[j]);
            }
          }
        }

        return matches;
      } else {
        return songs_lyrics;
      }
  }

  static findExactStringMatches(search, docs, property_name) {
    let docs_length = docs.length;

    if (search !== "") {
      let matches = [];

        for (var j = 0; j < docs_length; j++) {
          if (docs[j][property_name].toLowerCase() === search.toLowerCase()) {
            matches.push(docs[j]);
          }
        }

        return matches;
      } else {
        return docs;
      }
  }

  static customSplit(strng) {
    let test_strng = this.keepAllLettersNumbersQuotes(strng);

    if (test_strng.length > 0) {

      strng = this.keepAllLettersNumbersSpacesQuotes(strng);

      strng = strng.toLowerCase();

      strng = strng.trim();

      let reg_exp = /"(.*?)"/g;

      let quotes = strng.match(reg_exp) ? strng.match(reg_exp) : [];
        quotes = quotes.join();
        quotes = this.keepAllLettersNumbersSpaces(quotes);
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
      let arguments_length = arguments.length;
      let set = new Set();
      let occurrences = [];

      for (let i = 0, length = the_array.length; i < length; i++) {
        set.add(the_array[i][test_value]);
      }

      function insertOccurrenceCount(value) {
        let counter = 0;
        let count_vals = [];
        let elem = {};
        for (let i = 0, length = the_array.length; i < length; i++) {
          if (value === the_array[i][test_value]) {
            counter = counter + 1;
            elem = the_array[i];
            if (arguments_length > 2) {
              let occurrence_count_property = parseInt(the_array[i][count_property]);
              count_vals.push(occurrence_count_property);
            }
          }
        }
        elem.quantity = counter;
        if (count_vals.length > 0) {
          elem.count_property = count_vals;
        }
        occurrences.push(elem);
      }
      set.forEach(insertOccurrenceCount);

      return occurrences;
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

  static keepAllLettersNumbers(string) {
    if (typeof string !== 'string') {
      string = "";
    }
    return XRegExp.replace(string, XRegExp('[^\\s"\\p{N}\\p{L}-]', 'gi'), "");
  }

  static keepAllLettersNumbersQuotes(string) {
    if (typeof string !== 'string') {
      string = "";
    }
    return XRegExp.replace(string, XRegExp('[^\\"\\p{N}\\p{L}-]', 'gi'), "");
  }

  static keepAllLettersNumbersSpaces(string) {
    if (typeof string !== 'string') {
      string = "";
    }
    return XRegExp.replace(string, XRegExp('[^\\s\\p{N}\\p{L}-]', 'gi'), "");
  }

  static keepAllLettersNumbersSpacesQuotes(string) {
    if (typeof string !== 'string') {
      string = "";
    }
    return XRegExp.replace(string, XRegExp('[^\\s"\\p{N}\\p{L}-]', 'gi'), "");
  }


  static htmlStringCleanerArrayConverter(string) {
    string = string.replace(/&(#39|apos|quot|lsquo|rsquo|ldquo|rdquo|ndash);/g, "");

    string = string.replace(/(&nbsp;|<([^>]+)>)/ig, " ");

    string = string.replace(/\n/ig, " ");

    string = string.replace(/\s+/g, " ");

    string = this.keepAllLettersNumbersSpaces(string);

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
        tags[i].style.fontSize = 'initial';
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


  static allTags(videos) {
    let tags = {};
    let all_tags = [];
    for (var i = 0, length = videos.length; i < length; i++) {
      for (var j = 0, jlength = videos[i].video_tags.length; j < jlength; j++) {
        tags[videos[i].video_tags[j].toLowerCase()] = videos[i].video_tags[j];
      }
    }
    for (var tag in tags) {
      all_tags.push(tags[tag]);
    }
    all_tags.sort(function(a, b) {
      if (a.toLowerCase() > b.toLowerCase()) {
        return 1;
      }
      if (b.toLowerCase() > a.toLowerCase()) {
        return -1;
      }
    });
    return all_tags;
  }

  static createTagOptions(all_tags) {
    let tag_options = [];
    for (var i = 0, length = all_tags.length; i < length; i++) {
      tag_options.push({ value: all_tags[i], label: all_tags[i] });
    }
    return tag_options;
  }

  static reactSelectStyles(cssTemplate) {
    return {
      control: (provided, state) => ({
        ...provided,
        width: 300,
        background: cssTemplate.body_background_color,
        borderRadius: "3px",
        borderColor: cssTemplate.body_color,
        '&:hover': {
          borderColor: cssTemplate.body_color,
          background: cssTemplate.entry_background
        },
        boxShadow: state.isFocused ? `0 0 0 1px ${cssTemplate.a_color}` : null,
        cursor: "pointer"
      }),
      menu: (provided) => ({
        ...provided,
        width: 300,
        marginTop: 0,
        background: cssTemplate.body_background_color
      }),
      input: (provided) => ({
        ...provided,
        color: cssTemplate.body_color
      }),
      noOptionsMessage: (provided) => ({
        ...provided,
        width: 300,
        color: cssTemplate.body_color
      }),
      placeholder: (provided) => ({
        ...provided,
        color: cssTemplate.body_color
      }),
      clearIndicator: (provided, state) => ({
        ...provided,
        color: state.isFocused ? cssTemplate.body_color : cssTemplate.body_color,
        '&:hover': {
          color: state.isFocused ? cssTemplate.a_color : cssTemplate.a_color,
        }
      }),
      dropdownIndicator: (provided, state) => ({
        ...provided,
        color: state.isFocused ? cssTemplate.body_color : cssTemplate.body_color,
        '&:hover': {
          color: state.isFocused ? cssTemplate.a_color : cssTemplate.a_color,
        }
      }),
      indicatorSeparator: (provided) => ({
        ...provided,
        background: cssTemplate.body_color
      }),
      loadingIndicator: (provided) => ({
        ...provided,
        background: cssTemplate.body_color
      }),
      multiValue: (provided) => ({
        ...provided,
        background: cssTemplate.body_color
      }),
      multiValueLabel: (provided) => ({
        ...provided,
        color: cssTemplate.entry_background
      }),
      multiValueRemove: (provided) => ({
        ...provided,
        color: cssTemplate.entry_background,
        '&:hover': {
          color: cssTemplate.body_color,
          background: cssTemplate.a_color
        }
      }),
      option: (provided, state) => ({
        ...provided,
        width: 300,
        cursor: "pointer",
        background: state.isFocused ? cssTemplate.entry_background : 'transparent',
        '&:hover': {
          background: cssTemplate.entry_background
        },
        '&:active': {
          background: cssTemplate.theader_background
        }
      }),
      valueContainer: (provided) => ({
        ...provided,
        width: 300
      })
    }
  }

  static generateString() {
    let characters = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f", "g", "h", "i",
    "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B", "C",
    "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W",
    "X", "Y", "Z", "_", "-"];
    let characters_length = characters.length;
    let string_length = 30;
    let string_array = [];
    for (var i = 0; i < string_length; i++) {
      let rand_el_numb = Math.floor(Math.random() * Math.floor(characters_length));
      string_array.push(characters[rand_el_numb]);
    }
    return string_array.join("");
  }

  static fileCorruptionCheck(entries) {
    let corrupt = false;
    let counter = [];

    for (var i = 0, length = entries.length; i < length; i++) {
      if (!entries[i].hasOwnProperty("video_title") === true || !entries[i].hasOwnProperty("video_code") === true || !entries[i].hasOwnProperty("video_band") === true || !entries[i].hasOwnProperty("video_genre") === true || !entries[i].hasOwnProperty("video_lyrics") === true || !entries[i].hasOwnProperty("video_lyrics_html") === true || !entries[i].hasOwnProperty("video_year") === true || !entries[i].hasOwnProperty("video_type") === true || !entries[i].hasOwnProperty("video_tags") === true || !entries[i].hasOwnProperty("video_stars") === true || !entries[i].hasOwnProperty("list_id") === true) {
        counter.push(1);
      }
    }

    if (counter.length > 0) {
      corrupt = true;
    }

    return corrupt;
  }

  static matchDetector(matches) {
    let new_list_id = this.generateString();
    function innerRecursiveFunction() {
      let counter = 0;
      for (var i = 0, length = matches.length; i < length; i++) {
        if (new_list_id === matches[i]) {
          counter = counter + 1;
        }
      }
      if (counter > 0) {

        new_list_id = this.generateString();

        innerRecursiveFunction();
      } else {
        matches.push(new_list_id);
      }
    }

    innerRecursiveFunction();

    return {matches: matches, new_list_id: new_list_id};
  }
}

export default Utilities;
