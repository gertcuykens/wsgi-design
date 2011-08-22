import mod_wsgi
import json

def application(environ, response):
    output = json.dumps(mod_wsgi.usage_statistics())
    response('200 OK', [('Content-type', 'text/javascript'),('Content-Length', str(len(output)))])
    return [output]

