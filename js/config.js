/**
  * Author: Alonso Vidales <alonso.vidales@tras2.es>
  * Date: 2012-02-14
  *
  * Global config object
  */
var config = {
	// Link to the last version of my CV :), very important!
	cvLink: 'http://www.linkedin.com/profile/view?id=20610173&trk=tab_pro',
	// The jQuery string to get the div element for the main canvas
	mainCanvas: '#main_canvas',
	// The period in miliseconds for the loop that controls the ship
	shipLoopMs: 10,
	// The period in miliseconds for the loop that controls the monsters
	monsterLoopMs: 400,
	// The number of monsterLoops to wait for increase the difficult of the game
	increaseDifficultEach: 50,
	// Bomb class configuration params
	bomb: {
		// The period in miliseconds for the loop that controls the speed of the bombs
		loopSpeed: 20,
		// The number of pixels that a bomb advance each loop
		steep: 5,
		// The height in pixels of the div element for the bombs
		bombHeight: 15,
		// Y bottom limit to destroy the bombs
		maxYpx: 515
	},
	// LivesBoard class configuration params
	livesBoard: {
		// The number of lives that a user will have at the start
		lives: 3,
		// The X axis absolute possition where the div of the board will be rendered
		x: 420,
		// The Y axis absolute possition where the div of the board will be rendered
		y: 525
	},
	// SpaceShip class configuration params
	spaceShip: {
		// The initial absolute position on the X axis for the ship
		initXpos: 15,
		// The initial absolute position on the Y axis for the ship
		initYpos: 490,
		// The velocity for the ship movements
		velocity: 10,
		// The max position on pixels of the X axis that the ship can takes
		maxXPos: 54,
		// The relative path to the file with the sound that will be played when de shpace ship is destroyed
		killedSound: 'sounds/explosion.wav',
		// The width on pixels of the ship div
		width: 55,
		// The height on pixels of the ship div
		height: 26
	},
	// Missile class configuration params
	missile: {
		// The relative path to the file with the sound that will be played when de missile are launched
		sound: 'sounds/shoot.wav',
		// The period on miliseconds for the loop that refresh the missile object
		loopSpeed: 8,
		// The height on pixels of the missile div
		height: 15,
		// The number of pixels that a missile advance each loop
		steep: 5
	},
	// Monster class configuration params
	monster: {
		// The relative path to the file with the sound that will be played when de monster is killed
		killedSound: 'sounds/invaderkilled.wav',
		// The number of rows that the monsters will be movel 
		initYtab: 50,
		// The number of columns that the monsters will be movel 
		initXtab: 20,
		// The width and height of the monster div
		widthHeight: 42,
		// The maximun number of movements that the monster can do to each way
		maxXMovements: 6,
		// The number of pixels that the monster will advance each movement
		advanceTopLeftPx: 16,
		// Integer value that determinate the probability that a monter launch a bomb in a loop
		// The value could be from 1 to 10000
		bombsProbability: 70,
		// The number of loops that the monster should wait before each movement
		loopsToMove: 2,
		// The bottom limit that determinate if the monster has detroy the ship
		bottomLimit: 500
	},
	// MisteryShip class configuration params
	misteryShip: {
		// The relative path to the file with the sound that will be played when de mistery ship appear
		backgrounSound: 'sounds/mistery_sound.wav',
		// The probability that the mistery ship appear, will appear when the module of a rand number 0 - 99
		// between this munber will be equal to zero
		frequency: 55,
		// The number of pixels that the space ship will advande each monter loop
		speed: 40,
		// The width in pixels of the div element
		width: 60,
		// The height in pixels of the div element
		height: 37,
		// The margin at the top for the space ship in pixels
		initY: 10
	},
	// Scoreboard class configuration params
	scoreboard: {
		// The absolute position in pixels for the X axe
		x: 20,
		// The absolute position in pixels for the Y axe
		y: 530
	},
	// Shield class configuration params
	shield: {
		// The absolute position in pixels for the Y axe
		y: 400,
		// Separation in pixels between shields and between the left position of the window
		xSep: 70,
		// The width in pixels of the div element
		width: 66,
		// The height in pixels of the div element
		height: 48,
		// The height and width on pixels of the destroyed areas on the shield
		destroyedWidthHeight: 20
	},
	// This sounds will be played each monster movements
	backgroundSounds: [
		'sounds/background/back_1.wav',
		'sounds/background/back_2.wav',
		'sounds/background/back_3.wav',
		'sounds/background/back_4.wav'
	]
};
