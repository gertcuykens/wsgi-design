# Copyright(c) gert.cuykens@gmail.com
from json import loads
from db import Db
from session import Session
from response import text

def application(environ, response):
    sid = None if not 'HTTP_COOKIE' in environ else environ['HTTP_COOKIE']
    v = loads(environ['wsgi.input'].read(int(environ['CONTENT_LENGTH'])).decode('utf-8'))
    db = Db()

    def overview():
        s = Session(sid,db,'guest')
        s.GID =''
        db.execute("SELECT aid, calendar, appointment FROM appointments WHERE calendar >= ? AND calendar < ?",(v['from'],v['to']))
        return text(response,db,s)
    def find():
        s = Session(sid,db,'guest')
        s.GID =''
        db.execute("SELECT aid, calendar, appointment FROM appointments WHERE calendar >= ? AND appointment LIKE ?",(v['calendar'],"%"+v['appointment']+"%"))
        return text(response,db,s)
    def ca():
        s = Session(sid,db,'guest')
        s.GID==''
        db.execute("SELECT users.name, appointments.* FROM users, appointments WHERE users.uid = appointments.uid AND appointments.calendar >= ? AND appointments.appointment LIKE ? AND appointments.uid=? GROUP BY appointments.aid",(v['calendar'],"%"+v['appointment']+"%",v['uid']))
        return text(response,db,s)
    def insert1():
        s = Session(sid,db,'admin')
        if s.GID=='admin': db.execute("INSERT INTO appointments VALUES (?,?,NULL,?,?)",(v['uid'],v['gid'],v['calendar'],v['appointment']))
        return text(response,db,s)
    def insert():
        s = Session(sid,db,'guest')
        if s.GID=='guest': db.execute("INSERT INTO appointments VALUES (?,?,NULL,?,?)",(s.UID,s.GID,v['calendar'],v['appointment']))
        return text(response,db,s)
    def update1():
        s = Session(sid,db,'guest')
        if s.GID=='': db.execute("UPDATE appointments SET uid=?, gid=?, calendar=?, appointment=? WHERE aid=?",(v['uid'],v['gid'],v['calendar'],v['appointment'],v['aid']))
        return text(response,db,s)
    def update():
        s = Session(sid,db,'guest')
        if s.GID=='': db.execute("UPDATE appointments SET calendar=?, appointment=? WHERE aid=? AND uid=?",(v['calendar'],v['appointment'],v['aid'],s.UID))
        return text(response,db,s)
    def remove():
        s = Session(sid,db,'guest')
        db.execute("DELETE FROM appointments WHERE aid=? AND uid=?",(v['aid'],s.UID))
        return text(response,db,s)
    def name():
        s = Session(sid,db,'guest')
        s.GID =''
        db.execute("SELECT uid,name,adress,city,country,phone FROM users WHERE name LIKE ?",("%"+v['name']+"%",))
        return text(response,db,s)

    func = {'overview' : overview,
            'find'     : find,
            'ca'       : ca,
            'insert'   : insert,
            'update'   : update,
            'remove'   : remove,
            'name'     : name}

    return func[v['cmd']]()

