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
        if (property_name === "video_lyrics") {
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

    static pieChartCreator(height, width, pie_chart_data, insert_canvas) {
    		var radius = width * 0.25;
    		var cx = width * 0.4;
    		var cy = height / 2;

    		var color = ['#008000', '#0000FF', '#98B098', '#FF40FF', '#FF0000', '#800080', '#00C0C0', '#FB880D', '#04879A', '#C06300'];

    		var data = [];

    		for (var i = 0; i < pie_chart_data.length; i++) {
    			data.push({ title: pie_chart_data[i].genre_name, percent: pie_chart_data[i].genre_percentage });
    		}

    		var d_length = data.length;

    		var percents = 0;

    		var numbers = [];
    		for (var i = 0; i < color.length; i++) {
    			numbers.push(i);
    		}
    		var counter = numbers.length;

    		Array.prototype.shuffle = function (old_index, new_index) {
    			this.splice(new_index, 0, this.splice(old_index, 1)[0]);
    			return this[new_index];
    		};

    		for (var j = 0; j < d_length; j++) {
    			counter = counter - 1;
    			var random = Math.round(counter * Math.random());
    			percents += data[j].percent;

    			if (j === 0) {
    				data[j].prev_per = 0;
    				data[j].radians = 0;

    				var num = numbers.shuffle(random, counter);

    				data[j].color = color[num];
    			} else {
    				var pers = 0;

    				for (var k = 0; k < j; k++) {
    					pers += data[k].percent;
    					data[j].prev_per = pers;

    					data[j].radians = ((data[j].prev_per / 100) * 360) * Math.PI / 180;

    					var num = numbers.shuffle(random, counter);

    					data[j].color = color[num];
    				}
    			}
    		}

    			var canvas = insert_canvas;
    			var context = canvas.getContext('2d');
    			context.clearRect(0, 0, width, height);
    			context.beginPath();
    			context.arc(cx, cy, radius, 0, 2 * Math.PI, false);
    			context.stroke();

    			for (var i = 0; i < d_length; i++) {
    				if (data[i].percent > 0) {
    					var current_rads = (((data[i].percent / 100) * 360) * Math.PI / 180) + data[i].radians;

    					var title = ' ' + data[i].title + ', ' + data[i].percent.toFixed(2) + '%';

    					context.fillStyle = data[i].color;
    					context.beginPath();
    					context.strokeStyle = '#000000';
    					context.lineWidth = 1;
    					context.moveTo(cx, cy);
    					context.arc(cx, cy, 100, data[i].radians, current_rads, false);
    					context.closePath();

    					var angle = (((data[i].percent / 2) + data[i].prev_per) / 100) * Math.PI * 2;
    					var x = Math.cos(angle) * radius + cx;
    					var y = Math.sin(angle) * radius + cy;
    					context.moveTo(x, y);

    					if (angle <= ((Math.PI * 2) * 0.25)) {
    						context.lineTo(x + 25, y + 25);
    						context.fillText(title, x + 25, y + 25);
    					} else if (angle <= ((Math.PI * 2) * 0.5) && angle >= ((Math.PI * 2) * 0.25)) {
    						context.lineTo(x - 25, y + 25);
    						context.fillText(title, x - 55, y + 35);
    					} else if (angle <= ((Math.PI * 2) * 0.75) && angle >= ((Math.PI * 2) * 0.5)) {
    						context.lineTo(x - 25, y - 25);
    						context.fillText(title, x - 55, y - 30);
    					} else if (angle <= ((Math.PI * 2) * 1) && angle >= ((Math.PI * 2) * 0.75)) {
    						context.lineTo(x + 25, y - 25);
    						context.fillText(title, x + 25, y - 25);
    					}

    					context.closePath();
    					context.fill();
    					context.stroke();
    				}
    			}
    	}
}

export default Utilities;
