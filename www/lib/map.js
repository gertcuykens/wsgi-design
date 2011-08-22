// Copyright(c) gert.cuykens@gmail.com
map=
{

 'close':function(obj)
 {
  obj.parentNode.getElementsByTagName('ul')[0].style.display='none'
  obj.parentNode.style.listStyleType='disc'
  obj.onclick=function(){map.open(obj)}
 },

 'open':function(obj)
 {
  obj.parentNode.getElementsByTagName('ul')[0].style.display=''
  obj.parentNode.style.listStyleType='circle'
  obj.onclick=function(){map.close(obj)}
 },

 'search':function(v){document.location='http://www.google.com/search?sitesearch=www.w3schools.com&as_q='+v}

}

