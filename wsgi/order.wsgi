# Copyright(c) gert.cuykens@gmail.com
from json import loads
from db import Db
from session import Session
from response import text
from binascii import hexlify
from os import urandom

def application(environ, response):
    sid = None if not 'HTTP_COOKIE' in environ else environ['HTTP_COOKIE']
    v = loads(environ['wsgi.input'].read(int(environ['CONTENT_LENGTH'])).decode('utf-8'))
    db = Db()

    def order():
        s = Session(sid,db,'guest')
        db.execute("SELECT * FROM orders WHERE uid=? AND oid=?",(s.UID,v['oid']))
        return text(response,db,s)
    def find():
        s = Session(sid,db,'guest')
        db.execute("SELECT p.pid,p.txt,p.price,p.qty-IFNULL(q.qty_sold,0) 'qty_available' FROM PRODUCTS p LEFT JOIN (SELECT o.pid 'pid', SUM(o.qty) 'qty_sold' FROM ORDERS o GROUP BY pid) q ON q.pid=p.pid WHERE ? LIKE ?",('txt','%'+v['txt']+'%',))
        return text(response,db,s)
    def insert():
        s = Session(sid,db,'guest')
        if v['qty']==0:
            db.execute("DELETE FROM orders WHERE pid=? AND uid=? AND oid='new'",(v['pid'],s.UID))
        else:
            db.execute("INSERT INTO orders (pid, txt, price) SELECT pid, txt, price FROM products WHERE pid=? AND ? NOT IN (SELECT pid FROM orders WHERE oid='new')",(v['pid'],v['pid']))
            db.execute("UPDATE orders SET qty=?, time=DATETIME('NOW'), uid=?, gid='guest' WHERE pid=? AND oid='new'",(v['qty'],s.UID,v['pid']))
        return text(response,db,s)
    def pay():
        s = Session(sid,db,'guest')
        for i in range(3):
            r=hexlify(urandom(8)).decode('ascii')
            db.execute("SELECT count(*) FROM orders WHERE oid=?",(r,))
            if db.fetch()[0][0]==0:
                db.execute("UPDATE orders SET oid=? WHERE uid=? AND oid='new'",(r,s.UID))
                s.UID=r
                break
        else: raise RuntimeError('Failed to generate unique order ID')
        return text(response,db,s)

    func = {'order': order,
            'find': find,
            'insert': insert,
            'pay': pay}

    return func[v['cmd']]()

