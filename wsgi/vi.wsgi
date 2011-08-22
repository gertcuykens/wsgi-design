# Copyright(c) gert.cuykens@gmail.com
from json import loads
from appwsgi.db import Db
from appwsgi.session import Session
from os import path

def application(environ, response):
    sid = None if not 'HTTP_COOKIE' in environ else environ['HTTP_COOKIE']
    v = loads(environ['wsgi.input'].read(int(environ['CONTENT_LENGTH'])).decode('utf-8'))
    db = Db()
    s = Session(sid,db,'guest')
    j ='{"gid":"login"}'
    if s.GID!='login':
        if v['cmd'] == 'write':
            with open(path.join(path.dirname(__file__),'../www/vi/vi.txt'), 'w') as f: f.write(v['txt'])
        j = '{"txt":"'
        with open(path.join(path.dirname(__file__),'../www/vi/vi.txt'), 'r') as f: j+=f.read()
        j += '"}'
    j=j.encode('utf-8')
    response('200 OK', [('Set-Cookie',str(s.SID)), ('Content-Type','text/javascript;charset=utf-8'), ('Content-Length',str(len(j)))])
    return [j]

