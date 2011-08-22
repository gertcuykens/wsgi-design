// Copyright(c) gert.cuykens@gmail.com
session.load=function(){document.getElementById('session').style.background='url(../../wsgi/download.wsgi?'+session.sid+Math.random()+') no-repeat'}
forum=
{
 'page':'topics',
 'nr':'new',
 'topic':'-1',
 'thread':'-1',
 'message':'-1',
 'desc':function(i)
 {
  http.fml =function(v){document.getElementById('topics').innerHTML='topic: '+v['rec'][0][0]}
  http.xml ='{"cmd":"desc topics",\n'
  http.xml+=' "hid":"'+i+'"}'
  http.url ='../../wsgi/forum.wsgi'
  http.send()
 },

 'find':function(v)
 {
  data=''
  if(v)forum.page=v
  http.fml=function(v)
  {
   var c
   if(c=document.getElementById('data'))while(c.lastChild)c.removeChild(c.lastChild)
   switch(forum.page)
   {
    case'topics':
     document.getElementById('topics').innerHTML='topics'
     document.getElementById('threads').innerHTML='threads'
     document.getElementById('messages').innerHTML='messages'
    break;
    case'threads':
     forum.desc(forum.topic)
     document.getElementById('threads').innerHTML='threads'
     document.getElementById('messages').innerHTML='messages'
    break;
    case'messages':
     document.getElementById('messages').innerHTML='messages'
    break;
   }
   data=
   {
    'id':'data',
    'rec':v['rec'],
    'des':v['des'],
    'onselect':function()
    {
     forum.nr=data.selection[1]
     document.getElementById('text').value=data.selection[2]
     document.getElementById(forum.page).innerHTML=forum.page.substring(0,forum.page.length-1)+': '+data.selection[2]
     switch(forum.page)
     {
      case'topics':
       forum.topic=data.selection[1]
       forum.thread='-1'
       forum.message='-1'
      break;
      case'threads':
       forum.thread=data.selection[1]
       forum.message='-1'
      break;
      case'messages':
       forum.message=data.selection[1]
      break;
     }
    }
   }
   dg.init(data)
  }
  http.xml ='{"cmd":"find '+forum.page+'",\n'
  http.xml+=' "hid":"'+forum.topic+'",\n'
  http.xml+=' "tid":"'+forum.thread+'",\n'
  http.xml+=' "txt":"'+document.getElementById('text').value+'"}'
  http.url ='../../wsgi/forum.wsgi'
  http.send()
 },
 
 'save':function()
 {
  var cmd
  if(forum.nr=='new'){cmd='insert'}else{cmd='update'}
  http.fml=function(v)
  {
   if(c=document.getElementById('data'))while(c.lastChild)c.removeChild(c.lastChild)
   forum.nr='new'
   forum.find()
  }
  http.xml ='{"cmd":"'+cmd+' '+forum.page+'",\n'
  http.xml+=' "hid":"'+forum.topic+'",\n'
  http.xml+=' "tid":"'+forum.thread+'",\n'
  http.xml+=' "mid":"'+forum.message+'",\n'
  http.xml+=' "txt":"'+document.getElementById('text').value+'"}'
  http.url ='../../wsgi/forum.wsgi'
  http.send()
 },

 'remove':function()
 {
  http.fml=function(v)
  {
   var c
   if(c=document.getElementById('data'))while(c.lastChild)c.removeChild(c.lastChild)
   forum.nr='new'
   document.getElementById('text').value=''
   document.getElementById(forum.page).value=forum.page
   forum.find()
  }
  http.xml ='{"cmd":"remove '+forum.page+'",\n'
  http.xml+=' "hid":"'+forum.topic+'",\n'
  http.xml+=' "tid":"'+forum.thread+'",\n'
  http.xml+=' "mid":"'+forum.message+'"}'
  http.url ='../../wsgi/forum.wsgi'
  if(forum.nr!='new'){http.send()}
 },

 'findAll':function()
 {
  http.fml=function(v)
  {
   forum.page='messages'
   var c=document.getElementById('data')
   if(c)while(c.lastChild)c.removeChild(c.lastChild)
   data=
   {
    'id':'data',
    'rec':v['rec'],
    'des':v['des'],
    'onselect':function()
    {
     forum.topic=data.selection[0]
     document.getElementById('topics').innerHTML='topic: '+data.selection[1]
     forum.thread=data.selection[2]
     document.getElementById('threads').innerHTML='thread: '+data.selection[3]
     forum.message=data.selection[4]
     document.getElementById('messages').innerHTML='message: '+data.selection[5]
     forum.nr=data.selection[4]
     document.getElementById('text').value=data.selection[5]
    }
   }
   dg.init(data)
  }
  http.xml ='{"cmd":"find all",\n'
  http.xml+=' "txt":"'+document.getElementById('text').value+'"}'
  http.url ='../../wsgi/forum.wsgi'
  http.send()
 }
}
