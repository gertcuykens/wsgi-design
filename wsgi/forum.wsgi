# Copyright(c) gert.cuykens@gmail.com
from json import loads
from appwsgi.db import Db
from appwsgi.session import Session
from appwsgi.response import text

def application(environ, response):
    sid = None if not 'HTTP_COOKIE' in environ else environ['HTTP_COOKIE']
    v = loads(environ['wsgi.input'].read(int(environ['CONTENT_LENGTH'])).decode('utf-8'))
    db = Db()

    def insert_topics():
        s = Session(sid,db,'guest')
        db.execute("INSERT INTO topics (uid,topic) VALUES (?,?)",(s.UID,v['txt']))
        return text(response,db,s)
    def insert_threads():  
        s = Session(sid,db,'guest')
        db.execute("INSERT INTO threads (uid,hid,thread) VALUES (?,?,?)",(s.UID,v['hid'],v['txt']))
        return text(response,db,s)
    def insert_messages(): 
        s = Session(sid,db,'guest')
        db.execute("INSERT INTO messages (uid,tid,time,message) VALUES (?,?,DATETIME('NOW'),?)",(s.UID,v['tid'],v['txt']))
        return text(response,db,s)
    def update_topics():  
        s = Session(sid,db,'guest')
        db.execute("UPDATE topics SET topic=? WHERE hid=? AND uid=?",(v['txt'],v['hid'],s.UID))
        return text(response,db,s)
    def update_threads(): 
        s = Session(sid,db,'guest')
        db.execute("UPDATE threads SET thread=? WHERE tid=? AND uid=?",(v['txt'],v['tid'],s.UID))
        return text(response,db,s)
    def update_messages():
        s = Session(sid,db,'guest')
        db.execute("UPDATE messages SET message=? WHERE mid=? AND uid=?",(v['txt'],v['mid'],s.UID))
        return text(response,db,s)
    def remove_topics():
        s = Session(sid,db,'guest')
        db.execute("DELETE FROM topics WHERE hid=? AND uid=?",(v['hid'],s.UID))
        return text(response,db,s)
    def remove_threads():
        s = Session(sid,db,'guest')
        db.execute("DELETE FROM threads WHERE tid=? AND uid=?",(v['tid'],s.UID))
        return text(response,db,s)
    def remove_messages():
        s = Session(sid,db,'guest')
        db.execute("DELETE FROM messages WHERE mid=? AND uid=?",(v['mid'],s.UID))
        return text(response,db,s)
    def desc_topics():
        s = Session(sid,db,'guest')
        s.GID=''
        db.execute("SELECT topic FROM topics WHERE hid=?",(v['hid'],))
        return text(response,db,s)
    def find_topics():     
        s = Session(sid,db,'guest')
        s.GID=''
        db.execute("SELECT uid,hid,topic  FROM topics WHERE topic LIKE ?",('%'+v['txt']+'%',))
        return text(response,db,s)
    def find_threads():    
        s = Session(sid,db,'guest')
        s.GID=''
        db.execute("SELECT uid,tid,thread FROM threads WHERE hid=? AND thread LIKE ?",(v['hid'],'%'+v['txt']+'%'))
        return text(response,db,s)
    def find_messages():   
        s = Session(sid,db,'guest')
        s.GID=''
        db.execute("SELECT uid,mid,message,time FROM messages WHERE tid=? AND message LIKE ?",(v['tid'],'%'+v['txt']+'%'))
        return text(response,db,s)
    def find_all():        
        s = Session(sid,db,'guest')
        s.GID=''
        db.execute("SELECT topics.hid,topics.topic,threads.tid,threads.thread,messages.mid,messages.message,messages.time "
                   "FROM topics, threads, messages "
                   "WHERE messages.message LIKE ? "
                   "AND topics.hid=threads.hid "
                   "AND threads.tid=messages.tid "
                   "GROUP BY messages.mid",('%'+v['txt']+'%',))
        return text(response,db,s)

    func = {'insert topics': insert_topics,
            'insert threads': insert_threads,
            'insert messages': insert_messages,
            'update topics': update_topics,
            'update threads': update_threads,
            'update messages': update_messages,
            'remove topics': remove_topics,
            'remove threads': remove_threads,
            'remove messages': remove_messages,
            'desc topics': desc_topics,
            'find topics': find_topics,
            'find threads': find_threads,
            'find messages': find_messages,
            'find all': find_all}

    return func[v['cmd']]()

