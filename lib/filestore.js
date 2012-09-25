/*!
 * Connect - File
 *
 */

var fs = require('fs')
  , path = require('path')
  , crypto = require('crypto');

/**
 * MD5 hash
 * 
 * @param {String} s
 * @param {String} encoding, optional, default is hex
 * @return depend on encoding
 * @api private
 */
function md5(s, encoding) {
	var h = crypto.createHash('md5');
	h.update(s);
	return h.digest(encoding || 'hex');
};


/**
 * Return the `FileStore` extending `connect`'s session Store.
 *
 * @param {object} connect
 * @return {Function}
 * @api public
 */

module.exports = function(connect){

  /**
   * Connect's Store.
   */

  var Store = connect.session.Store;

  /**
   * Initialize FileStore with the given `options`.
   *
   * @param {Object} options
   * @api public
   */

  function FileStore(filedir) {
    this.filedir = filedir;
    if(!path.existsSync(filedir)) {
        fs.mkdirSync(filedir, '755');
    }
  };

  /**
   * Inherit from `Store`.
   */

  FileStore.prototype.__proto__ = Store.prototype;

  /**
   * Attempt to fetch session by the given `key`.
   *
   * @param {String} key
   * @param {Function} callback
   * @api public
   */

  FileStore.prototype.get = function(key, callback){
    var p = path.join(this.filedir, md5(key));
    fs.readFile(p, function (err, data) {
        if(err) {
            callback();
        } else {
            try {
                callback(null, JSON.parse(data.toString()));
            } catch(e) {
                callback(e);
            }
        }
    });
  };

  /**
   * Commit the given `value` object associated with the given `key`.
   *
   * @param {String} key
   * @param {Session} value
   * @param {Function} callback
   * @api public
   */

  FileStore.prototype.set = function(key, value, callback){
    var p = path.join(this.filedir, md5(key));
    fs.writeFile(p, JSON.stringify(value), function (err) {
        callback && callback(err);
    });
  };

  /**
   * Destroy the session associated with the given `key`.
   *
   * @param {String} key
   * @api public
   */

  FileStore.prototype.destroy = function(key, callback){
    var p = path.join(this.filedir, md5(key));
    fs.unlink(p, function(err) {
        callback && callback(err);
    });
  };

  /**
   * Fetch number of sessions.
   *
   * @param {Function} callback
   * @api public
   */

  FileStore.prototype.length = function(callback){
    fs.readdir(this.filedir, function(err, files) {
        callback(null, files ? files.length : 0);
    });
  };

  /**
   * Clear all sessions.
   *
   * @param {Function} callback
   * @api public
   */

  FileStore.prototype.clear = function(callback){
    fs.readdir(this.filedir, function(err, files) {
        var count = 0;
        if(files) {
            for(var i = 0, len = files.length; i < len; i++) {
                var p = path.join(this.filedir, files[i]);
                rs.unlinkSync(p);
            }
        }
        callback && callback();
    });
  };

  return FileStore;
};
