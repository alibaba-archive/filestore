/**
 * Module dependencies.
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

var FileStore = module.exports = function FileStore(filedir) {
    this.filedir = filedir;
    if(!path.existsSync(filedir)) {
        fs.mkdirSync(filedir, '755');
    }
};

try {
	/**
	 * Support for connect.session: connect > 1.4.0 must need this.
	 * 
	 * Inherit from `Store.prototype`.
	 */
	var Store = require('connect').session.Store;
	FileStore.prototype.__proto__ = Store.prototype;
} catch(e) {
	console.warn('Would not support for connect.session if you dont install connect');
}

FileStore.prototype.get = function(key, callback) {
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

FileStore.prototype.set = function(key, value, callback) {
    var p = path.join(this.filedir, md5(key));
    fs.writeFile(p, JSON.stringify(value), function (err) {
        callback && callback(err);
    });
};

FileStore.prototype.destroy = function(key, callback) {
    var p = path.join(this.filedir, md5(key));
    fs.unlink(p, function(err) {
        callback && callback(err);
    });
};

FileStore.prototype.length = function(callback) {
    fs.readdir(this.filedir, function(err, files) {
        callback(null, files ? files.length : 0);
    });
};

FileStore.prototype.clear = function(callback) {
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