/**
  * Author: Alonso Vidales <alonso.vidales@tras2.es>
  * Date: 2012-02-14
  *
  * Main Gloabl Object, will use jQuery and config from the global scope
  *
  */
var SpaceInvaders = (function($, config, misteryShip) {
	// Will count the number of loops for the monsters
	var monsterIters = 0;
	// Will count the number of loops for the player ship
	var shipIters = 0;
	// Will countain all shields on the canvas
	var shields = [];
	// Will countain all the monster objects
	var monsters = [];
	// Will countain the player ship object
	var spaceShip = null;
	// Will contain the scoreboard object
	var scoreboard = null;
	// This var handle the speed of the monsters, will be increased automatically
	var difficult = 1;
	// Will contain all the loops to refresh all the components
	var loops = {};
	// The initial Unix time from the begging
	var initTime = null;
	// If true the game will stop
	var stopped = false;
	// Will control the background music file to play
	var backgroundSound = 0;

	/**
	  * This method creates all the components of the game
	  *
	  * @see LivesBoard
	  * @see Scoreboard
	  * @see SpaceShip
	  * @see Monster
	  */
	var addElements = function() {
		// Get the initial time to calculate the total time
		initTime = Math.round((new Date()).getTime() / 1000);

		livesBoard = new LivesBoard(config);
		livesBoard.init();

		scoreboard = new Scoreboard(config);
		scoreboard.init();

		// Add the shields
		shields.push(new Shield(config, 1));
		shields.push(new Shield(config, 2));
		shields.push(new Shield(config, 3));
		shields.push(new Shield(config, 4));

		// Initialize all the shields
		$.each(shields, function(inKey, inShield) {
			inShield.init();
		});

		// Add the user space ship
		spaceShip = new SpaceShip(config, shields, monsters, function() {
			// This function will be called when the user lost a live
			if (!livesBoard.removeLive()) {
				gameEnded(false);
			}
		}, gameEnded);

		spaceShip.init();

		// Add all the monsters an specify the position for each one
		for (var count = 0; count < 11; count++)
		{
			// Add the last row of monsters, the "squid" monsters
			monsters.push(new Monster(config, 'squid', true, count, 0, scoreboard.addScore, shields, spaceShip, gameEnded));

			// Add the next two rows of monsters, the "slim" monsters
			monsters.push(new Monster(config, 'slim', true, count, 1, scoreboard.addScore, shields, spaceShip, gameEnded));
			monsters.push(new Monster(config, 'slim', false, count, 2, scoreboard.addScore, shields, spaceShip, gameEnded));

			// Add the first two rows of monsters, the "fat" monsters
			monsters.push(new Monster(config, 'fat', true, count, 3, scoreboard.addScore, shields, spaceShip, gameEnded));
			monsters.push(new Monster(config, 'fat', false, count, 4, scoreboard.addScore, shields, spaceShip, gameEnded));
		}

		// Initialize all the monsters
		$.each(monsters, function(inKey, inMonster) {
			inMonster.init();
		});

		monsters.push(misteryShip);
	};

	/**
	  * This method refresh all the monsters on the board using a loop
	  * each (500 / difficult)
	  *
	  * @see Monster
	  */
	var monstersLoop = function() {
		// Check if the game is stopped, and if it is, don't refresh anything
		if (stopped) {
			return true;
		}

		if ((Math.floor(Math.random() * 100) % config.misteryShip.frequency) === 0) {
			misteryShip.init(scoreboard.addScore);
		}

		// This var will check if we have any monster alive
		var monstersAlive = false;
		monsterIters++;

		soundManager.play(config.backgroundSounds[backgroundSound++ % 4]);

		// Iterate over all the monsters, update the status and check if we
		// have any monster alive
		$.each(monsters, function(inKey, inElement) {
			inElement.updateStatus(monsterIters);
			if (inElement.isAlive()) {
				monstersAlive = true;
			}
		});

		// If we con't have monsters alive, means that the user has killed all of them, he wins :)
		if (!monstersAlive) {
			gameEnded(true);
		}

		// Increase the difficult each config.increaseDifficultEach
		if ((monsterIters % config.increaseDifficultEach) == 0) {
			difficult++;
		}

		loops.monstersLoop = setTimeout(monstersLoop, (config.monsterLoopMs / difficult));
	};

	/**
	  * This method refresh the player ship using a loop
	  *
	  * @see SpaceShip
	  */
	var shipLoop = function() {
		spaceShip.updateStatus(shipIters++);

		loops.shipLoop = setTimeout(shipLoop, config.shipLoopMs);
	};

	/**
	  * This method should be called when the games ends in order to show
	  * a window with the contratulations message
	  *
	  * @param inWinner <bool> : true the user won the game, false for game over
	  */
	var gameEnded = function(inWinner) {
		// Check if the game is stopped and stop it to prevent conflicts
		if (stopped) {
			return true;
		}
		stopped = true;

		var titleText = '', image = '', downloadText = '';

		// Calculate the total time that the user was playing
		var totalTime = (Math.round((new Date()).getTime() / 1000) - initTime);
		// Calculate the score getting the sum of all the points minus the time in seconds divided by ten
		var score = Math.round(scoreboard.getScore() - (totalTime / 10));

		soundManager.stopNoise();

		// The score can't be less than 0
		if (score < 0) {
			score = 0;
		}

		// Stop all the loops that refresh all the elements
		$.each(loops, function(inKey, inLoop) {
			clearTimeout(inLoop);
		});

		// Remove all the elements
		$(config.mainCanvas).empty();

		if (inWinner) {
			titleText = 'You are the best!';
			image = 'winner.jpg';
		} else {
			titleText = 'Game Over';
			image = 'loser.png';
		}

		// Create the window content
		var windowDiv = $('<div>').addClass('game_over').addClass('window').append($('<span>').addClass('game_over').addClass('text').html(titleText));
		windowDiv.append($('<img>').addClass('game_over').addClass('image').attr('src', 'img/' + image));
		windowDiv.append($('<div>').addClass('game_over').addClass('score').html('Total time: ' + totalTime));
		windowDiv.append($('<div>').addClass('game_over').addClass('score').html('Score: ' + score));

		// Check if the user gets a scor higger than the current maximun show a text and update the max score
		if (score > localStorage.getItem('hightScore'))
		{
			windowDiv.append($('<div>').addClass('game_over').addClass('score').html('You obtained the Highest Score!!!'));
			localStorage.setItem('hightScore', score);
		}

		if (inWinner) {
			downloadText = 'Hey, great work, now you can get the best prize,<br />click here to read my LinkedIn profile :)';
		} else {
			downloadText = 'You lose, click here to see my LinkedIn profile<br />as consolation prize :)';
		}

		// Add the link to my CV, the most important part of the code :)
		windowDiv.append($('<a>').addClass('game_over').addClass('link_to_cv').attr('href', 'javascript:void(0);').html(downloadText)).click(function() {
			chrome.tabs.create({'url': config.cvLink});
			window.close();
		});

		$(config.mainCanvas).append(windowDiv);
	};

	return {
		/**
		  * This is the only one function that should be called to load all the game
		  *
		  * @param inDifficult <int> : 	Will define the speed of the game, should be
		  *				more than zero, and up to six
		  */
		bootstrap: function(inDifficult) {
			$(document).ready(function() {
				difficult = inDifficult;
				// Create all the elements
				addElements();

				// Launch the refresh loops for all the different elements with different refresh speeds
				// We use two loops in order to set two different speeds, one for the monsters and other
				// one for the player ship
				monstersLoop();
				shipLoop();
			});
		}
	};
}(jQuery, config, misteryShip));
