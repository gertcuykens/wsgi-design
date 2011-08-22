# Copyright(c) gert.cuykens@gmail.com
from json import loads
from db import Db
from session import Session
from response import text
from time import strftime, gmtime, time
from binascii import hexlify
from os import urandom

def application(environ, response):
    sid = None if not 'HTTP_COOKIE' in environ else environ['HTTP_COOKIE']
    v = loads(environ['wsgi.input'].read(int(environ['CONTENT_LENGTH'])).decode('utf-8'))
    db = Db()

    def mailpwd():
        db.execute('SELECT pwd FROM sessions WHERE uid=?',(v['uid'],))
        mail(v['uid'],'password',db)
        s =  Session(sid,db,'guest')
        return text(response,db,s)
    def logout():
        db.execute('UPDATE sessions SET exp=? WHERE sid=?',(strftime('%Y-%m-%d %H:%M:%S', gmtime(time()-1)),sid))
        s = Session(sid,db,'guest')
        return text(response,db,s)
    def sign():
        db.execute("INSERT INTO sessions (uid, pwd, sid, exp) SELECT ?,?,?,? WHERE ? NOT IN (SELECT uid FROM sessions)",(v['uid'],v['pwd'],'NEW',strftime('%Y-%m-%d %H:%M:%S',gmtime(time()-1)),v['uid']))
        db.execute("INSERT INTO users (uid) SELECT ? WHERE ? NOT IN (SELECT uid FROM users)",(v['uid'],v['uid']))
        db.execute("INSERT INTO groups (uid, gid) SELECT ?,'guest' WHERE 'guest' NOT IN (SELECT gid FROM groups WHERE uid=?)",(v['uid'],v['uid']))
        db.execute("INSERT INTO groups (uid, gid) SELECT ?,'admin' WHERE 'admin' NOT IN (SELECT gid FROM groups WHERE uid=?)",(v['uid'],v['uid']))
    def login():
        sign() # automatic signup
        for i in range(3):
            sid=hexlify(urandom(8)).decode('ascii')
            try: db.execute('UPDATE sessions SET sid=?, exp=? WHERE uid=? AND pwd=?',(sid,strftime('%Y-%m-%d %H:%M:%S',gmtime(time()+3600)),v['uid'],v['pwd']))
            except IntegrityError: continue
            break
        else: raise RuntimeError('Failed to generate unique session ID')
        s = Session(sid,db,'guest')
        return text(response,db,s)
    def delete():
        s = Session(sid,db,'guest')
        db.execute('DELETE FROM users WHERE uid=?',(s.UID,))
        db.execute('DELETE FROM sessions WHERE uid=?',(s.UID,)) # sqlite no foreign key yet
        s.GID='login'
        return text(response,db,s)
    def update():
        s = Session(sid,db,'guest')
        db.execute('UPDATE users SET name=?, adress=?, city=?, country=?, phone=? WHERE uid=?',(v['name'],v['adress'],v['city'],v['country'],v['phone'],s.UID))
        return text(response,db,s)
    def passwd():
        s = Session(sid,db,'guest')
        db.execute('UPDATE sessions SET pwd=? WHERE sid=?',(v['pwd'],s.SID))
        return text(response,db,s)
    def email():
        s = Session(sid,db,'guest')
        db.TRANSACTION=True
        db.execute('UPDATE users SET uid=? WHERE uid=?',(v['uid'],s.UID))
        db.execute('UPDATE sessions SET uid=? WHERE sid=?',(v['uid'],s.SID))
        db.execute('UPDATE groups SET uid=? WHERE uid=?',(v['uid'],s.UID)) # at all foreign databases for manual uid update
        if db.ERROR == None: db.commit()
        else: db.rollback()
        db.execute('SELECT uid FROM sessions WHERE sid=?',(s.SID,))
        return text(response,db,s)
    def select():
        s = Session(sid,db,'guest')
        db.execute('SELECT uid,name,adress,city,country,phone FROM users WHERE uid=?',(s.UID,))
        return text(response,db,s)
    def guest():
        s = Session(sid,db,'guest')
        return text(response,db,s)
    def admin():
        s = Session(sid,db,'admin')
        return text(response,db,s)

    func = {'delete' : delete,
            'update' : update,
            'passwd' : passwd,
            'email'  : email,
            'select' : select,
            'mailpwd': mailpwd,
            'sign'   : sign,
            'login'  : login,
            'logout' : logout,
            'guest'  : guest,
            'admin'  : admin}

    return func[v['cmd']]()

"""
# http://groups.google.be/group/comp.lang.python/browse_thread/thread/be5a9575d7dbf8f3#
# First copy the row if it exists
db.execute('''insert into "users"
              select ?, "name", adress, city, country, phone, picture
              from "users" where "uid" = ? ''', (v['uid'],s.UID) )

# Second update foriegn key tables to point to the new row
# (but only if the new row exists )
db.execute('''update "sessions" set "uid" = ?
              where "uid" = ?
              and exists(select * from "users" where "uid" = ?) ''', (v['uid'],s.SID, v['uid']) )

#Do the same for the "groups" table, then
# finally delete the original row (again only if the new row exists )
db.execute('''delete from "users"
              where "uid" = ? and exists( select * from "users" where "uid" = ?) ''', (s.SID, v['uid']) )
"""

