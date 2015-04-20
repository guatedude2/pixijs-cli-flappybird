import PIXI from 'pixi';
import GameWindow from 'game-window';
import R from 'pixi-resource';
import SpriteCollider from 'sprite-collider';

class Background extends PIXI.DisplayObjectContainer {

  // constructor
  constructor() {
    super();

    // add clouds
    this.clouds = new PIXI.TilingSprite(R.assets.clouds, GameWindow.stageWidth, 380);
    this.clouds.anchor.set(0, 1);
    this.clouds.position.set(0, GameWindow.stageHeight-200)
    this.addChild(this.clouds);

    // add mountain layer 1
    this.mountains1 = new PIXI.TilingSprite(R.assets.mountains1, GameWindow.stageWidth, 335);
    this.mountains1.anchor.set(0, 1);
    this.mountains1.position.set(0, GameWindow.stageHeight-200)
    this.addChild(this.mountains1);

    // add mountain layer 2
    this.mountains2 = new PIXI.TilingSprite(R.assets.mountains2, GameWindow.stageWidth, 175);
    this.mountains2.anchor.set(0, 1);
    this.mountains2.position.set(0, GameWindow.stageHeight-200)
    this.addChild(this.mountains2);

    // add ground
    this.ground = new PIXI.TilingSprite(R.assets.ground, GameWindow.stageWidth, 230);
    this.ground.anchor.set(0, 1);
    this.ground.position.set(0, GameWindow.stageHeight);
    SpriteCollider.addSprite(this.ground, 0);
    this.addChild(this.ground);

  }

  // update paralax backgrounds
  update(){
      this.clouds.tilePosition.x -= 0.25;
      this.ground.tilePosition.x -= 5;
      this.mountains1.tilePosition.x -= 1;
      this.mountains2.tilePosition.x -= 2;
  }
}

export default Background;