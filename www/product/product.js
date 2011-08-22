// Copyright(c) gert.cuykens@gmail.com
product=
{
 'select':function()
 {
  http.fml=function(v)
  {
   document.getElementById('products').innerHTML=''
   products=
   {
    'id':'products',
    'rec':v.rec,
    'des':v.des,
    'onselect':function()
    {
     document.getElementById('pid').value=products.selection[0]
     document.getElementById('txt').value=products.selection[1]
     document.getElementById('price').value=products.selection[2]
     document.getElementById('qty').value=products.selection[3]
    }
   }
   dg.init(products)
  }
  http.xml ='{"cmd":"select",\n'
  http.xml+=' "pid":"'+document.getElementById('pid').value+'",\n'
  http.xml+=' "txt":"'+document.getElementById('txt').value+'",\n'
  http.xml+=' "price":"'+document.getElementById('price').value+'",\n'
  http.xml+=' "qty":"'+document.getElementById('qty').value+'"}'
  http.url ='../../wsgi/product.wsgi'
  http.send()
 },
 
 'update':function()
 {
  http.fml=function(v){product.select()}
  http.xml ='{"cmd":"update",\n'
  http.xml+=' "pid":"'+document.getElementById('pid').value+'",\n'
  http.xml+=' "txt":"'+document.getElementById('txt').value+'",\n'
  http.xml+=' "price":"'+document.getElementById('price').value+'",\n'
  http.xml+=' "qty":"'+document.getElementById('qty').value+'"}'
  http.url ='../../wsgi/product.wsgi'
  http.send()
 },

 'remove':function()
 {
  http.fml=function(v)
  {
   document.getElementById('products').innerHTML=''
   document.getElementById('pid').value=''
   document.getElementById('txt').value=''
   document.getElementById('price').value=''
   document.getElementById('qty').value=''
  }
  http.xml ='{"cmd":"delete",\n'
  http.xml+=' "pid":"'+document.getElementById('pid').value+'"}'
  http.url ='../../wsgi/product.wsgi'
  http.send()
 },

 'insert':function()
 {
  http.fml=function(v){product.select()}
  http.xml ='{"cmd":"insert",\n'
  http.xml+=' "pid":"'+document.getElementById('pid').value+'",\n'
  http.xml+=' "txt":"'+document.getElementById('txt').value+'",\n'
  http.xml+=' "price":"'+document.getElementById('price').value+'",\n'
  http.xml+=' "qty":"'+document.getElementById('qty').value+'"}'
  http.url ='../../wsgi/product.wsgi'
  http.send()
 }
}
