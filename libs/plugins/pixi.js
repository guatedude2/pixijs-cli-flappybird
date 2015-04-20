/**
 * @plugin Pixi.js es6 plugin
 * @description Converts Pixi.js to es6 module
 * @version 1.0.0
 * @author Alejandro Gonzalez Sole
 * @email guatedude@gmail.com
 *
 * @dependency https://raw.githubusercontent.com/GoodBoyDigital/pixi.js/master/bin/pixi.dev.js
 **/

/**
 * A wrapper module for pixi.js library.
 * Pixi.js documentation: http://www.goodboydigital.com/pixijs/docs/
 *
 * @module PIXI
 * @global
 */
var PIXI;
if (window.PIXI){
	PIXI = window.PIXI;
	delete window.PIXI;
}else{
  throw new Error("PIXI.js library is not available!");
}

export default PIXI;