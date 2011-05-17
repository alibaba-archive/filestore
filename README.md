# A File Store,  could use in connect.session

Implement all the method for connect.session

Every session store _must_ implement the following methods

- `.get(sid, callback)`
- `.set(sid, session, callback)`
- `.destroy(sid, callback)`

_must_ Inherit from `connect.session.Store`.

Recommended methods include, but are not limited to:

- `.length(callback)`
- `.clear(callback)`

## How to use

    var FileStore = require('filestore').FileStore;
    var filedir = __dirname + '/.sessions';
    app.use(express.session({secret: 'A secret', store: new FileStore(filedir)}));

