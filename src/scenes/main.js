import PIXI from 'pixi';
import GameScene from 'game-scene';
import GameWindow from 'game-window';
import Player from '../objects/player';
import Obstacle from '../objects/obstacle';
import Background from '../objects/background';
import ScoreBoard from '../objects/score-board';
import R from 'pixi-resource';
import keyboard from 'keyboard';
import SpriteCollider from 'sprite-collider';

class MainScene extends GameScene{

  //initializer
  init() {
    //set the scene background and initialize variables
    this.backgroundColor = 0x7acde6;
    this.offset = 0;
    this.gameover = false;
    this.started = false;
    this.score = 0;
    this.highscore = 0;
    this.obstacles = [];


    // create and add the paralax background
    this.bg = new Background();
    this.addChild(this.bg);

    // create and add obstacle container
    this.obstacleContainer = new PIXI.DisplayObjectContainer();
    this.addChild(this.obstacleContainer);

    // create and add player
    this.player = new Player();
    this.player.on('collided', this.collided.bind(this));
    this.player.on('goal', this.goal.bind(this));
    SpriteCollider.addSprite(this.player, [0, 1, 2]);
    this.addChild(this.player);

    // create and add score label
    this.scoreLabel = new PIXI.BitmapText("0", { font: '90px Pixel' });
    this.scoreLabel.position.set(GameWindow.stageWidth/2 - this.scoreLabel.width/2, 200);
    this.addChild(this.scoreLabel);

    // create score board
    this.scoreBoard = new ScoreBoard();
    this.scoreBoard.restart = this.restart();

  }

  // triggered when the player collides
  collided() {
    var that = this;
    if (!this.gameover){
      // show gameover and score board
      that.gameover = true;
      setTimeout(function (){
        that.addChild(that.scoreBoard);
        that.scoreBoard.show(that.score, that.highscore, function (){
          that.removeChild(that.scoreBoard);
          that.restart();
        });
      }, 600);
    }
  }

  // triggered when the player touches a goal
  goal() {
    // increase score and highscore
    this.score++;
    if (this.score > this.highscore){
      this.highscore = this.score;
    }
    //update score label and center it
    this.scoreLabel.setText(this.score.toString());
    this.scoreLabel.position.set(GameWindow.stageWidth/2 - this.scoreLabel.width/2, 200);
  }

  // triggered when the user presses the "play again" button
  restart(){
    this.score = 0;
    this.offset = 0;
    this.scoreLabel.setText(this.score.toString());
    this.gameover = false;
    Obstacle.reset();
    this.player.reset();
    this.player.jump();
  }

  // triggered on every frame
  update() {
    if (!this.gameover) {
      this.bg.update();

      // if user started playing then generate obstacles
      if (this.started){
        this.offset++;
        if (this.offset > 120) {
          Obstacle.pool.create(this.obstacleContainer);
          this.offset = 0;
        }
        // update obstacles movement
        Obstacle.updateAll();
      }
    }
    // update player's movements
    if (this.started){
      this.player.update();
    }
  }

  // user input on mobile
  touchstart() {
    if (!this.gameover) {
      this.started = true;
      //make player jump
      this.player.jump();
    }
  }

  // user input on desktop
  mousedown(ev) {
    this.touchstart(ev)
  }
}

export default MainScene;
