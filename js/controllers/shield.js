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
	// The div element that will be used to represent the shield
	var divElem = null;
	// Used to store the area as a cache
	var area = null;
	// Will contain the areas where a missile or a bomb has crashed
	var hurts = [];

	/**
	  * This method returns the absolute position in pixels of the top left and bottom
	  * right corners of the shield
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

	/**
	  * This method create a div image that will be located at the position where the bomb or missile has crash
	  * the areas are added to the hurts array to don't be considered for future crashed.
	  *
	  * @param <object> inArea : An array with the position of the component that crash against the shield, the
	  *	values should be:
	  *             - topLeftX <int> : The X axe absolute position in pixels of the top left corner
	  *             - topLeftY <int> : The Y axe absolute position in pixels of the top left corner
	  *             - bottRightX <int> : The X axe absolute position in pixels of the bottom right corner
	  *             - bottRightY <int> : The Y axe absolute position in pixels of the bottom right corner
	  */
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

	// Public methods, properties
	return {
		/**
		  * This method should be called for the missiles and bombs to know if exists an impact with the monster
		  *
		  * @param <object> inArea : The area of the element that can impact against the shield
		  *
		  * @return <bool> : true if the impact success, false if not
		  *
		  * @see Missile class
		  * @see Bomb class
		  */
		checkCrash: function(inArea) {
			// Check if the projectil imcasts against the main structure
			var issetCrash = (
				(inArea.topLeftX > area.topLeftX) &&
				(inArea.bottRightX < area.bottRightX) &&
				(inArea.topLeftY > area.topLeftY) &&
				(inArea.topLeftY < area.bottRightY));

			// If we have a crash against the main structure we should to check if we don't have a 
			// previous crash at the same position
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
		  * Create the div of the shield, and render it on the main canvas
		  *
		  * @see config.shield.xSep
		  * @see config.shield.width
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
