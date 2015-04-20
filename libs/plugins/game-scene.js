/**
 * @plugin GameScene plugin
 * @description A plugin that helps adding of visual objects to a GameWindow that can be swapped with other scenes.
 * @version 1.0.0
 * @author Alejandro Gonzalez Sole
 * @email guatedude@gmail.com
 *
 * @dependency pixi
 * @dependency class
 * @dependency keyboard
 *
 * MIT Licensed.
 **/
import PIXI from 'pixi';
import Class from 'class';
import keyboard from 'keyboard';

/**
 * The GameScene class helps adding of visual objects to a GameWindow that can be swapped with other scenes.
 * @class GameScene
 * @param {color} bgColor The background color of the scene
 * @extends PIXI.DisplayObjectContainer
 * @global
 */
export default Class.inherit(PIXI.DisplayObjectContainer).extend({
  stage: null,
  _constructor: function (bgColor){

    var self = this;
    this._super();

    this.interactive = true;

    var backgroundColor = self.backgroundColor || 0x000000;

    Object.defineProperty(self, 'backgroundColor',{
      enumerable: true,
      configurable: true,
      get: function (){
        return backgroundColor;
      },
      set: function (bgColor){
        backgroundColor = bgColor;
        if (self.stage){
          self.stage.setBackgroundColor(bgColor);
        }
      }
    });

    keyboard.onKeyDown(this.keydown, this);
    keyboard.onKeyUp(this.keydown, this);
  },
  _destroy: function(){
    this.removeChildren();
  },
  /**
   * The initializer method that is called after the scene has been added to "GameWindow"
   * @method init
   * @instance
   * @memberof GameScene
   */
  init: function(){},
  /**
   * The method thats called when the scene has been swapped with another
   * @method unload
   * @instance
   * @memberof GameScene
   */
  unload: function(){},
  /**
   * The width of the displayObjectContainer, setting this will actually modify the scale to achieve the value set
   *
   * @property width
   * @type Number
   * @instance
   * @memberof GameScene
   */

  /**
   * The height of the displayObjectContainer, setting this will actually modify the scale to achieve the value set
   *
   * @property height
   * @type Number
   * @instance
   * @memberof GameScene
   */

  /**
   * Adds a child to the container.
   *
   * @method addChild
   * @param child {DisplayObject} The DisplayObject to add to the container
   * @return {DisplayObject} The child that was added.
   * @instance
   * @memberof GameScene
   */

  /**
   * Adds a child to the container at a specified index. If the index is out of bounds an error will be thrown
   *
   * @method addChildAt
   * @param child {DisplayObject} The child to add
   * @param index {Number} The index to place the child in
   * @return {DisplayObject} The child that was added.
   * @instance
   * @memberof GameScene
   */
  /**
   * Swaps the position of 2 Display Objects within this container.
   *
   * @method swapChildren
   * @param child {DisplayObject}
   * @param child2 {DisplayObject}
   * @instance
   * @memberof GameScene
   */

  /**
   * Returns the index position of a child DisplayObject instance
   *
   * @method getChildIndex
   * @param child {DisplayObject} The DisplayObject instance to identify
   * @return {Number} The index position of the child display object to identify
   * @instance
   * @memberof GameScene
   */

  /**
   * Changes the position of an existing child in the display object container
   *
   * @method setChildIndex
   * @param child {DisplayObject} The child DisplayObject instance for which you want to change the index number
   * @param index {Number} The resulting index number for the child display object
   * @instance
   * @memberof GameScene
   */

  /**
   * Returns the child at the specified index
   *
   * @method getChildAt
   * @param index {Number} The index to get the child from
   * @return {DisplayObject} The child at the given index, if any.
   * @instance
   * @memberof GameScene
   */

  /**
   * Removes a child from the container.
   *
   * @method removeChild
   * @param child {DisplayObject} The DisplayObject to remove
   * @return {DisplayObject} The child that was removed.
   * @instance
   * @memberof GameScene
   */

  /**
   * Removes a child from the specified index position.
   *
   * @method removeChildAt
   * @param index {Number} The index to get the child from
   * @return {DisplayObject} The child that was removed.
   * @instance
   * @memberof GameScene
   */

  /**
  * Removes all children from this container that are within the begin and end indexes.
  *
  * @method removeChildren
  * @param beginIndex {Number} The beginning position. Default value is 0.
  * @param endIndex {Number} The ending position. Default value is size of the container.
   * @instance
   * @memberof GameScene
  */
  /**
   * Retrieves the bounds of the displayObjectContainer as a rectangle. The bounds calculation takes all visible children into consideration.
   *
   * @method getBounds
   * @return {Rectangle} The rectangular bounding area
   * @instance
   * @memberof GameScene
   */

  /**
   * Retrieves the non-global local bounds of the displayObjectContainer as a rectangle. The calculation takes all visible children into consideration.
   *
   * @method getLocalBounds
   * @return {Rectangle} The rectangular bounding area
   * @instance
   * @memberof GameScene
   */

  /**
   * Sets the containers Stage reference. This is the Stage that this object, and all of its children, is connected to.
   *
   * @method setStageReference
   * @param stage {Stage} the stage that the container will have as its current stage reference
   * @instance
   * @memberof GameScene
   */

  /**
   * Removes the current stage reference from the container and all of its children.
   *
   * @method removeStageReference
   * @instance
   * @memberof GameScene
   */

  /*
   * MOUSE Callbacks
   */

  /**
   * A callback that is used when the users mouse rolls over the displayObject
   * @method mouseover
   * @param interactionData {InteractionData}
   * @instance
   * @memberof GameScene
   */

  /**
   * A callback that is used when the users mouse leaves the displayObject
   * @method mouseout
   * @param interactionData {InteractionData}
   * @instance
   * @memberof GameScene
   */

  //Left button
  /**
   * A callback that is used when the users clicks on the displayObject with their mouse's left button
   * @method click
   * @param interactionData {InteractionData}
   * @instance
   * @memberof GameScene
   */

  /**
   * A callback that is used when the user clicks the mouse's left button down over the sprite
   * @method mousedown
   * @param interactionData {InteractionData}
   * @instance
   * @memberof GameScene
   */

  /**
   * A callback that is used when the user releases the mouse's left button that was over the displayObject
   * for this callback to be fired, the mouse's left button must have been pressed down over the displayObject
   * @method mouseup
   * @param interactionData {InteractionData}
   * @instance
   * @memberof GameScene
   */

  /**
   * A callback that is used when the user releases the mouse's left button that was over the displayObject but is no longer over the displayObject
   * for this callback to be fired, the mouse's left button must have been pressed down over the displayObject
   * @method mouseupoutside
   * @param interactionData {InteractionData}
   * @instance
   * @memberof GameScene
   */

  //Right button
  /**
   * A callback that is used when the users clicks on the displayObject with their mouse's right button
   * @method rightclick
   * @param interactionData {InteractionData}
   * @instance
   * @memberof GameScene
   */

  /**
   * A callback that is used when the user clicks the mouse's right button down over the sprite
   * @method rightdown
   * @param interactionData {InteractionData}
   * @instance
   * @memberof GameScene
   */

  /**
   * A callback that is used when the user releases the mouse's right button that was over the displayObject
   * for this callback to be fired the mouse's right button must have been pressed down over the displayObject
   * @method rightup
   * @param interactionData {InteractionData}
   * @instance
   * @memberof GameScene
   */

  /**
   * A callback that is used when the user releases the mouse's right button that was over the displayObject but is no longer over the displayObject
   * for this callback to be fired, the mouse's right button must have been pressed down over the displayObject
   * @method rightupoutside
   * @param interactionData {InteractionData}
   * @instance
   * @memberof GameScene
   */

  /*
   * TOUCH Callbacks
   */

  /**
   * A callback that is used when the users taps on the sprite with their finger
   * basically a touch version of click
   * @method tap
   * @param interactionData {InteractionData}
   * @instance
   * @memberof GameScene
   */

  /**
   * A callback that is used when the user touches over the displayObject
   * @method touchstart
   * @param interactionData {InteractionData}
   * @instance
   * @memberof GameScene
   */

  /**
   * A callback that is used when the user releases a touch over the displayObject
   * @method touchend
   * @param interactionData {InteractionData}
   * @instance
   * @memberof GameScene
   */

  /**
   * A callback that is used when the user releases the touch that was over the displayObject
   * for this callback to be fired, The touch must have started over the sprite
   * @method touchendoutside
   * @param interactionData {InteractionData}
   * @instance
   * @memberof GameScene
   */
  /**
   * A callback that is used when the user presses a key
   * @method keydown
   * @param keyEvent {KeyEvent}
   * @instance
   * @memberof GameScene
   */
  keydown: function (){},
  /**
   * A callback that is used when the user releases a key
   * @method keyup
   * @param keyEvent {KeyEvent}
   * @instance
   * @memberof GameScene
   */
  keyup: function (){}
});