// Copyright(c) gert.cuykens@gmail.com
dg=
{

 'remove':function(self,r)
 {
  var c,td,tb
  if(r<self.rec.length-1){self.rec[r]=self.rec.pop()}else{self.rec.pop()}
  dg.init(self)
 },

 'update':function(self,r,v)
 {
  var c,td
  for(c=0;c<v.length;c++)
  {
   td=document.getElementById(self.id+'-row-'+r+'-col-'+c)
   td.innerHTML=v[c]
  }
  self.rec[r]=v
 },

 'insert':function(self,r)
 {
  var tb,tr,td,c,r

  var ontd=function()
  {
   var tr,td,r,c,s
   s=this.id.split('-row-')[1].split('-col-')[0]
   self.selection=self.rec[s]
   for(r=0;r<self.rec.length;r++)
   {
    for(c=0;c<self.des.length;c++)
    {
     td=document.getElementById(self.id+'-row-'+r+'-col-'+c)
     td.style.backgroundColor=""
     if(r==s){td.style.backgroundColor="#FFCC80"}
    }
   }
   self.onselect()
  }

  for(c=0; c<self.des.length; c++){document.getElementById(self.id+'-des-'+c).style.backgroundImage='url()'}
  tb=document.getElementById(self.id)
  tr=tb.insertRow(-1)
  tr.id=self.id+'-row-'+r
  for (c=0; c<self.des.length; c++)
  {
   td=tr.insertCell(-1)
   td.id=self.id+'-row-'+r+'-col-'+c
   if(self.onselect)td.onclick=ontd
   td.innerHTML=self.rec[r][c]
  }
 },

 'select':function(self,r)
 {
  r++
  var tb=document.getElementById(self.id),i,j,c
  var tr=tb.getElementsByTagName('tr')
  i=1
  while(tr[i])
  {
   if(r==i){c='#FFCC80'}else{c='#ffffff'}
   j=0
   while(tr[i].childNodes[j])
   {
    tr[i].childNodes[j].style.backgroundColor=c
    j++
   }
   i++
  }
  if(r>0){self.selection=rec[r]}else{self.selection=[]}
 },

 'init':function(self)
 {
  if(!self.des)return 0;
  var r,c,tb,th,td
  var onhd=function()
  {
   var c,r,a,b,n,td
   n=this.id.split('-des-')[0]
   for (c=0; c<self.des.length; c++){document.getElementById(n+'-des-'+c).style.backgroundImage='url()'}
   if(self.so==this.id)
   {
    self.so=''
    c=this.id.split('-des-')[1]
    self.rec.sort(function(a,b){if (a[c] > b[c]) return -1;if (a[c] < b[c]) return 1;return 0})
    document.getElementById(n+'-des-'+c).style.backgroundImage="url('../bin/up.png')"
   }
   else
   {
    self.so=this.id
    c=this.id.split('-des-')[1]
    self.rec.sort(function(a,b){if (a[c] < b[c]) return -1;if (a[c] > b[c]) return 1;return 0})
    document.getElementById(n+'-des-'+c).style.backgroundImage="url('../bin/down.png')"
   }
   for (r=0; r<self.rec.length; r++) 
   {
    for (c=0; c<self.des.length; c++)
    {
     td=document.getElementById(n+'-row-'+r+'-col-'+c)
     td.innerHTML=self.rec[r][c]
     td.style.backgroundColor=''
    }
   }
  }

  self.so='-1'
  self.selection=[]
  tb=document.getElementById(self.id)
  th=tb.insertRow(-1)
  th.id=self.id+'-des'
  for(c=0;c<self.des.length;c++)
  {
   td=th.insertCell(-1)
   td.id=self.id+'-des-'+c
   td.className='des'
   td.onclick=onhd
   td.appendChild(document.createTextNode(self.des[c]))
  }
  for(r=0;r<self.rec.length;r++){dg.insert(self,r)}
 }

}
