# Copyright(c) gert.cuykens@gmail.com
import os,sys

class FileWrapper(object):
    def __init__(self, fp, blksize=8192):
        self.fp = fp
        self.blksize=blksize
    def __getitem__(self, key):
        data = self.fp.read(self.blksize)
        if data: return data
        raise IndexError
    def close(self):
        self.fp.close()

def static(url, mime):
    def application(environ, response):
        f=open(url,'rb')
        l=os.fstat(f.fileno()).st_size
        response('200 OK', [('Content-Type', mime+';charset=utf-8'), ('Content-Length', str(l))])
        if 'wsgi.file_wrapper' in environ: return environ['wsgi.file_wrapper'](f, 8192)
        return FileWrapper(f, 8192)
    return application

def wsgi(url):
    import imp
    imp.load_source('mywsgi', url)
    import mywsgi
    return mywsgi.application

def server(environ, response):
    url = environ['PATH_INFO'][1:]
    mime = environ['PATH_INFO'][-3:]
    if   mime=='sgi': app = wsgi(url)
    elif mime=='htm': app = static(url,'text/html')
    elif mime=='css': app = static(url,'text/css')
    elif mime=='.js': app = static(url,'text/javascript')
    elif mime=='png': app = static(url,'image/png')
    elif mime=='ico': app = static('www/favicon.ico','image/x-icon')
    elif mime=='ogg': app = static(url,'audio/ogg')
    elif mime=='ebm': app = static(url,'video/webm')
    else: app = static(url,'text/plain')
    return app(environ, response)

def sql():
    import sqlite3
    v = ''
    with open('db.sql') as f:
        for line in f:
            v += line
    con = sqlite3.connect('db.bin')
    cur = con.cursor()
    cur.executescript(v)

def wbar(*a):
    p=0
    if a[2]>0: p=int(((a[0]*a[1])/a[2])*50)
    if p>50: p=50
    sys.stdout.write("[%s%s]\r"%("#"*p,"."*(50-p)))

w=0
def wget(url):
    import re,urllib.request
    global w
    if w==0:w=len(url)
    with urllib.request.urlopen(url) as f:
        for u in f:
            s=u.decode('latin1')
            m=re.search('<li>.*href="([^\.].*)"',s)
            if m:
                t=url+m.group(1)
                if t[-1]=='/': wget(t)
                else:
                    d=os.path.dirname(t[w:])
                    if d=='': d='./'
                    if not os.path.exists(d): os.makedirs(os.path.dirname(t[w:]))
                    print('GET',t)
                    urllib.request.urlretrieve(t,t[w:],wbar)
                    sys.stdout.write(" %s \r"%(" "*50))

if __name__ == '__main__':
    if int(sys.version.split(' ')[0][0])<3: print('python 3 needed, not',v)
    #if not os.path.exists(''): wget('')
    sql()
    print('GET http://127.0.0.1:8000/www/index.htm')
    from wsgiref.simple_server import make_server
    httpd = make_server('', 8000, server)
    httpd.serve_forever()
