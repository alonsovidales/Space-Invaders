/**
  * Author: Alonso Vidales <alonso.vidales@tras2.es>
  * Date: 2012-02-13
  *
  * This class is used to handle all the different types of flying monsters
  *
  * @see config.monster
  *
  * @param config <object>: The global config object
  * @param inType <strign>: The type of the monster, will be used for the
  * 			    punctuation and CSS class
  * @param inInitialStatus <bool>: The initial CSS status of the monster
  *				   is used to render the first status of the
  *				   monster.
  * @param inXposition <int>: The initial position in columns inside the monsters
  *			      matrix the width and heigth of each cell are defined by
  *			      config.monster.advanceTopLeftPx
  * @param inYposition <int>: The initial position in rows inside the monsters
  *			      matrix the width and heigth of each cell are defined by
  *			      config.monster.advanceTopLeftPx
  * @param inCallWhenDie <function>: The function to call when the monster is die
  * @param inShields <array>: The array of total objects of the class Shield
  * @param inSpaceShip <SpaceShip object>: The player space ship object
  * @param inCallGameOver <function>: The function to call when the monster produced
  *				      a end of game over
  *
  */
var Monster = (function(config, inType, inInitialStatus, inXposition, inYposition, inCallWhenDie, inShields, inSpaceShip, inCallGameOver) {
	// The div element that will be used to represent the monster
	var divElem = null;
	// The bombs that this monster launch
        var bombs = [];
	// Boolean var to handle the monster status, tue is alive, false is die
        var alive = true;
	// The monster type, will contain the string with the name of the type
        var type = inType;
	// The status of the CSS to produce the animation effect
	var cssStatus = inInitialStatus;
	// Will determine if the monster is advancing to the left or to the right
	var slidingToRight = true;
	// The relative position of the monter inside the monsters matrix
	var relPos = {
		'x': 0,
		'y': 0};

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
		var topLeftX = config.monster.initXtab + (config.monster.widthHeight * inXposition) + (relPos.x * config.monster.advanceTopLeftPx);
		var topLeftY = config.monster.initYtab + (config.monster.widthHeight * inYposition) + (relPos.y * config.monster.advanceTopLeftPx);

		return {
			'topLeftX': config.monster.initXtab + (config.monster.widthHeight * inXposition) + (relPos.x * config.monster.advanceTopLeftPx),
			'topLeftY': config.monster.initYtab + (config.monster.widthHeight * inYposition) + (relPos.y * config.monster.advanceTopLeftPx),
			'bottRightX': (topLeftX + config.monster.widthHeight),
			'bottRightY': (topLeftY + config.monster.widthHeight)
		};
	};

	/**
	  * Move the div element to the current position, and handle the animation of the monster
	  */
	var reDraw = function () {
		// Get the current area, and move the div to the position
		var area = getArea();
		divElem.css('left', area.topLeftX).css('top', area.topLeftY);

		// Handle the animation of the div element
		if (cssStatus) {
			divElem.addClass('animation');
		} else {
			divElem.removeClass('animation');
		}
	};

	/**
	  * Method called when the monster "decides" to launch a bomb, create the bomb element
	  *
	  * @see Bomb
	  */
	var launchBomb = function() {
		// Get the current area
		var area = getArea();
		// Create a bomb object taking the middle of the area as the X axis,
		// and the bottom as Y and add it to the array of bombs
		var bomb = new Bomb(config, area.bottRightX - (config.monster.widthHeight / 2), area.bottRightY, inShields, inSpaceShip);
		bomb.init();
		bombs.push();
	};

	return {
		/**
		  * This method updates te status of the monste according to the current monsters loop iteration
		  *
		  * @param inIterationNum <int> : The number of the iteration from the begging of the game
		  */
		updateStatus: function(inIterationNum) {
			// Check if the monster is alive, if id dead don't execute any update
			if (!alive) {
				divElem.remove();
				return true;
			}

			// Get the current area
			var area = getArea();
			// If the monster touch the bottom limit, the game ends, Game Over :(
			if (area.bottRightY > config.monster.bottomLimit) {
				inCallGameOver(false);
			}

			// Random calculation to determinate if the monster should launch a bomb
			if ((Math.floor(Math.random() * 10000) % config.monster.bombsProbability) === 0) {
				launchBomb();
			}

			// Check if the monster should move in this loop
			if ((inIterationNum % config.monster.loopsToMove) === 0)
			{
				// Check if should change the way of the monster movement and go down for a row
				if (
					((relPos.x == config.monster.maxXMovements) && (slidingToRight)) || 
					((relPos.x === 0) && (!slidingToRight)))
				{
					slidingToRight = !slidingToRight;

					relPos.y++;

					if (!slidingToRight)
					{
						relPos.x++;
					}
					else
					{
						relPos.x--;
					}
				}

				// Move the monster mone column to the left or to the right depending
				// of the slidingToRight var
				if (slidingToRight) {
					relPos.x++;
				} else {
					relPos.x--;
				}
			}

			// Change the image to create the animation
			cssStatus = !cssStatus;

			// Redraw the monster to adjust it to the current parameters
			reDraw();
		},

		/**
		  * This method will be called then the monster should die, executes a sound and kill the monster
		  */
		die: function() {
			// Execute the die sound
			soundManager.play(config.monster.killedSound);
			// Show the explosion image
			divElem.addClass('killed');
			inCallWhenDie(type);
			alive = false;
		},

		/**
		  * This method should be called for the missiles to know if exists an impact with the monster
		  *
		  * @param inArea <object> : The area of the element that can impact with the monster
		  *
		  * @return <bool> : true if the impact success, false if not, or false if the monster is die
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
		  * Return if the monster is die or alive
		  *
		  * @retrn <bool>: true if the monster is alive, false if not
		  */
		isAlive: function() {
			return alive;
		},

		/**
		  * Create the div of the monster, and render it on the main canvas
		  */
		init: function() {
			// Create the img element that will represent the monster
			divElem = $('<div>').addClass('monster').addClass(type);
			$(config.mainCanvas).append(divElem);
			reDraw();
		}
	};
});
