import PIXI from 'pixi';
import GameWindow from 'game-window';
import R from 'pixi-resource';
import SpriteCollider from 'sprite-collider';
import TextureDraw from 'texture-draw';
import ObjectPool from 'object-pool';


var obstaclesArray = [];

//Class for Obstacles
class Obstacle extends PIXI.DisplayObjectContainer{
  constructor() {
    super();
    this.scene = null;
    this.gapHeight = null;

    var gapSize = 350;

    this.gapHeight = Math.floor(Math.random()*600) + 100;

    //top sprite
    this.topSprite = new PIXI.Sprite(R.assets.obstacle);
    this.topSprite.scale.set(1, -1);
    this.topSprite.position.y = this.gapHeight;
    SpriteCollider.addSprite(this.topSprite, 1);
    this.addChild(this.topSprite);

    //bottom sprite
    this.bottomSprite = new PIXI.Sprite(R.assets.obstacle);
    this.bottomSprite.position.y = this.gapHeight + gapSize;
    SpriteCollider.addSprite(this.bottomSprite, 1);
    this.addChild(this.bottomSprite);

    //goal sprite
    this.goalSprite = new PIXI.Sprite();
    this.goalSprite.position.y = this.gapHeight;
    this.goalSprite.position.x = this.topSprite.width*1.5;
    this.goalSprite.width = this.topSprite.width;
    this.goalSprite.height = gapSize;
    this.goalSprite.collide = function() {
      SpriteCollider.enableSprite(this, false);
    }
    SpriteCollider.addSprite(this.goalSprite, 2);
    this.addChild(this.goalSprite);
  }

  update(){
    this.position.x -= 5;
    if (this.position.x + this.width < 0) {
      Obstacle.pool.remove(this);
    }
  }
}

//Class for Obstacle Pool
class ObstaclePool extends ObjectPool{
  init() {
    return new Obstacle();
  }

  create(parent) {
    var obstacle = super.create();
    obstacle.position.x = GameWindow.stageWidth;
    parent.addChild(obstacle);
    SpriteCollider.enableSprite(obstacle.goalSprite, true);
    obstaclesArray.push(obstacle);
    return obstacle;
  }

  remove(obstacle) {
    super.remove(obstacle);
    obstacle.parent.removeChild(obstacle);
    obstaclesArray.splice(obstaclesArray.indexOf(obstacle), 1);
  }
}


Obstacle.pool = new ObstaclePool();
Obstacle.reset = function (){
  while(obstaclesArray.length > 0){
    Obstacle.pool.remove(obstaclesArray[0]);
  }
}

Obstacle.updateAll = function () {
  for (var i=0; i<obstaclesArray.length; i++){
    obstaclesArray[i].update();
  }
}

export default Obstacle;