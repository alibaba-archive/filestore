# A File Session Store for connect.session

Implement all the method for connect.session

Every session store _must_ implement the following methods

- `.get(sid, callback)`
- `.set(sid, session, callback)`
- `.destroy(sid, callback)`

Recommended methods include, but are not limited to:

- `.length(callback)`
- `.clear(callback)`

## How to use

    var FileStore = require('filestore').FileStore;
    var filedir = __dirname + '/.sessions';
    app.use(express.session({secret: 'A secret', store: new FileStore(filedir)}));
