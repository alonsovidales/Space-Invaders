/**
  * Author: Alonso Vidales <alonso.vidales@tras2.es>
  * Date: 2012-02-13
  *
  * This class is used to handle all the different types of flying monsters
  *
  * @see config.monster
  *
  * @param config <object>: The global config object
  * @param inShieldPos <int>: The Shield relative position acording to the parameters on the config file
  *			@see config.shield.xSep
  *			@see config.shield.width
  *
  */
var Shield = (function(config, inShieldPos) {
	// The div element that will be used to represent the monster
	var divElem = null;
	// Used to know the current status of the shield, if is destroyed, don't check the crash
	var destroyed = false;
	// Used to store the area as a cache
	var area = {};
	// Will contain the areas where a missile or a bomb has crashed
	var hurts = [];

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
		var topLeftX = (((config.shield.xSep + config.shield.width) * inShieldPos) - config.shield.width);
		var topLeftY = config.shield.y;

		return {
			'topLeftX': topLeftX,
			'topLeftY': topLeftY,
			'bottRightX': (topLeftX + config.shield.width),
			'bottRightY': (topLeftY + config.shield.height)
		};
	};

	var addDestroyedArea = function(inArea) {
		var destroyedDiv = $('<div>').addClass('detroyed');
		var topLeftX = Math.round(inArea.topLeftX - (config.shield.destroyedWidthHeight / 2));
		var topLeftY = Math.round(inArea.topLeftY - (config.shield.destroyedWidthHeight / 2));

		destroyedDiv.css('top', topLeftY).css('left', topLeftX);
		$(config.mainCanvas).append(destroyedDiv);

		hurts.push({
			'topLeftX': topLeftX,
			'topLeftY': topLeftY,
			'bottRightX': topLeftX + config.shield.destroyedWidthHeight,
			'bottRightY': topLeftY + config.shield.destroyedWidthHeight
		});
	};

	return {
		/**
		  * This method will be called then the monster should die, executes a sound and kill the monster
		  */
		die: function() {
			// Execute the die sound
			soundManager.play(config.monster.killedSound);
			// Show the explosion image
			divElem.addClass('killed');
			inCallWhenDie(type);
			destroyed = true;
		},

		/**
		  * This method should be called for the missiles to know if exists an impact with the monster
		  *
		  * @param inArea <object> : The area of the element that can impact with the monster
		  *
		  * @return <bool> : true if the impact success, false if not, or false if the monster is die
		  */
		checkCrash: function(inArea) {
			if (destroyed) {
				return false;
			}

			// Check if the projectil imcasts against the main structure
			var issetCrash = (
				(inArea.topLeftX > area.topLeftX) &&
				(inArea.bottRightX < area.bottRightX) &&
				(inArea.topLeftY > area.topLeftY) &&
				(inArea.topLeftY < area.bottRightY));

			if (issetCrash) {
				// If we have an inpact, check if was a damaged area
				$.each(hurts, function(inKey, inHurt) {
					if (
						(inHurt.topLeftX < inArea.topLeftX) &&
						(inHurt.bottRightX > inArea.bottRightX) &&
						(
							(
								(inHurt.topLeftY > inArea.bottRightY) &&
								(inHurt.bottRightY < inArea.bottRightY)
							) || (
								(inHurt.topLeftY < inArea.topLeftY) &&
								(inHurt.bottRightY > inArea.topLeftY)))) {

						issetCrash = false;

						return false;
					}
				});

				if (issetCrash) {
					addDestroyedArea(inArea);
				}
			}

			return issetCrash;
		},

		/**
		  * Return if the is or not destroyed
		  *
		  * @retrn <bool>: true if the shield is not destroyed, false if it is
		  */
		isAlive: function() {
			return !destroyed;
		},

		/**
		  * Create the div of the monster, and render it on the main canvas
		  */
		init: function() {
			area = getArea();

			// Create the img element that will represent the monster
			divElem = $('<div>').addClass('shield');
			divElem.css('top', config.shield.y).css('left', ((config.shield.xSep + config.shield.width) * inShieldPos) - config.shield.width);
			$(config.mainCanvas).append(divElem);
		}
	};
});
