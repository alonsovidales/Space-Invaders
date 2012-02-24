/**
  * Author: Alonso Vidales <alonso.vidales@tras2.es>
  * Date: 2012-02-13
  *
  * This class handle the scoreboard that shows to the user the
  * current score and the top score
  *
  * @see config.scoreboard
  *
  * @param config <object>: The global config object
  *
  */
var Scoreboard = (function(config) {
	// The div element that will be used to represent the bomb
	var divElem = null;
	// Will contain the current score
	var score = 0;
	// Will containt the max score from localStorage
	var hightScore = 0;

	return {
		/**
		  * Add the socre after an event is produced depending of the kind of the event
		  *
		  * @param inType <string> : The event name
		  */
		addScore: function(inType) {
			var points = 0;

			switch (inType)
			{
				case 'misteryShip':
					points = Math.floor(Math.random() * 100) + 100;
					break;

				case 'squid':
					points = 40;
					break;

				case 'slim':
					points = 20;
					break;

				case 'fat':
					points = 10;
					break;
			}

			score += points;

			// Update the current score number
			scoreCounterSpan.html(score);

			return points;
		},

		/**
		  * Return a integer value with the current score
		  *
		  * @return <int>: The current score
		  */
		getScore: function() {
			return score;
		},

		/**
		  * Creates the scoreboard and render it
		  */
		init: function() {
			// Get the hight score from the localStorage and set it to 0 if is not defined
			if (!(hightScore = localStorage.getItem('hightScore'))) {
				hightScore = 0;
			}

			// Creates and render the different DOM elements
			scoreCounterSpan = $('<span>').html(score);

			divElem = $('<div>').addClass('scoreboard').html('Score: ').append(scoreCounterSpan).css('left', config.scoreboard.x).css('top', config.scoreboard.y);
			$(config.mainCanvas).append(divElem);

			$(config.mainCanvas).append($('<div>').addClass('scoreboard').html('Hight Score: ' + hightScore).css('left', config.scoreboard.x + 150).css('top', config.scoreboard.y));
		}
	};
});
