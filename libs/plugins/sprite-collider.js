/**
 * @plugin Sprite Collider
 * @description A simple box collider plugin
 * @version 1.0.1
 * @author Alejandro Gonzalez Sole
 * @email guatedude@gmail.com
 *
 * @dependency game-window
 * @dependency pixi
 **/
import GameWindow from 'game-window';
import PIXI from 'pixi';

var bodies = [];

GameWindow.on('tick', function(){
  try{
    for(var i = bodies.length - 1; i >= 0; i--){
      for(var j = bodies.length - 1; j >= 0; j--){
        if (i != j){
          Collider.checkCollision(Collider.rect(bodies[i]), Collider.rect(bodies[j]));
        }
      }
    }
  }catch(err){
    GameWindow.error = true;
    throw err;
  }
});

function inGroups(groupA, groupB){
  if (groupA===true || groupB===true) return true;
  for(var i = groupA.length - 1; i >=0; i--){
    for(var j = groupB.length - 1; j >=0; j--){
      if (groupA[i]===groupB[j]) return true;
    }
  }
  return false;
}

/**
 * A simple box collider plugin
 * Pixi.js documentation: http://www.goodboydigital.com/pixijs/docs/
 *
 * @module Collider
 * @global
 */
var Collider = {
  /**
   * Adds a sprite object to the SpriteCollider world.
   *
   * A "collide" abstract method will be added to the sprite that is triggered by "checkCollision".
   * @method addSprite
   * @param  {PIXI.Sprite} sprite A sprite object
   * @instance
   */
  addSprite: function(sprite, groups){
    if (!(groups instanceof Array) && !isNaN(groups)) groups = [groups];
    if (!(groups instanceof Array)) groups = true;
    bodies.push({
      sprite: sprite,
      groups: groups,
      enabled: true
    });
  },


  /**
   * Enables or disables a sprite's collision
   * @method enableSprite
   * @param  {PIXI.Sprite} sprite A sprite object
   * @return {boolean} Returns "true" if the objects was disabled otherwise it will return "false".
   * @instance
   */
  enableSprite: function(sprite, enabled){
    for (var i = bodies.length - 1; i >= 0; i--){
      if (bodies[i].sprite === sprite){
        bodies[i].enabled = (enabled!==false);
        return true;
      }
    }
    return false;
  },

  /**
   * Checks weather two sprite objects rects have collided.
   * @method checkCollision
   * @param  {rect} a A rect sprite object represented by a rect object
   * @param  {rect} b A rect sprite object represented by a rect object
   * @instance
   * @private
   */
  checkCollision: function (a, b){
    var result = !( a.left >= b.right || a.right <= b.left || a.top >= b.bottom || a.bottom <= b.top) &&
                  inGroups(a.body.groups, b.body.groups) && a.body.enabled && b.body.enabled &&
                  a.body.sprite.stage && b.body.sprite.stage;

    if (result){
      if (typeof a.body.sprite.collide === 'function') a.body.sprite.collide.call(a.body.sprite, b);
      if (typeof b.body.sprite.collide === 'function') b.body.sprite.collide.call(b.body.sprite, a);
    }
    return result;
  },

  /**
   * Creates a body rect bounding box
   * @method addSprite
   * @param  {Body} body A body sprite object
   * @instance
   * @private
   */
  rect: function (body){
    var rect = { body: body };
    var sprite = body.sprite;
    var pos = sprite.toGlobal(new PIXI.Point(0, 0));
    var width = Math.abs(sprite.width * sprite.scale.x);
    var height = Math.abs(sprite.height * sprite.scale.y);

    rect.left = pos.x - width * sprite.anchor.x + width * Math.min(0, sprite.scale.x);
    rect.top = pos.y - height * sprite.anchor.y + height * Math.min(0, sprite.scale.y);
    rect.right = rect.left + width;
    rect.bottom = rect.top + height;
    return rect;
  }
};

export default Collider;