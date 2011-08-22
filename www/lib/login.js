// Copyright(c) gert.cuykens@gmail.com
login=function()
{
 var l=document.createElement('div')
 l.id='login'
 l.style.display='block'
 l.innerHTML='\
<style>\
 #login {position:absolute;\
         top:0px;left:0px;\
         width:250px;height:75px;\
         text-align:right;\
         margin:0px;padding:0px;}\
 #shadow {position:fixed;\
          left:0px;top:0px;\
          width:100%;height:100%;\
          background-color:#000000;\
          opacity:0.5;}\
 #main {position:absolute;\
        background-color:#b0b0b0;}\
 #main>input {width:142px;\
              margin:2px;}\
</style>\
<div id="shadow"></div>\
<div id="main">\
 <div id="s1"></div>\
 <div id="s2"></div>\
 <div id="s3"></div>\
 <div id="s4"></div>\
 <div id="s5"></div>\
 <div id="s6"></div>\
 <div id="s7"></div>\
 <div id="s8"></div>\
 email:    <input id="uid"  type="text"     value=""/><br/>\
 password: <input id="pwd"  type="password" value=""/><br/>\
 <input id="sid" type="button" value="login" onclick="session.login()"/>\
</div>'
 document.body.appendChild(l)
 var s1=document.getElementById('s1')
 var s2=document.getElementById('s2')
 var s3=document.getElementById('s3')
 var s4=document.getElementById('s4')
 var s5=document.getElementById('s5')
 var s6=document.getElementById('s6')
 var s7=document.getElementById('s7')
 var s8=document.getElementById('s8')
 var main=document.getElementById('main')
 shader.sthread(main,s1,s2,s3,s4,s5,s6,s7,s8)
 center.obj(l)
 window.addEventListener('resize',function(e){center.obj(l)},false)
}

