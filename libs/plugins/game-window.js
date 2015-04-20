/**
 * @plugin GameWindow plugin
 * @description A plugin helper that adds stage resize, scene swaping, pause/resume, and a run loop.
 * @version 1.0.1
 * @author Alejandro Gonzalez Sole
 * @email guatedude@gmail.com
 *
 * @dependency pixi
 * @dependency class
 * @dependency pixi-resource
 * @dependency game-scene
 *
 * MIT Licensed.
 **/

import PIXI from 'pixi';
import Class from 'class';
//import cordova from 'org.apache.cordova';

// cordova.onReady(function (){
//   if (navigator && navigator.splashscreen)
//   GameWindow.splashscreen = navigator.splashscreen;
// });

/**
 * The GameWindow module provides stage resize, scene swaping, pause/resume, and a run loop.
 * @module GameWindow
 * @global
 */

var GameWindow = {
   /**
   * The width of the stage
   * @member {int} stageWidth
   * @instance
   */
  stageWidth: 0,
   /**
   * The height of the stage
   * @member {int} stageHeight
   * @instance
   */
  stageHeight: 0,
  error: false,
   /**
   * The property that holds the value wether pixi.js is using WebGL or not (canvas).
   * @member {boolean} isWebGL
   * @readonly
   * @instance
   */
  isWebGL: false,
   /**
   * An alias to the canvas where pixi.js is rendering to.
   * @member {HTMLcanvas} canvas
   * @readonly
   * @instance
   */
  canvas: null,
   /**
   * This property holds the current scene being rendered.
   * @see setScene()
   * @member {GameScene} currentScene
   * @readonly
   * @instance
   */
  currentScene: null,
   /**
   * The property that holds the value wether the scene is paused or not.
   * @member {boolean} paused
   * @readonly
   * @instance
   */
  paused: false,
   /**
   * The property holds current time in miliseconds of the render loop.
   * @member {int} time
   * @instance
   */
  time: 0,
   /**
   * This property holds the delta time of the rendering loop. This property is used to calculate change in object's movements or animations
   * @example
   * // will move the object 2 pixels every frame.
   * MyVisualObject.position.x += GameWindow.deltaTime * 2;
   * @member {number} deltaTime
   * @readonly
   * @instance
   */
  deltaTime: 0,
  _speed: 1,
   /**
   * This property holds the "Cordova" splashscreen object if available.
   * @member {Object} splashscreen
   * @readonly
   * @instance
   */
  splashscreen: { hide: function(){} },
  /**
   * Initializes the pixi.js engine and creates a stage with the given parameters.
   * @method init
   * @param  {Object} options Options object passed to the pixi.js engine
   * @example
   * GameWindow.init({
   *   stageWidth: 750,
   *   stageHeight: 1334,
   *   scaleMode: 'ScaleFit'
   * });
   * @instance
   */
  init: function (options){
    if (this.initialized) return;
    //initialize PIXI
    var self = this;
    self.stageWidth = options.stageWidth || 800;
    self.stageHeight = options.stageHeight || 800;
    self.renderer = PIXI.autoDetectRenderer(self.stageWidth, self.stageHeight, options.rendererOptions || {});
    self.isWebGL = !!self.renderer.gl;
    self.canvas = self.renderer.view;
    document.body.appendChild(self.renderer.view);
    //reset canvas and center it
    self.canvas.style.margin = 'auto';
    self.canvas.style.position = 'absolute';
    self.canvas.style.top = 0;
    self.canvas.style.left = 0;
    self.canvas.style.bottom = 0;
    self.canvas.style.right = 0;
    //scale canvas depending on scaleMode
    self.scaleMode = options.scaleMode || 'ScaleFit';
    if (this.scaleMode==='ScaleFit' || this.scaleMode==='ScaleFitCrop'){
      self.resize();
      window.addEventListener('resize', function (){ self.resize(); });
    }

    //create stage to render objects
    this.stage = new PIXI.Stage(options.backgroundColor || 0x000000);

    //trigger main loop to start animating
    self.mainLoop();
    self.initialized = true;

    //if showFps is enabled then create stats object
    if (options.showFps){
      if (Stats){
        this._stats = new Stats();
        document.body.appendChild( this._stats.domElement );
        this._stats.domElement.style.position = "absolute";
        this._stats.domElement.style.top = "0px";
      }else{
        throw new Error('Stats library was not found!');
      }
    }
  },
  resize: function (){

    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    var windowRatio = windowWidth / windowHeight;

    var screenRatio = this.stageWidth / this.stageHeight;

    if (this.scaleMode==='ScaleFitCrop'){
      if (windowRatio < screenRatio){
        this.height = windowHeight;
        this.width = this.height * this.stageWidth / this.stageHeight;
      }else{
        this.width = windowWidth;
        this.height = this.width * this.stageHeight / this.stageWidth;
      }
    }else if (this.scaleMode==='ScaleFit'){
      var ratio = Math.min(windowWidth / this.stageWidth, windowHeight / this.stageHeight);
      this.width = this.stageWidth * ratio;
      this.height = this.stageHeight * ratio;
    }

    this.canvas.style.width = this.width + 'px';
    this.canvas.style.height = this.height + 'px';
    this.renderer.resize(this.stageWidth, this.stageHeight);

    this.emit('resize');
  },
  mainLoop: function (){


    var self = this;
    var now = Date.now();
    if (!self.error){
      requestAnimFrame(function (){ self.mainLoop(); });
    }
    //if paused dont re-render
    if (self.paused) return;
    //render current scene
    try{
      if (self.currentScene && self.currentScene.update){
        self.currentScene.update.call(self.currentScene);
      }
    }catch(err){
      if (!self.error){
        self.error = true;
        throw err;
      }
    }
    //render stage
    self.renderer.render(self.stage);

    if (this._stats) this._stats.end();

    //calculate delta time
    this.deltaTime = Math.min((now - this.time), 1000/20) * this._speed;
    this.time = now;
    if (this._stats) this._stats.begin();

    //emit ticks for animations
    this.emit('tick');

  },

  /**
   * Pauses the run loop of the current scene
   * @method pause
   * @instance
   */
  pause: function (){
    this.paused = true;
  },

  /**
   * Resumes the run loop of the current scene
   * @method resume
   * @instance
   */
  resume: function (){
    this.paused = false;
  },

  /**
   * Sets the current scene to render.
   * When "setScene" has been called the "GameScene.init" method will be executed.
   * @method setScene
   * @param {GameScene} scene The game scene object to start rendering
   * @instance
   */
  setScene: function (scene){
    if (this.currentScene){
      this.stage.removeChild(this.currentScene);
      this.currentScene._destroy.call(this.currentScene);
    }
    //set new scene and initialize it
    this.currentScene = scene;
    scene.stage = this.stage;
    this.stage.addChild(scene);
    this.stage.setBackgroundColor(scene.backgroundColor);
    scene.hitArea = new PIXI.Rectangle(0,0, this.stageWidth, this.stageHeight);
    scene.init.call(scene);
    this.resize();
  }
};

  /**
   * The speed of the "deltaTime" when rendering representing the speed of change of "deltaTime".
   * "speed" can be a string ("fast", "slow" or "normal") or any numberic value. The default is "1.0".
   * @see deltaTime
   * @member {string/number} speed
   * @instance
   */
Object.defineProperty(GameWindow, 'speed', {
  get: function (){
    var speed = this._speed;
    return (speed===1 ? 'normal' : (speed===0.5 ? 'slow' : (speed===1.5 ? 'fast' : speed)));
  },
  set: function (value){
    this._speed = (value==='normal' ? 1 : (value==='slow' ? 0.5 : (value==='fast' ? 1.5 : value)));
  },
  enumerable: true,
  configurable: true
});

document.addEventListener("pause", GameWindow.pause, false);
document.addEventListener("resume", GameWindow.resume, false);

PIXI.EventTarget.call(GameWindow);

export default GameWindow;
