# Copyright(c) gert.cuykens@gmail.com
from json import loads
from db import Db
from session import Session
from response import text

def application(environ, response):
    sid = None if not 'HTTP_COOKIE' in environ else environ['HTTP_COOKIE']
    v = loads(environ['wsgi.input'].read(int(environ['CONTENT_LENGTH'])).decode('utf-8'))
    db = Db()

    def select():
        s = Session(sid,db,'guest')
        db.execute("SELECT p.pid,p.txt,p.price,p.qty-IFNULL(q.qty_sold,0) 'qty_available' FROM PRODUCTS p LEFT JOIN (SELECT o.pid 'pid', SUM(o.qty) 'qty_sold' FROM ORDERS o GROUP BY pid) q ON q.pid=p.pid WHERE p.pid LIKE ? AND p.txt LIKE ? AND p.price LIKE ? OR p.qty <= ?",('%'+v['pid']+'%','%'+v['txt']+'%','%'+v['price']+'%',v['qty']))
        return text(response,db,s)
    def insert():
        s = Session(sid,db,'guest')
        db.execute("INSERT INTO products VALUES (?,?,?,?+coalesce((SELECT sum(qty) FROM orders WHERE pid=?),0))",(v['pid'],v['txt'],v['price'],v['qty'],v['pid']))
        return text(response,db,s)
    def update():
        s = Session(sid,db,'guest')
        db.execute("UPDATE products SET txt=?, price=?, qty=?+coalesce((SELECT sum(qty) FROM orders WHERE pid=products.pid),0) WHERE pid=?",(v['txt'],v['price'],v['qty'],v['pid']))
        return text(response,db,s)
    def delete():
        s = Session(sid,db,'guest')
        db.execute("DELETE FROM products WHERE pid=?",(v['pid'],))
        return text(response,db,s)

    func = {'select': select,
            'insert': insert,
            'update': update,
            'delete': delete}

    return func[v['cmd']]()

