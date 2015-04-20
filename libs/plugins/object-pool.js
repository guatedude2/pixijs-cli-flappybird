/**
 * @plugin ObjectPool plugin
 * @description A plugin that allows previously created objects to be reused.
 * @version 1.0.0
 * @author Alejandro Gonzalez Sole
 * @email guatedude@gmail.com
 *
 * @dependency class
 *
 * MIT Licensed.
 **/
import Class from 'class';
/**
 * A class that allows previously created objects to be reused.
 * @class
 * @param {string} key (optional) - key id to store objects in pools with the same key
 */
function ObjectPool(key){
  this._reserve = [];
  this.poolKey = key || '__pool_key__';
}

/**
 * Returns an existing object in the reserve or creates a new object returned by
 * the "init" method.
 *
 * The "enable" method will be triggered before the object is returned.
 * @method create
 * @return {Object}
   * @instance
   * @memberof GameScene
 */
ObjectPool.prototype.create = function(){
  var obj;
  if (typeof this.init !== 'function'){
    throw new Error('Missing required factory method "init"');
  }
  if (this._reserve.length===0){
    obj = this.init();
    obj.__poolKey = this.poolKey;
  }else{
    obj = this._reserve.pop();
  }
  if (typeof this.enable === 'function') this.enable(obj);
  return obj;
}

/**
 * Removes a pool object created by the "create" method. Objects from different
 * pools can be added as long as the object has the same pool key.
 *
 * The "disable" method will be triggered after the object has been placed in
 * the reserve.
 * @method remove
 * @param  {Object} object - the pool object to be placed in the reserve.
 * @instance
 * @memberof GameScene
 */
ObjectPool.prototype.remove = function(obj){
  if (obj.__poolKey===this.poolKey){
    this._reserve.push(obj);
    if (typeof this.enable === 'function') this.disable(obj);
  }else{
    throw new Error("Unable to add an object that does not belong to this pool");
  }
}

/**
 * Clears the reserve of pool objects
 * @method clean
 * @instance
 * @memberof GameScene
 */
ObjectPool.prototype.clean = function(){
  this._reserve = [];
}

export default Class.inherit(ObjectPool);