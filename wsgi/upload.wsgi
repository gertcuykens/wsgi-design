# Copyright(c) gert.cuykens@gmail.com
from appwsgi.db import Db
from appwsgi.session import Session

def application(environ, response):
    sid = None if not 'HTTP_COOKIE' in environ else environ['HTTP_COOKIE']
    db = Db()
    s =Session(sid,db,'guest')
    if s.GID!='login': db.execute('UPDATE users SET picture=? WHERE uid=?',(environ['wsgi.input'].read(int(environ['CONTENT_LENGTH'])),s.UID))
    j = '{"uid":"'+str(s.UID)+'",\n'
    j+= ' "gid":"'+str(s.GID)+'"}'
    j=j.encode('utf-8')
    response('200 OK', [('Set-Cookie',str(s.SID)), ('Content-Type','text/javascript;charset=utf-8'), ('Content-Length',str(len(j)))])
    return [j]

"""
    from re import search,DOTALL
    chunk=environ['wsgi.input'].read(int(environ['CONTENT_LENGTH'])).decode('latin1')
    b=environ['CONTENT_TYPE'].split('boundary=')[1]   
    chunk=search(b+r'.*?Content-Type: application/octet-stream\r\n\r\n(.*?)\r\n--'+b,chunk,DOTALL).group(1).encode('latin1') 
    from cgi import FieldStorage
    form = FieldStorage(fp=environ['wsgi.input'], environ=environ)
    chunk = form['Filedata'].file.read()
 
    v = environ['wsgi.input'].read(int(environ['CONTENT_LENGTH'])).decode('latin1')
    import sys
    print (v, file=sys.stderr)
    with open('/root/http/appwsgi/www/gert.png','wb') as f:
        f.write(v)
 
def buffer(f, length=-1, size=8192):
    while length<0:
      chunk = f.read(size)
      if not chunk: return
      yield chunk
    x=divmod(length,size)
    for i in range(x[0]): yield f.read(size)
    yield f.read(x[1])

import os

def application(environ, response):
    #q=environ.get['QUERY_STRING']
    q=os.path.join(os.path.dirname(__file__),'teeeeeeeeeemp')
    o=[]
    for r in environ.get('HTTP_CONTENT_RANGE','bytes 0-').replace('bytes ','').split('/')[0].split(','): o.append(r.split('-'))
    with open(q,'r+b') as f:
        if environ['REQUEST_METHOD']=='PUT':
            f.seek(int(o[0][0]))
            f.truncate()
            if not 'HTTP_TRANSFER_ENCODING' in environ:
                for chunk in buffer(environ['wsgi.input'], int(environ['CONTENT_LENGTH'])): f.write(chunk)
            else:
                for chunk in buffer(environ['wsgi.input']): f.write(chunk)
            f.flush()
        l=str(os.fstat(f.fileno()).st_size)
    response('200 OK', [('Content-Type', 'text/plain'), ('Content-Length', str(len(l)))])
    return [l]
"""
