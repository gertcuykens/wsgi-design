# Copyright(c) gert.cuykens@gmail.com
from json import loads, dumps
from appwsgi.db import Db

def application(environ, response):
    v = loads(environ['wsgi.input'].read(int(environ['CONTENT_LENGTH'])).decode('utf-8'))
    db = Db()
    db.execute(v['sql'])
    j = '{"sql":"'+v['sql']+'",\n'
    j+= ' "rec":'+db.json()+',\n'
    j+= ' "des":'+db.jdes()+'}'
    if db.ERROR: j='{"error":'+dumps(db.ERROR)+'}'
    j=j.encode('utf-8')
    response('200 OK', [('Content-Type', 'text/javascript;charset=utf-8'), ('Content-Length', str(len(j)))])
    return [j]

