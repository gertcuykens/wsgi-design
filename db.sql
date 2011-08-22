-- Copyright(c) gert.cuykens@gmail.com

CREATE TABLE IF NOT EXISTS users (
    uid     VARCHAR(64) PRIMARY KEY,
    name    VARCHAR(64) DEFAULT '',
    adress  VARCHAR(64) DEFAULT '',
    city    VARCHAR(64) DEFAULT '',
    country VARCHAR(64) DEFAULT '',
    phone   VARCHAR(64) DEFAULT '',
    picture BLOB
);

CREATE TABLE IF NOT EXISTS groups (
    uid     VARCHAR(64),
    gid     VARCHAR(64),
    PRIMARY KEY(uid,gid),
    FOREIGN KEY(uid) REFERENCES users(uid) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS sessions (
    uid     VARCHAR(64) UNIQUE,
    pwd     VARCHAR(64) DEFAULT '',
    sid     VARCHAR(64) PRIMARY KEY,
    exp     DATETIME,
    FOREIGN KEY(uid) REFERENCES users(uid) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS appointments (
    uid         VARCHAR(64),
    gid         VARCHAR(64) DEFAULT 'guest',
    aid         INTEGER PRIMARY KEY,
    calendar    DATETIME,
    appointment VARCHAR(64),
    FOREIGN KEY(uid,gid) REFERENCES groups(uid,gid) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS topics (
    iid   INTEGER DEFAULT 0,
    uid   VARCHAR(64),
    gid   VARCHAR(64) DEFAULT 'guest',
    hid   INTEGER PRIMARY KEY,
    topic VARCHAR(64),
    FOREIGN KEY(uid,gid) REFERENCES groups(uid,gid) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS threads (
    iid     INTEGER DEFAULT 0,
    uid     VARCHAR(64),
    gid     VARCHAR(64) DEFAULT 'guest',
    hid     INTEGER,
    tid     INTEGER PRIMARY KEY,
    thread  VARCHAR(64),
    FOREIGN KEY(hid) REFERENCES topics(hid) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY(uid,gid) REFERENCES groups(uid,gid) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS messages (
    iid     INTEGER DEFAULT 0,
    uid     VARCHAR(64), 
    gid     VARCHAR(64) DEFAULT 'guest',
    tid     INTEGER,
    mid     INTEGER PRIMARY KEY,
    time    DATETIME,
    message VARCHAR(64),
    FOREIGN KEY(tid) REFERENCES threads(tid) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY(uid,gid) REFERENCES groups(uid,gid) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS products (
    pid     INTEGER UNSIGNED PRIMARY KEY,
    txt     VARCHAR(64),
    price   INTEGER UNSIGNED,
    qty     INTEGER
);

CREATE TABLE IF NOT EXISTS orders (
    pid     INTEGER UNSIGNED,
    txt     VARCHAR(64),
    price   INTEGER UNSIGNED,
    qty     INTEGER,
    time    DATETIME DEFAULT CURRENT_TIMESTAMP,
    oid     VARCHAR(64) DEFAULT 'new',
    uid     VARCHAR(64),
    gid     VARCHAR(64) DEFAULT 'guest',
    FOREIGN KEY(uid,gid) REFERENCES groups(uid,gid) ON UPDATE CASCADE ON DELETE CASCADE
);
