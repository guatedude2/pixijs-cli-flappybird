/**
 * @plugin Audio plugin
 * @description A plugin helper that adds web audio support.
 * @version 0.0.1-beta
 * @author Alejandro Gonzalez Sole
 * @email guatedude@gmail.com
 *
 * MIT Licensed.
 **/

//import cordova from 'org.apache.cordova';
//import LowLatencyAudio from 'com.rjfun.cordova.plugin.lowlatencyaudio';
/**
 * @ignore
 */
var ready = false;
var hasLowLatencyAudio = false;
var hasWebAudio = false;
var masterVolume = 100;
var buffers = {};
var bufferSource = {};
var context;

try {
  window.AudioContext = window.AudioContext||window.webkitAudioContext;
  context = new AudioContext();
  console.log("Web Audio available!")
  hasWebAudio = true;
}catch(e) {
  console.log('Web Audio is not available!');
}

// cordova.onReady(function (){
//   if (LowLatencyAudio.isReady){
//     console.log("Native Audio available!");
//     hasLowLatencyAudio = true;
//   }
// });

/**
 * A class helper that adds web audio support.
 * @module Audio
 * @global
 */
var Audio = {
  /**
   * This method loads a sound to be used by the Audio class.
   * @method loadSound
   * @param  {string}   id       The id of the sound
   * @param  {string}   filename The filename of the sound
   * @param  {Function} callback A callback when the sound has been loaded
   * @instance
   */
  loadSound: function(id, filename, callback){
    if (hasLowLatencyAudio){
      LowLatencyAudio.preloadAudio( id, filename, masterVolume/100, 5, function(msg){
        setTimeout(function (){
          console.log("Loaded", id );
          callback();
        }, 500)
      }, function(msg){
        throw new Error('Audio Error: ' + err);
      });
    }else if (hasWebAudio){
      var request = new XMLHttpRequest();
      request.open('GET', filename, true);
      request.responseType = 'arraybuffer';

      request.onload = function() {
        context.decodeAudioData(request.response, function(buffer) {
          buffers[id] = buffer;
          console.log("Loaded", filename);
          callback();
        }, function (err){
          throw new Error('Audio Error: ' + err);
        });
      }
      request.send();
    }else{
      console.log("Unable to load", filename);
      callback();
    }
  },

  /**
   * Plays a previously loaded sound
   * @method playSound
   * @param  {string} id   The id of the sound
   * @param  {boolean} loop Wether the sound should loop. The default is "false".
   * @instance
   */
  playSound: function (id, loop){
    if (buffers[id]==undefined){
      throw new Error('Sound "'+id+'" does not exist!');
    }
    if (hasLowLatencyAudio){
      console.log("PLAY",id, (loop ? 'loop' : ''));
      if (loop){
        LowLatencyAudio.loop(id);
      }else{
        LowLatencyAudio.play(id);
      }
    }else if (hasWebAudio){
      var source = context.createBufferSource();
      source.buffer = buffers[id];
      source.loop = !!loop;
      source.connect(context.destination);
      source.start(0);
      var gainNode = context.createGain();
      source.connect(gainNode);
      bufferSource[id] = {
        source: source,
        gain: gainNode
      }
    }
  },

  /**
   * Stops a currently playing sound.
   * @method stopSound
   * @param  {string} id The id of the sound
   * @instance
   */
  stopSound: function (id){
    if (buffers[id]==undefined){
      throw new Error('Sound "'+id+'" does not exist!');
    }
    if (hasLowLatencyAudio){
      LowLatencyAudio.stop(id, function(){
        //success
      }, function (err){
        throw new Error('Audio Error: ' + err);
      });
    }else if (hasWebAudio){
      bufferSource[id].source.stop(0);
    }
  },

  /**
   * Sets the volume of a currently playing sound.
   * @method setSoundVolume
   * @param  {int} volume The volume between 0-100. The default is "100".
   * @instance
   */
  setSoundVolume: function (id, volume){
    if (buffers[id]==undefined){
      throw new Error('Sound "'+id+'" does not exist!');
    }
    volume = volume ? (volume>100 ? 100 : (volume<0 ? 0 : volume)) : 100;
    if (hasLowLatencyAudio){
      LowLatencyAudio.setVolumeForComplexAsset(id, (volume/100)*(masterVolume/100), function (){
        //sucess
      }, function (err){
        throw new Error('Audio Error: ' + err);
      });
    }else if (hasWebAudio){
      bufferSource[id].gain.value = (volume/100)*(masterVolume/100);
    }
  },

  /**
   * Sets the volume of a all sounds.
   * @method setMasterVolume
   * @param  {int} volume The volume between 0-100. The default is "100".
   * @instance
   */
  setMasterVolume: function (volume){
    masterVolume = (volume>100 ? 100 : (volume<0 ? 0 : volume));
  }
};

export default Audio;
