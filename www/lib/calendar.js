// Copyright(c) gert.cuykens@gmail.com
Date.prototype.daysInMonth = function(){return new Date(this.getFullYear(),this.getMonth()+1,0).getDate()},
Date.prototype.startOfMonth = function(){return new Date(this.getFullYear(),this.getMonth(),1).getDay()-1},
Date.prototype.getWeek = function(){var j = new Date(this.getFullYear(),0,1);return Math.ceil((((this - j)/86400000)+j.getDay()+1)/7);}
Date.prototype.sql = function()
{
 var y=this.getFullYear()
 var m=this.getMonth()+1
 if(m<10)m='0'+m
 var d=this.getDate(); 
 if(d<10)d='0'+d
 var h=this.getHours(); 
 if(h<10)h='0'+h
 var n=this.getMinutes(); 
 if(n<10)n='0'+n
 var s=this.getSeconds(); 
 if(s<10)s='0'+s
 var i=this.getMilliseconds()
 return y+"-"+m+"-"+d+" "+h+":"+n+":"+s+"."+i
}
Date.prototype.createTbody = function(t)
{
 t.innerHTML=''
 var now = new Date()
 var d = this
 var s = d.startOfMonth()
 var row = t.insertRow(-1)
 for(var n=0;n<s;n++){var cell=row.insertCell(-1);cell.innerHTML='';}
 d = d.daysInMonth()
 for(var n=1;n<d+1;n++)
 {
  if(s%7==0){var row=t.insertRow(-1)}
  var cell = row.insertCell(-1);
  if(this.getFullYear()  == now.getFullYear() &&
     this.getMonth() == now.getMonth()  &&
     n == now.getDate()){cell.className='now'}
  if(n<10)n='0'+n
  cell.id = n
  var text=document.createTextNode(n)
  var span=document.createElement('span')
  span.appendChild(text)
  cell.appendChild(span)
  s++
 }
 while(s%7!=0){row.insertCell(-1);s++}
}

