/**
  * Author: Alonso Vidales <alonso.vidales@tras2.es>
  * Date: 2012-02-13
  *
  * This class is used to handle the "Mistery Ship", that will appear sometime on the game.
  * This is a singleton class due to we can only have one ship of this kind.
  *
  * @see config.misteryShip
  *
  * @param config <object>: The global config object
  *
  */
var misteryShip = (function(config) {
	// The div element that will be used to represent the ship
	var divElem = null;
	// Boolean var to handle the ship status, tue is alive, false is die
        var alive = false;
	// The relative position of the ship in pixels for the x axis
	var xPosPx = 0;
	// The funciton that will be callen when the ship is killed, this function should return a
	// integer with the points assigned
	var callWhenDie = null;

	/**
	  * This method returns the absolute position in pixels of the top left and bottom
	  * right corners
	  *
	  * @return <object> :
	  *             - topLeftX <int> : The X axe absolute position in pixels of the top left corner
	  *             - topLeftY <int> : The Y axe absolute position in pixels of the top left corner
	  *             - bottRightX <int> : The X axe absolute position in pixels of the bottom right corner
	  *             - bottRightY <int> : The Y axe absolute position in pixels of the bottom right corner
	  */
	var getArea = function() {
		return {
			'topLeftX': xPosPx,
			'topLeftY': config.misteryShip.initY,
			'bottRightX': xPosPx + config.misteryShip.width,
			'bottRightY': config.misteryShip.initY + config.misteryShip.height};
	};

	/**
	  * Move the div element to the current position
	  */
	var reDraw = function () {
		// Get the current area, and move the div to the position
		var area = getArea();
		divElem.css('left', area.topLeftX).css('top', area.topLeftY);
	};

	/**
	  * This method creates a loop that will play the mistery sound when the ship is running
	  *
	  * @see config.misteryShip.backgrounSound
	  */
	var misterySound = function() {
		if (alive) {
			// Play the sound and after the end of this call this method
			soundManager.play(config.misteryShip.backgrounSound, misterySound);
		}
	};

	/**
	  * Will remove the div element for the ship, and stop the mistery sound
	  */
	var removeAll = function() {
		soundManager.stop(config.misteryShip.backgrounSound);
		alive = false;
		divElem.remove();
	};

	return {
		/**
		  * This method updates te status of the ship according to the current loop iteration
		  *
		  * @param inIterationNum <int> : The number of the iteration from the begging of the game
		  */
		updateStatus: function(inIterationNum) {
			// Check if the ship is alive, if is dead don't execute any update
			if (!alive) {
				return true;
			}

			// Move the ship to the right adding the number of pixels from the configuration
			xPosPx += config.misteryShip.speed;

			// Check if the mistery ship is at the end of the screen, if it is, remove the ship
			if ((xPosPx + config.misteryShip.width) > $(config.mainCanvas).width()) {
				removeAll();
			}

			// Redraw the ship to adjust it to the current parameters
			reDraw();
		},

		/**
		  * This method will be called then the ship is die, executes a sound and show the points obtained
		  */
		die: function() {
			// Get the points obtained
			var pointsObtained = callWhenDie('misteryShip');

			// Execute the die sound (is shared with the monsters)
			soundManager.play(config.monster.killedSound);
			// Show the points
			divElem.removeClass('mistery_ship').addClass('mistery_ship_points').html(pointsObtained);

			// Keep the points for one second
			setTimeout(removeAll, 1000);
		},

		/**
		  * This method should be called for the missiles to know if exists an impact with the ship
		  *
		  * @param inArea <object> : The area of the element that can impact with the ship
		  *
		  * @return <bool> : true if the impact success, false if not, or true if the ship is destroyed
		  */
		checkCrashFromBottom: function(inArea) {
			if (!alive) {
				return false;
			}

			var area = getArea();

			return (
				(inArea.topLeftX > area.topLeftX) &&
				(inArea.bottRightX < area.bottRightX) &&
				(inArea.topLeftY > area.topLeftY) &&
				(inArea.topLeftY < area.bottRightY));
		},

		/**
		  * Return if the ship is destroyed or not
		  *
		  * @retrn <bool>: true if the ship is destroyed, false if not
		  */
		isAlive: function() {
			return alive;
		},

		/**
		  * Create the div of the ship, and render it on the main canvas
		  *
  		  * @param inCallWhenDie <function>: The function to call when the mistery ship is destroyed
		  */
		init: function(inCallWhenDie) {
			if (!alive) {
				callWhenDie = inCallWhenDie;

				// Reset the parameters
				alive = true;
				xPosPx = 0;
				misterySound();

				// Create the img element that will represent the ship
				divElem = $('<div>').addClass('mistery_ship');
				$(config.mainCanvas).append(divElem);

				reDraw();
			}
		}
	};
})(config);
