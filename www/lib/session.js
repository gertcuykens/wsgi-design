// Copyright(c) gert.cuykens@gmail.com
session=
{
 'load':function(){},
 'login':function()
 {
  http.fml=function(v){if(v.gid=='login'){if(confirm('Access denied, mail password?')){session.mailpwd()}return 0}
                       document.getElementById('login').parentNode.removeChild(document.getElementById('login'))
                       session.load()}
  http.xml ='{"cmd":"login",\n'
  http.xml+=' "uid":"'+document.getElementById('uid').value+'",\n'
  http.xml+=' "pwd":"'+sha1.msg(document.getElementById('pwd').value)+'"}'
  http.url ='../../wsgi/user.wsgi'
  http.req='POST'
  if(document.getElementById('uid').value)http.send()
 },

 'logout':function()
 {
  http.fml =function(v){session.load()}
  http.xml ='{"cmd":"logout"}'
  http.url ='../../wsgi/user.wsgi'
  http.req='POST'
  http.send()
 },

 'mailpwd':function()
 {
  http.fml =function(v){}
  http.xml ='{"cmd":"mailpwd",\n'
  http.xml+=' "uid":"'+document.getElementById('uid').value+'"}'
  http.url ='../../wsgi/user.wsgi'
  http.req='POST'
  http.send()
 }
}
