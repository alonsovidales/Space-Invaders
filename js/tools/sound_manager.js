/**
  * Author: Alonso Vidales <alonso.vidales@tras2.es>
  * Date: 2012-02-14
  *
  * Global sound object used to handle the sound effects
  *
  */
var soundManager = (function() {
	// Will be used as cache for load the music only one time
	var sounds = {};

	return {
		/**
		  * Plays a wav file
		  *
		  * @param inWaveFile <string> : Path to wav file
		  * @param inCallback <funciton> : A function to be called after the game ends
		  */
		play: function (inWaveFile, inCallback) {
			if (sounds[inWaveFile] === undefined) {
				sounds[inWaveFile] = new Audio(inWaveFile);
			}
			sounds[inWaveFile].play();

			// If is defined any call back function, call it after the sound ends
			if (inCallback !== undefined) {
				// Remove the previous events to avoid problems
				$(sounds[inWaveFile]).unbind();
				$(sounds[inWaveFile]).bind('ended', inCallback);
			}
		},

		/**
		  * The next method stop only a sound
		  *
		  * @param inWaveFile <string> : Path to wav file
		  */
		stop: function(inWaveFile) {
			if (sounds[inWaveFile] !== undefined) {
				sounds[inWaveFile].pause();
			}
		},

		/**
		  * The next method stops all the game sounds
		  */
		stopNoise: function () {
			$.each(sounds, function(inKey, inValue) {
				inValue.pause();
			});
		}
	};
}());

