/**
  * Author: Alonso Vidales <alonso.vidales@tras2.es>
  * Date: 2012-02-13
  *
  * This class represent the user space ship
  *
  * @see config.spaceShip
  *
  * @param config <object>: The global config object
  * @param inShields <array>: The array of total objects of the class Shield
  * @param inMonsters <array>: The array of total objects of the class Monster
  * @param inCallWhenDie <function>: The function to call then the space ship is destroyed
  *
  */
var SpaceShip = (function(config, inShields, inMonsters, inCallWhenDie) {
	// The div element that will be used to represent the bomb
	var divElem = null;
	// The div element of the bottom line
	var bottomLine = null;
	// The way of the movement, 'right' string is to the right, 'left' string is to
	// the left, and null is stopped
	var currMovement = null;
	// The current possition of the ship in pixels
	var shipXpos = 0;
	// Will be used to know if the ship was destroyed 
	var alive = true;
	// Will contain the Missile object when the user launchs it
	var missile = null;

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
		var x = config.spaceShip.initXpos + (shipXpos * config.spaceShip.velocity);

		return {
			'topLeftX': x,
			'topLeftY': config.spaceShip.initYpos,
			'bottRightX': x + config.spaceShip.width,
			'bottRightY': config.spaceShip.initYpos + config.spaceShip.height};
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
	  * This method is called when the user want to launch a missile
	  */
	var shoot = function() {
		if ((missile !== null) && (missile.isRunning())) {
			return true;
		}

		// Get the area of the ship, and launchs the missile at the middle of
		// the area, and at the top of the space ship and creates the missile
		var area = getArea();
		missile = new Missile(config, inShields, inMonsters, ((area.topLeftX + area.bottRightX) / 2), area.topLeftY);
		missile.init();
	};

	/**
	  * Should be called after the destroy sound and animation finish
	  */
	var finishDie = function() {
		alive = true;
		// Will remove the live
		inCallWhenDie();
		// Return the ship to the origin, and show the ship icon
		shipXpos = 0;
		divElem.removeClass('destroy');
	};

	return {
		/**
		  * This method will be called when the space ship is destoyed, it makes
		  * a sound, and call to the method to discount a live
		  */
		die: function() {
			alive = false;
			// Show the destroyed ship, and play a ound, after the shound finish call to the finishDie method
			divElem.addClass('destroy');
			soundManager.play(config.spaceShip.killedSound, finishDie);
		},

		/**
		  * This method should be called for the bombs to know if exists an impact with the space ship
		  *
		  * @param inArea <object> : The area of the element that can impact with the ship
		  *
		  * @return <bool> : true if the impact success, false if not, or if the ship is destroyed
		  */
		checkCrash: function(inArea) {
			var area = getArea();

			return (
				(inArea.topLeftX > area.topLeftX) && 
				(inArea.bottRightX < area.bottRightX) && 
				(inArea.topLeftY < area.topLeftY) && 
				(inArea.bottRightY > area.topLeftY));
		},

		/**
		  * This method is called each iteration of the ship loop by the main thread of the application
		  *
		  * @param inIters <int> : The number of iterations of the ship loop
		  */
		updateStatus: function(inIters) {
			// Check if the user want to move the ship and move the ship if is it
			if (currMovement !== null) {
				if (currMovement == 'left') {
					if (shipXpos > 0) {
						shipXpos--;
					}
				} else {
					if (shipXpos < config.spaceShip.maxXPos) {
						shipXpos++;
					}
				}
			}

			// Render the ship at the current position
			reDraw();
		},

		/**
		  * This metod initialize the ship object rendering the ship, and adding
		  * the events to allow the user to control the ship.
		  */
		init: function() {
			// Create the bottom line that limit the field
			bottomLine = $('<div>').addClass('bottom_line');
			$(config.mainCanvas).append(bottomLine);

			// Create the ship div and render it
			divElem = $('<div>').addClass('ship');
			$(config.mainCanvas).append(divElem);
			reDraw();

			// Add the events
			$(document).keydown(function (inEvent) {
				if (!alive) {
					return true;
				}

				// Right cursor key
				if (inEvent.keyCode == 39) {
					currMovement = 'right';
				}

				// Left cursor key
				if (inEvent.keyCode == 37) {
					currMovement = 'left';
				}

				// Up cursor key or space key
				if ((inEvent.keyCode == 32) || (inEvent.keyCode == 38)) {
					shoot();
				}
			});

			// Stop me movement when the user release the key
			$(document).keyup(function () {
				currMovement = null;
			});
		}
	}
});
