import PIXI from 'pixi';
import R from 'pixi-resource';
import GameWindow from 'game-window';

var jumpTimerId;
var gravity = 1;
var groundLevel;

class Player extends PIXI.Sprite{
  // constructor
  constructor(){
    //call the constructor of PIXI.Sprite
    super(R.assets.bird1);
    //add event listener support
    PIXI.EventTarget.call(this);
    //set the ground level
    groundLevel = GameWindow.stageHeight - 260;
    //set the anchor point
    this.anchor.set(0.5, 0.5);
    //add the velocity
    this.velocity = new PIXI.Point(0, 0);
    this.reset();
  }

  // reset the player to center of the screen and revive him
  reset(){
    this.position.set(GameWindow.stageWidth/2, GameWindow.stageHeight/2-200);
    this.dead = false;
  }

  // triggered when the player collides with something
  collide(col){
    if (col.body.groups.indexOf(2)>=0){
      // if player collided witha a goal emit the "goal" signal
      this.emit('goal');
    }else{
      // if the player collided with the ground or an obstacle make him fall
      this.velocity.y = 0;
      if (this.position.x+this.height/2 > col.left && this.position.y < col.bottom){
      // if the player collided with a obstacle to rest on top of obstacle
        this.position.y = Math.floor(col.top - this.height/2);
      }else if (this.position.y < col.bottom){
        // if the player collieded with the side of an obstacle make him stop at the
        // beginning of the obstacle
        this.position.x = col.left-this.width/2;
      }
      if (!this.dead){
        // send the "collided" signal and make the player dead
        this.velocity.y = -10;
        this.dead = true;
        this.emit('collided');
      }
    }
  }

  // triggered on every frame
  update(){
    // add gravity forces
    this.velocity.y += gravity;
    this.position.y += this.velocity.y;
  }

  // triggered when the user jumps
  jump(){
    if (this.position.y<0) return;
    this.velocity.y = -17;
    var self = this;
    // update graphics
    this.setTexture(R.assets.bird2);
    clearTimeout(jumpTimerId);
    jumpTimerId = setTimeout(function (){
      self.setTexture(R.assets.bird1);
    }, 100);
  }
}

export default Player;