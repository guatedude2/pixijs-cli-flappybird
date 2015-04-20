/**
 * @plugin Pixi Resource plugin
 * @description A plugin helper that makes loading graphics and sounds easier.
 * @version 1.0.3
 * @author Alejandro Gonzalez Sole
 * @email guatedude@gmail.com
 *
 * @dependency pixi
 * @dependency audio
 *
 * MIT Licensed.
 **/

import PIXI from 'pixi';
import Audio from 'audio';

var assetQueue = {};
var soundQueue = {};
var preloaded = false;

//TODO: FIX UNSUPPORTED
// 'atlas': PIXI.AtlasLoader,
// 'anim': PIXI.SpineLoader,

function basename(path, excludeExtension) {
  var baseName = path.split('/').reverse()[0];
  return excludeExtension ? baseName.split('.')[0] : baseName;
}

function loadAsset(source, callback){
  if (!!~source.search(/\.(jpe?g|png|gif|webp)$/)){
    var textureObject = PIXI.Texture.fromImage(source);
    textureObject.on('update', function (){
      if (typeof callback === 'function') callback();
    });
    return textureObject;
  }else if (!!~source.search(/\.(fnt|xml)$/)){
    var fontObject = { hasLoaded: false };
    var loader = new PIXI.BitmapFontLoader(source);
    loader.on('loaded', function (){
      fontObject.hasLoaded = true;
      if (typeof callback === 'function') callback();
    });
    loader.load();
    return fontObject;
  }else if (source.toLowerCase().slice(-5)==='.json'){
    var jsonObject = { data:null, hasLoaded: false };
    var loader = new PIXI.JsonLoader(source);
    loader.on('loaded', function(evt) {
      jsonObject.data = evt.data.content.json;
      jsonObject.hasLoaded = true;
      if (typeof callback === 'function') callback();
    });
    loader.load();
    return jsonObject;
  }else{
    throw new Error("Unrecoginze file format " + source);
  }
}

function loadSound(id, source, callback){
  if (!!~source.search(/\.(mp3)$/)){
    var audioObject = { hasLoaded: false }
    Audio.loadSound(id, source, function (){
      audioObject.hasLoaded = true;
      return (typeof callback === 'function') && callback();
    });
    return audioObject;
  }else{
    throw new Error("Unrecoginze file format " + source);
  }
}

/**
 * A class helper that makes loading graphics and sounds easier.
 * @module PixiResource
 * @example
 * import R from "pixi-resource";
 * import PIXI from "pixi";
 *
 * R.addAsset("assets/my-graphic.png");
 * R.addAsset("special", "assets/my-special-graphic.png");
 * ...
 * R.preload(function (){
 *   var sprite = new PIXI.Sprite(R.assets.my_graphic);
 *   ...
 * });
 * @global
 */

var PixiResource = {
  assets: {},
  percent: 0,

  /**
   * Adds a graphical asset to the resource queue when the "preload" method hasn't been called, otherwise it will load it immediatly.
   *
   * If the "source" is specied instead of the "id", then the "id" of the asset will be the filename without the extension.
   *
   * Once loaded, assets can be accesed simply by accessing "PixiResouce.assets" object.
   * @method addAsset
   * @param  {string} id The id of the graphical asset
   * @param  {string} source The source path of a graphical asset (optional)
   * @param  {boolean} force Forces immediate asset loading (optional)
   * @example
   * R.addAsset("assets/my-graphic.png"); // R.assets.my_graphic
   * R.addAsset("special", "assets/my-special-graphic.png"); // R.assets.special
   * R.addAsset("assets/splashscreen.png", true); // force loading so it can be used before "preload" once the it's loaded.
   * @instance
   */
  addAsset: function (id, source, force){
    if (source===undefined || typeof source === 'boolean'){
      force = !!source;
      source = id;
      id = basename(id, true).replace(/\W/g, function (m){
        return m !== '-' ? m : '_';
      });
    }
    if (preloaded || force){
      this.assets[id] = loadAsset(source);
    }else{
      assetQueue[id] = source;
    }
  },

  /**
   * Adds an audio asset to the resource queue when the "preload" method hasn't been called, otherwise it will load it immediatly.
   *
   * If the "source" is specied instead of the "id", then the "id" of the asset will be the filename without the extension.
   *
   * Note: Unlike graphical assets, audio assets cannot be accessed via the "PixiResouce.assets" object.
   * @method addSound
   * @param  {string} id The id of the graphical asset
   * @param  {string} source The source path of a graphical asset (optional)
   * @param  {boolean} force Forces immediate asset loading (optional)
   * @example
   * R.addSound("assets/sounds/click.mp3");
   * R.addSound("special", "assets/sounds/my-special-sound.mp3");
   * R.addSound("assets/sounds/music.mp3", true); // force loading so it can be used before "preload" once the it's loaded.
   * @instance
   */
  addSound: function (id, source, force){
    if (source===undefined || typeof source === 'boolean'){
      force = !!source;
      source = id;
      id = basename(id, true).replace(/\W/g, function (m){
        return m !== '-' ? m : '_';
      });
    }

    soundQueue[id] = preloaded || force ? loadSound(id, source) : source;
  },

  /**
   * Loads all assets in queue.
   * @method preload
   * @param  {Object} callback The callback function when the loading of all assets are completed.
   * @instance
   */
  preload: function(callback){
    var id;
    var self = this;
    var assetsCount = Object.keys(assetQueue).length + Object.keys(soundQueue).length;
    var assetsLoaded = 0;
    var check = function (id, asset){
      assetsLoaded++;
      if (assetsLoaded===assetsCount){
        preloaded = true;
        callback.call(null);
      }
    }

    for(id in assetQueue){
      var asset = loadAsset(assetQueue[id], function (){
        check(id, asset);
      });
      if (asset.hasLoaded){
        check(id, asset);
      }
      self.assets[id] = asset;
    }

    for (id in soundQueue){
      var asset = loadSound(id, soundQueue[id], function (){
        check(id, asset);
      });
      if (asset.hasLoaded){
        check(id, asset);
      }
    }
  }
}
export default PixiResource;
