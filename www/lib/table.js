// Copyright(c) gert.cuykens@gmail.com
var table=document.createElement('table')
table.insert=function(v){
 this.deleteTHead()
 var th=this.createTHead().insertRow(-1)
 var tr=this.tBodies[0].insertRow(-1)
 tr.remove=function(){this.parentNode.removeChild(this)}
 tr.clear=function(){for(var k=0;k<this.parentNode.childNodes.length;k++){this.parentNode.childNodes[k].style.backgroundColor='#FFFFFF'}}
 tr.addEventListener('click',function(){this.clear();this.style.backgroundColor='#FFCC80';this.select=this})
 for(var k in v)
 {
  var td=th.insertCell(-1)
  td.innerHTML=k
  td.sort='up'
  td.addEventListener('click',function(){
   this.sort=(this.sort=='up')?'down':'up'
   this.style.backgroundImage='url("../bin/'+this.sort+'.png")'
   var i=Array.prototype.indexOf.call(this.parentNode.childNodes,this)
   var down=function(a,b){
    if(a.childNodes[i].innerHTML>b.childNodes[i].innerHTML)return 1
    else if(a.childNodes[i].innerHTML<b.childNodes[i].innerHTML)return -1
    return 0
   }
   var up=function(a,b){
    if(a.childNodes[i].innerHTML<b.childNodes[i].innerHTML)return 1
    else if(a.childNodes[i].innerHTML>b.childNodes[i].innerHTML)return -1
    return 0
   }
   var e=Array.prototype.slice.call(table.tBodies[0].childNodes)
   if(this.sort=='up')e.sort(up);else e.sort(down)
   for(var i in e)table.tBodies[0].appendChild(e[i])
  })
  td=tr.insertCell(-1)
  td.innerHTML=v[k]
 }
}
table.drop=function(){
 while(this.hasChildNodes())this.removeChild(this.firstChild)
 this.appendChild(document.createElement('thead'))
 this.appendChild(document.createElement('tbody'))
}
//Object.prototype.keys=function(){var keys=[];for(var key in this){keys.push(key)};return keys.shift()}

