/**
  * Author: Alonso Vidales <alonso.vidales@tras2.es>
  * Date: 2012-02-13
  *
  * This class is used to control and show to the user the number
  * of lives that him have on a graphical way
  *
  * @see config.livesBoard
  *
  * @param config <object>: The global config object
  *
  */
var LivesBoard = (function(config) {
	// Will contain the div objects for render the lives images
	var livesDivs = [];

	/**
	  * Redraw the board removing on of the lives, will be called when the
	  * user lose a live
	  */
	var reDraw = function() {
		livesDivs[config.livesBoard.lives].remove();
	};

	return {
		/**
		  * Initial method to be used for render the board
		  */
		init: function() {
			// Add the number of lives that the user will have
			for (var count = 0; count < config.livesBoard.lives; count++) {
				// Create and append the image rendering it on the correct possition
				var xAxe = config.livesBoard.x + (count * config.spaceShip.width);
				var liveDiv = $('<div>').addClass('ship').css('left', xAxe).css('top', config.livesBoard.y);
				livesDivs.push(liveDiv);
				$(config.mainCanvas).append(liveDiv);
			}
		},

		/**
		  * Method to be called to remove one of the lives of the user
		  *
		  * @return <bool> : Returns true if the user have more lives, false if the user
		  *		     don't have more lives left
		  */
		removeLive: function() {
			if (config.livesBoard.lives === 0) {
				return false;
			} else {
				// Remove one of the lives and redraw the board
				config.livesBoard.lives--;
				reDraw();
				return true;
			}
		}
	};
});
