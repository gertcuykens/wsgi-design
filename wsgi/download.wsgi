# Copyright(c) gert.cuykens@gmail.com
from appwsgi.db import Db
from appwsgi.session import Session

def application(environ, response):
    sid = None if not 'HTTP_COOKIE' in environ else environ['HTTP_COOKIE']
    db = Db()
    s = Session(sid,db,'guest')
    try:
        db.execute('SELECT picture, length(picture) FROM users WHERE uid=?',(s.UID,))
        fp=db.fetch()
        f=fp[0][0]
        l=fp[0][1]
        if not f: raise Exception
    except:
        with open('appwsgi/www/bin/picture.png','rb') as fp: f=fp.read()
        l=len(f)
    response('200 OK', [('Set-Cookie',str(s.SID)), ('Content-type','image/png'), ('Content-Length',str(l))])
    return [f]

"""
class FileWrapper(object):
    def __init__(self, fp, blksize=8192):
        self.fp=fp
        self.blksize=blksize
    def __getitem__(self, key):
        data = self.fp.read(self.blksize)
        if data: return data
        raise IndexError
    def __del__(self):
        self.fp.close()

class SqlWrapper(object):
    def __init__(self, db, blksize=8192):
        self.db=db
        self.blksize=blksize
    def __getitem__(self, key):
        data = self.db.fetch(self.blksize)
        if data: return data
        raise IndexError
    def close(self):
        self.db.close()

import sys
print(l,file=sys.stderr)

if 'wsgi.file_wrapper' in environ: return environ['wsgi.file_wrapper'](f, 8192)

def application(environ, response):
    #query=environ.get['QUERY_STRING']
    #print (query, file=environ['wsgi.errors'])
    query=os.path.join(os.path.dirname(__file__),'download2.wsgi')
    range=environ.get('HTTP_RANGE','bytes=0-').replace('bytes=','').split(',')
    offset=[]
    for r in range: offset.append(r.split('-'))
    f=open(query, 'rb')
    f.seek(int(offset[0][0]))
    lengthF=os.fstat(f.fileno()).st_size
    lengthC=str(lengthF-int(offset[0][0]))
    bitS=int(offset[0][0])
    bitE=lengthF-1
    bytes='bytes '+str(bitS)+'-'+str(bitE)+'/'+str(lengthF)
    response('200 OK', [('Content-Type', 'text/plain'), ('Content-Length', lengthC), ('Content-Range', bytes)])
    if 'wsgi.file_wrapper' in environ: return environ['wsgi.file_wrapper'](f, 8192)
    else: return FileWrapper(f, 8192)
"""
