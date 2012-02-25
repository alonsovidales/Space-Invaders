/**
  * Author: Alonso Vidales <alonso.vidales@tras2.es>
  * Date: 2012-02-13
  *
  * This class is used to create the missiles that the player space ship will
  * launch.
  *
  * @see config.missile
  *
  * @param config <object>: The global config object
  * @param inShields <array>: The array of total objects of the class Shield
  * @param inMonsters <array>: The array of total objects of the class Monster
  * @param inX <int>: The absolute x axis where the missile will start
  * @param inY <int>: The absolute y axis where the missile will start
  *
  */
var Missile = (function(config, inShields, inMonsters, inX, inY) {
	// The div element that will be used to represent the missile
	var divElem = null;
	// The position on the Y axes are relative to the config.missile.steep param
	var yPos = 0;
	// Will control the loop for each missile object, this loops are independients
	// of the rest of the game loops
	var loop = null;
	// Will be true if this missile is advancing against the monsters
	var running = true;

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
			'topLeftX': inX,
			'topLeftY': inY - config.missile.height - (config.missile.steep * yPos),
			'bottRightX': inX,
			'bottRightY': inY - (config.missile.steep * yPos)};
	};

	/**
	  * Check if the missile area are in the area of the player space ship
	  *
	  * @see Shield.checkCrash method
	  * @see Monster.checkCrash method
	  * @see Monster.die method
	  *
	  * @return <bool> : true if the missile and space ship area crases, false of not
	  */
	var checkCrash = function() {
		// Will be used to know if the missile kill any monster
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
			// Iterate over all the monsters array sending the missile area to each monster
			$.each(inMonsters, function(inKey, inMonster) {
				// If the missile area are in the area of a monster, kill it
				if (inMonster.checkCrashFromBottom(area)) {
					inMonster.die();
					issetCrash = true;
				}
			});
		}

		// If one of the monsters are killed, of the missie is out of the canvas, remove the
		// missile and return true
		if ((area.topLeftY <= 0) || (issetCrash)) {
			running = false;
			divElem.remove();

			return true;
		} else {
			return false;
		}
	};

	/**
	  * This method render the missile on the current position that is calculated
	  * using the getArea method
	  */
	var reDraw = function() {
		var area = getArea();
		divElem.css('left', area.topLeftX).css('top', area.topLeftY);
	};

	/**
	  * This is the loop method that will refresh the missile object status.
	  * We use an independient loop to be more flexible setting the speed
	  *
	  * @see config.missile.loopSpeed
	  */
	var missileLoop = function() {
		yPos++;

		if (!checkCrash()) {
			loop = setTimeout(missileLoop, config.missile.loopSpeed);
		}

		reDraw();
	};

	return {
		/**
		  * Returns the status of the missile
		  *
		  * @return <bool>: true if the missile is running against the monsters,
		  * 		    or false if the missile was destroyed
		  */
		isRunning: function() {
			return running;
		},

		/**
		  * Init method, render the missile and init the loop of this
		  */
		init: function() {
			// Play the sound of the shot
			soundManager.play(config.missile.sound);

			divElem = $('<div>').addClass('missile');
			$(config.mainCanvas).append(divElem);

			missileLoop();
		}
	};
});
