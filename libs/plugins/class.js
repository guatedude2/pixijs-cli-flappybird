/**
 * @plugin Javascript simple inheritance
 * @description A plugin for class inheritance (base on John Resig's simple inheritance script)
 * @version 0.0.2
 * @author Alejandro Gonzalez Sole
 * @email guatedude@gmail.com
 *
 * MIT Licensed.
 **/

/**
 * @ignore
 */
var initializing = false,
  fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.* /;

/**
 * A class that helps with inheritance
 *
 * Note: This class will soon be deprecated.
 * @class Class
 * @global
 */
function Class(){};

function inheritClass(superClass){
  var self = this;
  function Class(){
    if (!initializing && typeof this._constructor === 'function')
      this._constructor.apply(this, arguments);
  }

  Class.prototype = superClass.prototype;
  Class.prototype._constructor = superClass;
  Class.prototype.constructor = Class;
  Class.extend = extendClass;
  //currenlty if you inhert multiple classes it breaks
  //Class.inherit = inheritClass;
  return Class;
};

function extendClass(prop) {
  var self = this;
  var _super = self.prototype;

  function Class(){
    if (!initializing && typeof this._constructor === 'function')
      this._constructor.apply(this, arguments);
  }

  initializing = true;
  var prototype = new self();
  initializing = false;

  for (var name in prop) {
    prototype[name] = typeof prop[name] == "function" &&
      typeof _super[name] == "function" && fnTest.test(prop[name]) ?
      (function(name, fn){
        return function() {
          var tmp = this._super;
          this._super = _super[name];
          var ret = fn.apply(this, arguments);
          this._super = tmp;
          return ret;
        };
      })(name, prop[name]) : prop[name];
  }

  Class.prototype = prototype;
  Class.prototype.constructor = Class;
  Class.extend = extendClass;
  //Class.inherit = inheritClass;

  return Class;
};

/**
 * Extends an existing prototype object. Only "Class" objects that have not been extended or inherted can be inherited.
 * @method inherit
 * @param  {Object} superClass The class to inhert.
 * @return {Object}            The new "Class" object that inherits from "superClass".
 * @instance
 * @memberof Class
 */
Class.inherit = inheritClass;

/**
 * Extends a "Class" object with an existing object overriding any existing methods.
 *
 * Parent methods can be accessed by "this._super()" inside the method being overridden.
 * @method extend
 * @param  {Object} object  The object that contains the methods and properties to override the parent class
 * @return {Object}         The new "Class" object that inherits "prop" methods and properties
 * @instance
 * @memberof Class
 */
Class.extend = extendClass;

export default Class;