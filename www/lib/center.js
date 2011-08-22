// Copyright(c) gert.cuykens@gmail.com
center=
{
 'obj':function(obj)
 {
  if(!obj.offsetWidth)return 0
  var ww=obj.parentNode.offsetWidth
  var hh=obj.parentNode.offsetHeight
  var w= obj.offsetWidth
  var h= obj.offsetHeight
  obj.style.top = (hh/2) - (h/2) + 'px'
  obj.style.left = (ww/2) - (w/2) + 'px'
 }
}

