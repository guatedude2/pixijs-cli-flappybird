import PIXI from 'pixi';
import GameWindow from 'game-window';
import Assets from './assets';
import MainScene from './scenes/main';
//Create a new game window

var windowRatio = window.innerHeight / window.innerWidth;
GameWindow.init({
  stageWidth: 750,
  stageHeight: 1334, // for proper scaling use stageHeight: 750*windowRatio,
  scaleMode: 'ScaleFit' // for productino use scaleMode: 'ScaleFitCrop'
});

//Wait for assets to be loaded
Assets.preload(function () {
  //create a new scene and set the current stage
  var scene = new MainScene();
  GameWindow.setScene(scene);
});
