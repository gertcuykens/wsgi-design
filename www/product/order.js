// Copyright(c) gert.cuykens@gmail.com
session.load2=function(){}
session.load=function()
{
 session.load2()
 session.load2=function(){}
 try{order.oid=unescape(document.URL.match(/\?(.*)/)[1])}catch(e){}
 http.fml =function(v)
 {
  if(v.gid=='login'){login();return 0}
  cart.des=['pid','txt','price','qty'],
  cart.rec=v['rec']
  document.getElementById('scan').innerHTML=''
  document.getElementById('scan').innerHTML=barcode.draw(order.oid)
  document.getElementById('cart').innerHTML='<caption id="menu"></caption>'
  if(order.oid=='new'){gui('i')}else{cart.onselect=null;document.getElementById('menu').innerHTML='CREDITS '+cart.total()+' '}
  dg.init(cart)
 }
 http.xml ='{"cmd":"order",\n'
 http.xml+=' "oid":"'+order.oid+'"}'
 http.url ='../../wsgi/order.wsgi'
 http.send()
}

cart=
{
 'id':'cart',
 'rec':[],
 'des':['pid','txt','price','qty'],
 'onselect':function(){dg.select(products,-1);gui('c')},
 'total':function(){var r,t=0;for(r in cart.rec){t+=(cart.rec[r][2]*cart.rec[r][3])}return t}
}

products=
{
 'id':'products',
 'des':['pid','txt','price','qty'],
 'rec':[],
 'onselect':function(){dg.select(cart,-1);gui('p')}
}

order=
{
 'oid':'new',
 'qty':function(v,q)
 {
  session.load2=function()
  {
   http.fml =function(v)
   {
    if(v.gid=='login'){login();return 0}
    session.load()
    gui('i')
   }
   http.xml ='{"cmd":"insert",\n'
   http.xml+=' "pid":'+v+',\n'
   http.xml+=' "qty":'+q+'}'
   http.url ='../../wsgi/order.wsgi'
   http.send()
  }
  session.load2()
 }
}

gui=function(m)
{
 var f2=document.createElement('input')
 f2.id='f2'
 f2.onfocus=function(){this.value=''}

 var f3=document.createElement('input')
 f3.id='f3'
 f3.type='button'
 f3.value='find'
 f3.onclick=function()
 {
  session.load2=function()
  {
   http.fml =function(v)
   {
    if(v.gid=='login'){login();return 0}
    document.getElementById('products').innerHTML=''
    products.rec=v['rec']
    dg.init(products)
   }
   http.xml ='{"cmd":"find",\n'
   http.xml+=' "txt":"'+document.getElementById('f2').value+'"}'
   http.url ='../../wsgi/order.wsgi'
   http.send()
   document.getElementById('f2').focus()
  }
  session.load2()
 }

 var f4=document.createElement('input')
 f4.id='f4'
 f4.type='button'
 f4.value='pay'
 f4.onclick=function()
 {
  session.load2=function()
  {
   http.fml =function(v)
   {
    if(v.gid=='login'){login();return 0}
    document.getElementById('products').innerHTML=''
    order.oid=v['uid']
    session.load()
   }
   http.xml ='{"cmd":"pay"}'
   http.url ='../../wsgi/order.wsgi'
   http.send()
   document.getElementById('f2').focus()
  }
  session.load2()
 }

 var qty=document.createElement('input')
 qty.id='qty'
 qty.onkeydown=function(){this.value='';this.onkeydown='';}

 var yes=document.createElement('input')
 yes.id='yes'
 yes.type='button'
 yes.value='yes'

 var no=document.createElement('input')
 no.id='no'
 no.type='button'
 no.value='no'
 no.onclick=function(){gui('i')}

 var view=document.createElement('input')
 view.id='view'
 view.type='button'
 view.value='view'

 var logout=document.createElement('input')
 logout.id='logout'
 logout.type='button'
 logout.value='logout'
 logout.onclick=function()
 {
  document.getElementById('scan').innerHTML=''
  document.getElementById('cart').innerHTML=''
  document.getElementById('products').innerHTML=''
  session.load2=function(){}
  session.logout()
 }

 var menu=document.getElementById('menu')
 menu.id='menu'
 menu.innerHTML=''

 switch(m)
 {
  case 'p':
   qty.value=1
   yes.onclick=function(){order.qty(products.selection[0],document.getElementById('qty').value)}
   menu.appendChild(document.createTextNode('qty'))
   menu.appendChild(qty)
   menu.appendChild(yes)
   menu.appendChild(no)
   menu.appendChild(view)
   menu.appendChild(logout)
   view.onclick=function(){document.location='../product/'+products.selection[0]+'.htm'}
   document.getElementById('qty').focus()
  break;
  case 'c':
   qty.value=0
   yes.onclick=function(){order.qty(cart.selection[0],document.getElementById('qty').value)}
   menu.appendChild(document.createTextNode('qty'))
   menu.appendChild(qty)
   menu.appendChild(yes)
   menu.appendChild(no)
   menu.appendChild(view)
   menu.appendChild(logout)
   view.onclick=function(){document.location='../product/'+cart.selection[0]+'.htm'}
   document.getElementById('qty').focus()
  break;
  case 'i':
   menu.appendChild(f2)
   menu.appendChild(f3)
   f4.value='pay '+cart.total()+'\u20ac'
   menu.appendChild(f4)
   menu.appendChild(logout)
   document.getElementById('f2').focus()
  break;
 }
}
