// Copyright(c) gert.cuykens@gmail.com
user=
{
 'clear':function()
 {
  document.getElementById('email').value=''
  document.getElementById('name').value=''
  document.getElementById('adress').value=''
  document.getElementById('city').value=''
  document.getElementById('country').value=''
  document.getElementById('phone').value=''
  document.getElementById('box').src='../../wsgi/download.wsgi'
  session.logout()
 },

 'select':function(cmd)
 {
  http.fml=function(v)
  {
   if(v.gid=='login'){login();return 0}
   document.getElementById('email').value=v['rec'][0][0]
   document.getElementById('name').value=v['rec'][0][1]
   document.getElementById('adress').value=v['rec'][0][2]
   document.getElementById('city').value=v['rec'][0][3]
   document.getElementById('country').value=v['rec'][0][4]
   document.getElementById('phone').value=v['rec'][0][5]
   document.getElementById('box').src='../../wsgi/download.wsgi?'+Math.random()
  }
  http.xml ='{"cmd":"select"}'
  http.url ='../../wsgi/user.wsgi'
  http.send()
 },

 'update':function()
 {
  http.fml =function(v){}
  http.xml ='{"cmd":"update",\n'
  http.xml+=' "name":"'+document.getElementById('name').value+'",\n'
  http.xml+=' "adress":"'+document.getElementById('adress').value+'",\n'
  http.xml+=' "city":"'+document.getElementById('city').value+'",\n'
  http.xml+=' "country":"'+document.getElementById('country').value+'",\n'
  http.xml+=' "phone":"'+document.getElementById('phone').value+'"}\n'
  http.url ='../../wsgi/user.wsgi'
  http.send()
 },

 'del':function()
 {
  http.fml=function(v){user.clear()}
  http.xml ='{"cmd":"delete"}'
  http.url ='../../wsgi/user.wsgi'
  http.send()
 },

 'passwd':function()
 {
  var pwd=prompt('Please enter password')
  if (pwd==''||pwd==null) return 0
  http.fml =function(v){}
  http.xml ='{"cmd":"passwd",\n'
  http.xml+=' "pwd":"'+sha1.msg(pwd)+'"}'
  http.url ='../../wsgi/user.wsgi'
  http.send()
 },

 'email':function()
 {
  var email=prompt('Please enter new email')
  if (email==''||email==null) return 0
  http.fml=function(v){document.getElementById('email').value=v['rec'][0][0]}
  http.xml ='{"cmd":"email",\n'
  http.xml+=' "uid":"'+email+'"}'
  http.url ='../../wsgi/user.wsgi'
  http.send()
 }
}

