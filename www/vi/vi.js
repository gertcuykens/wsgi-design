// Copyright(c) gert.cuykens@gmail.com
window.addEventListener('resize',function(){document.getElementsByTagName('textarea')[0].style.height=document.body.clientHeight-30+'px'},false)
session.load=function(){document.getElementsByTagName('textarea')[0].value=''
                        var e=document.createEvent('HTMLEvents');e.initEvent('resize', true, true)
                        window.dispatchEvent(e)
                        vi.read()}
vi=
{
 'read':function()
 {
  var p='vi.txt'; try{p=document.URL.match(/\?(.*)/)[1]}catch(e){}
  http.fml =function(v){if(v.gid=='login'){login()}else{document.getElementById('text').value=v.txt}}
  http.xml ='{"cmd":"read",\n'
  http.xml+=' "gid":"admin",\n'
  http.xml+=' "path":"'+p+'"}'
  http.url ='../../wsgi/vi.wsgi'
  http.send()
 },
 'write':function()
 {
  var p='vi.txt'; try{p=document.URL.match(/\?(.*)/)[1]}catch(e){}
  http.fml =function(v){if(v.gid=='login'){login()}else{document.getElementById('text').value=v.txt}}
  http.xml ='{"cmd":"write",\n'
  http.xml+=' "gid":"admin",\n'
  http.xml+=' "path":"'+p+'",\n'
  http.xml+=' "txt":"'+document.getElementById('text').value+'"}'
  http.url ='../../wsgi/vi.wsgi'
  http.send()
 }
}
