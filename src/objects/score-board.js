import PIXI from 'pixi';
import GameWindow from 'game-window';
import Animator from 'animator';
import R from 'pixi-resource';

class ScoreBoard extends PIXI.DisplayObjectContainer{
  // constructor
  constructor(){
    super();
    var that = this;

    // add score board panel
    this.scoreBoard = new PIXI.Sprite(R.assets.score);
    this.scoreBoard.anchor.set(0.5, 0.5);
    this.scoreBoard.position.set(GameWindow.stageWidth/2, GameWindow.stageHeight/2-140);
    this.addChild(this.scoreBoard);

    // add score board high score label
    this.highScoreLabel = new PIXI.BitmapText("0", { font: '60px Pixel' });
    this.highScoreLabel.position.set(GameWindow.stageWidth/2+ 100, GameWindow.stageHeight/2-152);
    this.addChild(this.highScoreLabel);

    // add score label
    this.scoreLabel = new PIXI.BitmapText("0", { font: '60px Pixel' });
    this.scoreLabel.position.set(GameWindow.stageWidth/2+ 100, GameWindow.stageHeight/2-92);
    this.addChild(this.scoreLabel);

    // add play again label
    this.playAgainButton = new PIXI.Sprite(R.assets.playbutton);
    this.playAgainButton.anchor.set(0.5, 0.5);
    this.playAgainButton.position.set(GameWindow.stageWidth/2, GameWindow.stageHeight/2+140);
    this.playAgainButton.interactive = true;
    this.addChild(this.playAgainButton);
  }

  // triggered when the player dies
  show(score, highscore, restart){
    var that = this;

    // add callback event to the "play again" button
    this.playAgainButton.tap = function (){
      restart();
    };
    this.playAgainButton.click = function (){
      restart();
    };
    // set the text of the score labels
    this.scoreLabel.setText(score.toString());
    this.highScoreLabel.setText(highscore.toString());
    this.alpha = 0;
    this.playAgainButton.alpha = 0;
    //animate the fade in
    var animation = new Animator(this);
    animation.to({alpha: 1});
    animation.start();
    setTimeout(function () {
      that.playAgainButton.alpha = 1;

    }, 600);
  }
}

export default ScoreBoard;