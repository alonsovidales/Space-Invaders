/**
  * Author: Alonso Vidales <alonso.vidales@tras2.es>
  * Date: 2012-02-13
  *
  * This class is used to create the objects for the bombs that
  * monters will launch
  *
  * @see config.bomb
  *
  * @param config <object>: The global config object
  * @param inX <int>: The absolute x axis position in pexels when the bomb will be rendered
  * @param inY <int>: The absolute y axis position in pexels when the bomb will be rendered
  * @param inShields <array>: The array of total objects of the class Shield
  * @param inSpaceShip <SpaceShip object>: The player spaceship object
  *
  */
var Bomb = (function(config, inX, inY, inShields, inSpaceShip) {
	// The div element that will be used to represent the bomb
	var divElem = null;
	// The position on the Y axes are relative to the config.bomb.steep param
	var yPos = 0;
	// Will control the loop for each bomb object, this loops are independients
	// of the rest of the game loops
	var loop = null;

	/**
	  * This method returns the absolute position in pixels of the top left and bottom
	  * right corners
	  *
	  * @return <object> :
	  *		- topLeftX <int> : The X axe absolute position in pixels of the top left corner
	  *		- topLeftY <int> : The Y axe absolute position in pixels of the top left corner
	  *		- bottRightX <int> : The X axe absolute position in pixels of the bottom right corner
	  *		- bottRightY <int> : The Y axe absolute position in pixels of the bottom right corner
	  */
	var getArea = function() {
                return {
			topLeftX: inX,
			topLeftY: inY + (config.bomb.steep * yPos),
			bottRightX: inX,
			bottRightY: inY + config.bomb.bombHeight + (config.bomb.steep * yPos)};
	};

	/**
	  * Check if the bomb area are in the area of the player space ship
	  *
	  * @see Shield.checkCrash method
	  * @see SpaceInvaders.checkCrash method
	  * @see SpaceInvaders.die method
	  *
	  * @return <bool> : true if the bomb and space ship area crases, false of not
	  */
	var checkCrash = function() {
		var issetCrash = false;
		var area = getArea();

		// First, iterate over all the shields array sending the missile area to each shield
                $.each(inShields, function(inKey, inShield) {
			// If the missile area are in the area of a monster, kill it
			if (inShield.checkCrash(area)) {
				issetCrash = true;
			}
		});

		if (!issetCrash) {
			// Call to the ship object to check if the area of this bomb are inside the
			// area of the user space ship
			if (inSpaceShip.checkCrash(area)) {
				// Call to the spaceship die method
				inSpaceShip.die();
				issetCrash = true;
			}
		}

		// Check if the bomb are out of the max area, or if it crases against the player 
		// space ship
		if (issetCrash || (area.bottRightY >= config.bomb.maxYpx)) {
			divElem.remove();

			return true;
		} else {
			return false;
		}
	};

	/**
	  * This method render the bomb on the current position that is calculated
	  * using the getArea method
	  */
	var reDraw = function() {
		var area = getArea();
		divElem.css('left', area.topLeftX).css('top', area.topLeftY);
	};

	/**
	  * This is the loop method that will refresh the bomb object status.
	  * We use an independient loop to be more flexible setting the speed
	  *
	  * @see config.bomb.loopSpeed
	  */
	var bombLoop = function() {
		yPos++;

		if (!checkCrash()) {
			loop = setTimeout(bombLoop, config.bomb.loopSpeed);
		}

		reDraw();
	};

	return {
		/**
		  * Init method, render the bomb and init the loop of this
		  */
		init: function() {
			divElem = $('<div>').addClass('bomb');
			$(config.mainCanvas).append(divElem);

			bombLoop();
		}
	};
});
