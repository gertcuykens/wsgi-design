// Copyright(c) gert.cuykens@gmail.com
shader=
{
 'sthread':function(obj,s1,s2,s3,s4,s5,s6,s7,s8)
 {
  var l=obj.offsetLeft
  var r=obj.offsetLeft+obj.offsetWidth
  var w=obj.offsetWidth
  var h=obj.offsetHeight
  var t=obj.offsetTop
  var b=obj.offsetTop+obj.offsetHeight
  s1.style.width="32px"
  s2.style.width=w+"px"
  s3.style.width="32px"
  s4.style.width="32px"
  s5.style.width="32px"
  s6.style.width=w+"px"
  s7.style.width="32px"
  s8.style.width="32px"
  s1.style.height="32px"
  s2.style.height="32px"
  s3.style.height="32px"
  s4.style.height=h+"px"
  s5.style.height="32px"
  s6.style.height="32px"
  s7.style.height="32px"
  s8.style.height=h+"px"
  s1.style.left=(l-32)+"px"
  s2.style.left=l+"px"
  s3.style.left=r+"px"
  s4.style.left=r+"px"
  s5.style.left=r+"px"
  s6.style.left=l+"px"
  s7.style.left=(l-32)+"px"
  s8.style.left=(l-32)+"px"
  s1.style.top=(t-32)+"px"
  s2.style.top=(t-32)+"px"
  s3.style.top=(t-32)+"px"
  s4.style.top=t+"px"
  s5.style.top=b+"px"
  s6.style.top=b+"px"
  s7.style.top=b+"px"
  s8.style.top=t+"px"
  s1.style.background="url('../bin/1.png') no-repeat 0px 0px"
  s2.style.background="url('../bin/2.png') repeat-x  0px 0px"
  s3.style.background="url('../bin/3.png') no-repeat 0px 0px"
  s4.style.background="url('../bin/4.png') repeat-y  0px 0px"
  s5.style.background="url('../bin/5.png') no-repeat 0px 0px"
  s6.style.background="url('../bin/6.png') repeat-x  0px 0px"
  s7.style.background="url('../bin/7.png') no-repeat 0px 0px"
  s8.style.background="url('../bin/8.png') repeat-y  0px 0px"
  s1.style.position="absolute"
  s2.style.position="absolute"
  s3.style.position="absolute"
  s4.style.position="absolute"
  s5.style.position="absolute"
  s6.style.position="absolute"
  s7.style.position="absolute"
  s8.style.position="absolute"
 },

 'cthread':function(obj,r,g,b)
 {
  var x=obj.style.color.match(/rgb\((.+?),.+?,.+?\)/)[1]
  var y=obj.style.color.match(/rgb\(.+?,(.+?),.+?\)/)[1]
  var z=obj.style.color.match(/rgb\(.+?,.+?,(.+?)\)/)[1]
  if(x<r){x=x*1+1}else if(x!=r){x=x*1-1}
  if(y<g){y=y*1+1}else if(y!=g){y=y*1-1}
  if(z<b){z=z*1+1}else if(z!=b){z=z*1-1}
  obj.style.color='rgb('+x+','+y+','+z+')'
  if(x!=r || y!=g || z!=b){setTimeout(function(){shader.cthread(obj,r,g,b)},0)}
 },
 
 'othread':function(obj,x)
 {
  o=obj.style.opacity*1
  if (o<x) {o=o+0.005} else if (o>x) {x=o-0.005}
  obj.style.opacity=o
  if (o!=x) {setTimeout(function(){shader.othread(obj,x)},0)}
 },

 'pthread':function(obj,x,y)
 {
  var l=obj.style.left.substr(0,obj.style.left.length-2)*1
  var t=obj.style.top.substring(0,obj.style.top.length-2)*1
  if (l<x) {l=l+1} else if (l>x) {l=l-1}
  if (t<y) {t=t+1} else if (t>y) {t=t-1}
  obj.style.left=l+'px'
  obj.style.top=t+'px'
  if(x!=l || y!=t){setTimeout(function(){shader.pthread(obj,x,y)},0)}
 },

 'mthread':function(obj,x,y)
 {
  var l=obj.style.marginLeft.substr(0,obj.style.marginLeft.length-2)*1
  var r=obj.style.marginRight.substr(0,obj.style.marginRight.length-2)*1
  var t=obj.style.marginTop.substr(0,obj.style.marginTop.length-2)*1
  var b=obj.style.marginBottom.substr(0,obj.style.marginBottom.length-2)*1
  if (l<x) {l=l+1;r=r-1;} else if (l>x) {l=l-1;r=r+1;}
  if (t<y) {t=t+1;b=b-1;} else if (t>y) {t=t-1;b=b+1;}
  obj.style.marginLeft=l+'px'
  obj.style.marginRight=t+'px'
  obj.style.marginTop=l+'px'
  obj.style.marginBottom=t+'px'
  if(x!=l || y!=t){setTimeout(function(){shader.pthread(obj,x,y)},0)}
 }
}
