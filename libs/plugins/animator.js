/**
 * @plugin Animator plugin
 * @description A plugin that provides tweening animations to objects
 * @version 1.0.0
 * @author Alejandro Gonzalez Sole
 * @email guatedude@gmail.com
 *
 * @dependency pixi
 * @dependency game-window
 *
 * MIT Licensed.
 **/

import PIXI from 'pixi';
import GameWindow from 'game-window';

 /**
 * The Animator class provides tweening animation to objects
 * Based on jQuery UI Effects (https://github.com/jquery/jquery-ui/blob/master/ui/effect.js)
 * @class Animator
 * @param {Object} object The object to animate
 * @example
 * var animation = new Animator(myObject.position);
 * myObject.to({ x: 100, y: 10 });
 * myObject.to({ x: 200, y: 200 }, 3000, Animator.Easing.OutCubic);
 * myObject.to({ x: 100, y: 100 }, 1000);
 * myObject.to({ x: 10, y: 10 });
 * myObject.start();
 * @global
 */
function Animator(obj){
  PIXI.EventTarget.call(self);
  this.uid = (new Date()).getTime() + Math.random();
  this.object = obj;
  this.isAnimating = false;
  this.progress = 0;
  this.defaultEasing = Animator.Easing.Swing;
  this.defaultDuration = 400
  this.step = 0;
  this.totalSteps = 0;
  this.totalDuration = 0;
  this.loops = 1;
  this._steps = [];
  this._time = 0;
  this._start = null;
  this._end = null;
  this._complete = null;
}

Animator.prototype._updateDuration = function(){
  this.totalDuration = 0;
  for (var i = 0; i < this._steps.length; i++){
    this.totalDuration += this._steps[i].duration || this.defaultDuration;
  }
}

/**
 * This method adds a tween end point given the object properties, duration and easing.
 * @method to
 * @param {Object} properties The properties final position of the object to tween.
 * @param {number} duration The number of miliseconds the animation will last. The default is "Animator.Easing.Swing".
 * @param {Function} easing The easing function of the animation. The default is "400" miliseconds.
 * @param {Function} callback The callback function when the tween was completed.
 * @instance
 * @memberof Animator
 */
Animator.prototype.to = function (props, duration, easing, complete){
  this._steps.push({
    props: props,
    duration: duration || null,
    easing: easing || null,
    complete: complete || null
  });
  this._updateDuration();
  this.totalSteps = this._steps.length;
  return this;
}

/**
 * This method starts the animation queue.
 * @method start
 * @param {Function} callback The callback function when all tweens have been completed
 * @instance
 * @memberof Animator
 */
Animator.prototype.start = function(callback){
  var self = this;
  this.step = -1;
  this._time = 0;
  this._start = null;
  this._end = null;
  this._complete = callback || null
  this._initialProps = {};
  this.isAnimating = true;
  for (var i=0; i < this._steps.length; i++){
    for (var name in this._steps[i].props){
      this._initialProps[name] = this.object[name];
    }
  }
  this._updateDuration();
  Animator._animations.push(this);
  return this;
}

/**
 * This method stops all animations and resets the tween queue
 * @method stop
 * @instance
 * @memberof Animator
 */
Animator.prototype.stop = function(){
  for(var i=0; i<Animator._animations.length; i++){
    if (Animator._animations[i].uid == this.uid){
      Animator._animations.splice(i, 1);
      break;
    }
  }
  return this;
}

Animator.prototype.update = function(){
  this._time += GameWindow.deltaTime;

  var currentStep = this._start;
  var nextStep = this._end;
  var elapsed;

  if (currentStep && nextStep){
    var duration = nextStep.duration || this.defaultDuration;
    elapsed = (this._time / duration);
    elapsed = elapsed > 1 ? 1 : elapsed;

    this.progress = (this.step+elapsed) / this.totalSteps;
    var easing = nextStep.easing===null ? this.defaultEasing : nextStep.easing;
    var value = easing ? easing(elapsed) : 1

    for(var p in nextStep.props){
      var start = currentStep.props[p] || 0;
      var end = nextStep.props[p];
      this.object[p] = start + (end - start) * value;
    }
  }else{
    elapsed = 1;
  }

  if (elapsed===1){
    if (currentStep && currentStep.complete) currentStep.complete();
    this.step += 1;
    if (this.step < this._steps.length){
      this._time = 0;
      this._start = { props: {} };
      this._end = this._steps[this.step];
      for(var name in this._end.props){
        this._start.props[name] = this.object[name];
      }
      return;
    }

    if (this.loops>0) this.loops--;
    if (this.loops != 0){

      this.step = -1;
      this._time = 0;
      this._start = null;
      this._end = null;
      for(var name in this._initialProps){
        this.object[name] = this._initialProps[name];
      }
    }else{
      this.stop();
      this.isAnimating = false;
      if (this._complete) this._complete();
      return;
    }
  }
}

