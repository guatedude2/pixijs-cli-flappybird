/**
 * @plugin Pixi.js es6 plugin
 * @description Converts Pixi.js to es6 module
 * @version 1.0.0
 * @author Alejandro Gonzalez Sole
 * @email guatedude@gmail.com
 *
 * @dependency https://raw.githubusercontent.com/GoodBoyDigital/pixi.js/master/bin/pixi.dev.js
 **/
import PIXI from 'pixi';

/**
 * The TextureDraw module provides a drawable canvas texture to be used by "PIXI.Sprite" objects.
 *
 * Based on Ezelia's drawing method - http://www.html5gamedevs.com/topic/518-hack-making-all-2d-drawing-functions-available-to-pixi/
 * @module TextureDraw
 * @param  {Function} callback The draw function that contains the "canvas" parameter
 * @return {PIXI.Texture} The pixi texture generated by the drawing.
 * @global
 * @example
 * var myTexture = textureDraw(function (canvas) {
 *   var ctx = canvas.getContext('2d');
 *   ctx.fillStyle = "rgb(200,0,0)";
 *   ctx.fillRect (10, 10, 55, 50);
 * });
 */
function textureDraw(cb) {
  var canvas = document.createElement('canvas');
  if (typeof cb == 'function') cb(canvas);
  return PIXI.Texture.fromCanvas(canvas);
};


export default textureDraw;