var baseEasings = {
  Sine: function( p ) {
    return 1 - Math.cos( p * Math.PI / 2 );
  },
  Circ: function( p ) {
    return 1 - Math.sqrt( 1 - p * p );
  },
  Elastic: function( p ) {
    return p === 0 || p === 1 ? p :
      -Math.pow( 2, 8 * (p - 1) ) * Math.sin( ( (p - 1) * 80 - 7.5 ) * Math.PI / 15 );
  },
  Back: function( p ) {
    return p * p * ( 3 * p - 2 );
  },
  Bounce: function( p ) {
    var pow2,
      bounce = 4;

    while ( p < ( ( pow2 = Math.pow( 2, --bounce ) ) - 1 ) / 11 ) {}
    return 1 / Math.pow( 4, 3 - bounce ) - 7.5625 * Math.pow( ( pow2 * 3 - 2 ) / 22 - p, 2 );
  }
}
/**
 * Static easing functions
 * @member Easing
 * @static
 * @memberof Animator
 */
Animator.Easing = {
  /**
   * Linear easing function
   * @method Linear
   * @example
   * var animator = new Animator(myObject.position);
   * animator.to({ x:100 }, 400, Animator.Easing.Linear);
   * @static
   * @memberof Animator.Easing
   */
  Linear: function( p ) {
    return p;
  },
  /**
   * Swing easing function
   * @method Swing
   * @example
   * var animator = new Animator(myObject.position);
   * animator.to({ x:100 }, 400, Animator.Easing.Swing);
   * @static
   * @memberof Animator.Easing
   */
  Swing: function( p ) {
    return 0.5 - Math.cos( p * Math.PI ) / 2;
  }
  /**
   * InQuad easing function
   * @method InQuad
   * @example
   * var animator = new Animator(myObject.position);
   * animator.to({ x:100 }, 400, Animator.Easing.InQuad);
   * @static
   * @memberof Animator.Easing
   */
  /**
   * OutQuad easing function
   * @method OutQuad
   * @example
   * var animator = new Animator(myObject.position);
   * animator.to({ x:100 }, 400, Animator.Easing.OutQuad);
   * @static
   * @memberof Animator.Easing
   */
  /**
   * InCubic easing function
   * @method InCubic
   * @example
   * var animator = new Animator(myObject.position);
   * animator.to({ x:100 }, 400, Animator.Easing.InCubic);
   * @static
   * @memberof Animator.Easing
   */
  /**
   * OutCubic easing function
   * @method OutCubic
   * @example
   * var animator = new Animator(myObject.position);
   * animator.to({ x:100 }, 400, Animator.Easing.OutCubic);
   * @static
   * @memberof Animator.Easing
   */
  /**
   * InQuart easing function
   * @method InQuart
   * @example
   * var animator = new Animator(myObject.position);
   * animator.to({ x:100 }, 400, Animator.Easing.InQuart);
   * @static
   * @memberof Animator.Easing
   */
  /**
   * OutQuart easing function
   * @method OutQuart
   * @example
   * var animator = new Animator(myObject.position);
   * animator.to({ x:100 }, 400, Animator.Easing.OutQuart);
   * @static
   * @memberof Animator.Easing
   */
  /**
   * InQuint easing function
   * @method InQuint
   * @example
   * var animator = new Animator(myObject.position);
   * animator.to({ x:100 }, 400, Animator.Easing.InQuint);
   * @static
   * @memberof Animator.Easing
   */
  /**
   * OutQuint easing function
   * @method OutQuint
   * @example
   * var animator = new Animator(myObject.position);
   * animator.to({ x:100 }, 400, Animator.Easing.OutQuint);
   * @static
   * @memberof Animator.Easing
   */
  /**
   * InExpo easing function
   * @method InExpo
   * @example
   * var animator = new Animator(myObject.position);
   * animator.to({ x:100 }, 400, Animator.Easing.InExpo);
   * @static
   * @memberof Animator.Easing
   */
  /**
   * OutExpo easing function
   * @method OutExpo
   * @example
   * var animator = new Animator(myObject.position);
   * animator.to({ x:100 }, 400, Animator.Easing.OutExpo);
   * @static
   * @memberof Animator.Easing
   */
};

var easings = [ "Quad", "Cubic", "Quart", "Quint", "Expo" ];
for(var i=0; i<easings.length; i++){
  baseEasings[easings[i]] = function( p ) {
    return Math.pow( p, i + 2 );
  };
}

for (var name in baseEasings){
  var easeIn = baseEasings[name];
  Animator.Easing['EaseIn' +name] = easeIn;
  Animator.Easing['EaseOut' +name] = function( p ) {
    return 1 - easeIn( 1 - p );
  };
  Animator.Easing['EaseInOut' +name] = function( p ) {
    return p < 0.5 ?
      easeIn( p * 2 ) / 2 :
      1 - easeIn( p * -2 + 2 ) / 2;
  };
}

Animator._animations = [];
Animator._update = function(){
  for(var i=0; i<Animator._animations.length; i++){
    try{
      Animator._animations[i].update.call(Animator._animations[i]);
    }catch(err){
      if (!GameWindow.error){
        GameWindow.error = true;
        throw new Error(err)
      }
    }
  }
}
GameWindow.on('tick', Animator._update);

export default Animator;
