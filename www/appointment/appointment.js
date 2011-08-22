// Copyright(c) gert.cuykens@gmail.com
appointment=
{
 'cmd':function()
 {
  var now=new Date()
  document.getElementById('year').innerHTML=calendar.getFullYear()
  if(calendar.getFullYear()==now.getFullYear())document.getElementById('year').className='now'
  document.getElementById('month').innerHTML=calendar.getMonth()+1
  if(calendar.getMonth()==now.getMonth())document.getElementById('month').className='now'
 },

 'overview':function()
 {
  calendar.createTbody(document.getElementById('appointments'))
  var a=function()
  {
   calendar.setDate(this.parentNode.id)
   var t=prompt('add');if(t==null||t=='')return 0
   appointment.insert(t)
  }
  for(i in document.getElementById('appointments').getElementsByTagName('td'))
  {
   var t=document.getElementById('appointments').getElementsByTagName('td')[i]
   if(t.id)t.childNodes[0].addEventListener('click',a,false)
  }
  var y=calendar.getFullYear()
  var m=calendar.getMonth()+1
  var n=m+1
  if(n>12)y=y+1
  if(n>12)n=1
  if(n<10)n='0'+n
  if(m<10)m='0'+m
  http.fml=function(v)
  {
   for (var i=0;i<v['rec'].length;i++)
   {
    var t=v['rec'][i][1].match(/-([^-]*?) /)[1]
    var text=document.createTextNode(v['rec'][i][2])
    var p=document.createElement('p')
    p.id=v['rec'][i][0]
    p.className='appointment'
    p.onclick=function(){if(confirm("remove "+this.id))appointment.remove(this.id)}
    p.appendChild(text)
    document.getElementById(t).appendChild(p)
   }
  }
  http.xml ='{"cmd":"overview",\n'
  http.xml+=' "from":"'+calendar.getFullYear()+'-'+m+'-01 00:00:00.000",\n'
  http.xml+=' "to":"'+y+'-'+n+'-01 00:00:00.000"}\n'
  http.url ='../../wsgi/appointment.wsgi'
  http.send()
 },

 'insert':function(i)
 {
  http.fml=function(v){if(v.gid=='login'){login()}else{session.load=function(){};appointment.overview()}}
  http.xml ='{"cmd":"insert",\n'
  http.xml+=' "calendar":"'+calendar.sql()+'",\n'
  http.xml+=' "appointment":"'+i+'"}'
  http.url ='../../wsgi/appointment.wsgi'
  http.send()
  session.load=function(){appointment.insert(i)}
 },

 'remove':function(i)
 {
  http.fml=function(v){if(v.gid=='login'){login()}else{session.load=function(){};appointment.overview()}}
  http.xml ='{"cmd":"remove",\n'
  http.xml+=' "aid":"'+i+'"}'
  http.url ='../../wsgi/appointment.wsgi'
  http.send()
  session.load=function(){appointment.remove(i)}
 }
}

/*

 'select':function()
 {
  http.fml=function(v)
  {
   if(v['gid']=='login') return 0
   document.getElementById('data').innerHTML=''
   document.getElementById('data').style.display='table'
   document.getElementById('appointments').style.display='none'
   data=
   {
    'id':'data',
    'rec':v['rec'],
    'des':v['des'],
    'onselect':function(){if(confirm("remove "+data.selection[0]))appointment.remove(data.selection[0])}
   }
   dg.init(data)
   var e = document.createEvent('HTMLEvents')
   e.initEvent('resize')
   window.dispatchEvent(e)
  }
  http.xml ='{"cmd":"find",\n'
  http.xml+=' "sid":"'+session.sid+'",\n'
  http.xml+=' "calendar":"'+calendar.sql()+'",\n'
  http.xml+=' "appointment":""}'
  http.url ='../../wsgi/appointment.wsgi'
  http.send()
 },

 'name':function()
 {
  http.fml=function(v)
  {
   document.getElementById('appointments').innerHTML=''
   appointments=
   {
    'id':'appointments',
    'rec':v['rec'],
    'des':v['des'],
    'onselect':function()
    {
     document.getElementById('nid').value=appointments.selection[0]
     http.fml=function(v)
     {
      document.getElementById('appointments').innerHTML=''
      appointments=
      {
       'id':'appointments',
       'rec':v['rec'],
       'des':v['des'],
       'onselect':function()
       {
        document.getElementById('nid').value=appointments.selection[1]
        document.getElementById('aid').value=appointments.selection[3]
        calendar.set(appointments.selection[4])
        document.getElementById('appointment').value=appointments.selection[5]
        calendar.display()
       }
      }
      dg.init(appointments)
     }
     http.xml ='{"cmd":"ca",\n'
     http.xml+=' "sid":"'+session.sid+'",\n'
     http.xml+=' "gid":"'+document.getElementById('view').innerHTML+'",\n'
     http.xml+=' "uid":"'+document.getElementById('nid').value+'",\n'
     http.xml+=' "calendar":"'+calendar.get()+'",\n'
     http.xml+=' "appointment":"'+document.getElementById('appointment').value+'"}'
     http.url ='../../wsgi/appointment.wsgi'
     http.send()
    }
   }
   dg.init(appointments)
  }
  http.xml ='{"cmd":"name",\n'
  http.xml+=' "sid":"'+session.sid+'",\n'
  http.xml+=' "gid":"'+document.getElementById('view').innerHTML+'",\n'
  http.xml+=' "name":"'+document.getElementById('appointment').value+'"}'
  http.url ='../../wsgi/appointment.wsgi'
  http.send()
 },

*/

/*
  for(var b in window){if(window.hasOwnProperty(b))console.log(b);}
  'isLeapYear':function(y){return(y%400==0||(y%4==0&&y%100!=0))?true:false},

 'monthArray': ['January','February','March','April','May','June','July','August','September','October','November','December'],
 'createThead':function()
 {
  var thead = document.createElement('thead')
  var tr = document.createElement('tr')
  var th = document.createElement('th')
  tr.appendChild(th)
  thead.appendChild(tr)
  var span = document.createElement('span')
  span.id = 'calendar_year_txt'
  //span.onclick = calendar.showDropDown(0)
  span.innerHTML = calendar.date.getFullYear()
  th.appendChild(span)
  var span = document.createElement('span')
  span.id = 'calendar_month_txt'
  //span.onclick = calendar.showDropDown(1)
  span.innerHTML = calendar.monthArray[calendar.date.getMonth()]
  th.appendChild(span)
  th.colSpan=7
  return thead
 },
 tb.insertBefore(calendar.createThead(), tb.firstChild)
 document.getElementById('calendar_year_txt').innerHTML = calendar.date.getFullYear();
 document.getElementById('calendar_month_txt').innerHTML = calendar.monthArray[calendar.date.getMonth()]

 'showDropDown':function(s)
 {
  var d=['yearDropDown','monthDropDown','hourDropDown','minuteDropDown'],i
  i=0;while(d[i]){document.getElementById(d[i]).style.display='none';i++}
  document.getElementById(d[s]).style.display=='block'
 },

 'selectDropDown':function(obj)
 {
  if(obj.parentNode.id=='yearDropDown')document.getElementById('calendar_year_txt').innerHTML=obj.innerHTML
  if(obj.parentNode.id=='monthDropDown')document.getElementById('calendar_month_txt').innerHTML=obj.innerHTML
  if(obj.parentNode.id=='hourDropDown')document.getElementById('calendar_hour_txt').innerHTML=obj.innerHTML
  if(obj.parentNode.id=='minuteDropDown')document.getElementById('calendar_minute__txt').innerHTML=obj.innerHTML
  //calendar[i] = e.innerHTML.replace(/[^\d]/g,'');
  calendar.display()
 },

 'slideDropDown':function(obj)
 {
  if(obj.parentNode.id=='yearDropDown') calendar.changeSelectBoxYear(obj);
  if(obj.parentNode.id=='hourDropDown') calendar.changeSelectBoxHour(obj);
  calendar.thread=setTimeout(function(){calendar.slideDropDown(obj)},100);
 },

 'changeSelectBoxYear':function(inputObj)
 {
  var yearItems = document.getElementById('yearDropDown').getElementsByTagName('div');
  if     (inputObj.innerHTML.indexOf('-')>=0){var startYear = yearItems[1].innerHTML/1 -1;}
  else if(inputObj.innerHTML.indexOf('+')>=0){var startYear = yearItems[1].innerHTML/1 +1;}
  else                                        var startYear = yearItems[1].innerHTML/1;
  for(var no=1;no<yearItems.length-1;no++)
  {
   yearItems[no].innerHTML = startYear+no-1;
   yearItems[no].id = 'yearDiv' + (startYear/1+no/1-1);
   if ( (startYear/1+no/1-1) == calendar.year )
   {
    yearItems[no].style.color='red'
    calendar.activeSelectBoxYear=yearItems[no]
   }
   else yearItems[no].style.color=''
  }
 },

 'changeSelectBoxMonth':function()
 {
  for(var no=0;no<calendar.monthArray.length;no++)
  {
   var n
   if(no<10){n='0'+no}else{n=no}
   var subDiv=document.getElementById('monthDiv'+n)
   subDiv.style.color = ''
   if(calendar.month==no)
   {
    subDiv.style.color = calendar.selectBoxHighlightColor
    calendar.activeSelectBoxMonth = subDiv
   }
  }
 },

 'changeSelectBoxHour':function(inputObj)
 {
	var hourItems = inputObj.parentNode.getElementsByTagName('div');
	if(inputObj.innerHTML.indexOf('-')>=0)
    {
		var startHour = hourItems[1].innerHTML/1 -1;
		if(startHour<0) startHour=0;
	}
    else
    {
		var startHour = hourItems[1].innerHTML/1 +1;
		if(startHour>14)startHour = 14;
	}

	var prefix = '';
	for(var no=1;no<hourItems.length-1;no++)
    {
		if((startHour/1 + no/1) < 11) prefix = '0';
        else prefix = '';
		hourItems[no].innerHTML = prefix + (startHour+no-1);
		hourItems[no].id = 'hourDiv' +prefix+(startHour/1+no/1-1);
        if ( (prefix+(startHour/1+no/1-1)) == calendar.displayHour )
        {
         hourItems[no].style.color='red'
         calendar.activeSelectBoxHour=hourItems[no]
        }
        else hourItems[no].style.color=''
	}
 },

 'createYearDiv':function()
 {
	if(!document.getElementById('yearDropDown')){var div = document.createElement('div');}
    else
    {
     var div = document.getElementById('yearDropDown');
     var subDivs = div.getElementsByTagName('div');
     for(var no=0;no<subDivs.length;no++) subDivs[no].parentNode.removeChild(subDivs[no]);
	}
	var d = new Date();
	if(calendar.year){d.setFullYear(calendar.year);}
	var startYear = d.getFullYear()/1 - 5;
	var subDiv = document.createElement('div');
	subDiv.innerHTML = '-';
	subDiv.onmousedown = function(){calendar.slideDropDown(this)}
	subDiv.onmouseup = function(){clearTimeout(calendar.thread);}
	div.appendChild(subDiv);
	for(var no=startYear;no<(startYear+10);no++)
    {
     var subDiv = document.createElement('div');
     subDiv.innerHTML = no;
     subDiv.onclick = function(){calendar.selectDropDown(this)}
     subDiv.id = 'yearDiv' + no;
     div.appendChild(subDiv);
     if(calendar.year==no)
     {
      subDiv.style.color = calendar.selectBoxHighlightColor;
      calendar.activeSelectBoxYear = subDiv;
     }
    }
	var subDiv = document.createElement('div');
	subDiv.innerHTML = '+';
	subDiv.onmousedown = function(){calendar.slideDropDown(this)}
	subDiv.onmouseup = function(){clearTimeout(calendar.thread);}
	div.appendChild(subDiv);
	return div;
 },

 'createMonthDiv':function()
 {
  var div = document.createElement('div');
  div.id = 'monthPicker';
  for(var no=0;no<calendar.monthArray.length;no++)
  {
   var subDiv = document.createElement('div');
   subDiv.innerHTML = calendar.monthArray[no];
   subDiv.onclick = function(){calendar.selectDropDown(this)}
   var prefix='';
   if(no/1<10)prefix='0';
   subDiv.id = 'monthDiv' +prefix+ no;
   subDiv.style.width = '56px';
   div.appendChild(subDiv);
   if(calendar.month==no)
   {
    subDiv.style.color = calendar.selectBoxHighlightColor;
    calendar.activeSelectBoxMonth = subDiv;
   }
  }
  return div;
 },

 'createHourDiv':function()
 {
	if(!document.getElementById('hourDropDown')){var div = document.createElement('div');}
    else
    {
     var div = document.getElementById('hourDropDown');
     var subDivs = div.getElementsByTagName('div');
     for(var no=0;no<subDivs.length;no++)subDivs[no].parentNode.removeChild(subDivs[no]);
	}
	if(!calendar.displayHour)calendar.displayHour=0;
	var startHour = calendar.displayHour/1;
	if(startHour>14)startHour=14;
	var subDiv = document.createElement('div');
	subDiv.innerHTML = '-';
	subDiv.onmousedown = function(){calendar.slideDropDown(this)}
	subDiv.onmouseup = function(){clearTimeout(calendar.thread)}
	div.appendChild(subDiv);
	for(var no=startHour;no<startHour+10;no++)
    {
		var prefix = '';
		if (no/1<10) prefix='0';
		var subDiv = document.createElement('div');
		subDiv.innerHTML = prefix + no;
		subDiv.onclick = function(){calendar.selectDropDown(this)}
		subDiv.id = 'hourDiv' + prefix + no;
		div.appendChild(subDiv);
		if(calendar.displayHour==no)
        {
         subDiv.style.color = calendar.selectBoxHighlightColor;
         calendar.activeSelectBoxHour = subDiv;
		}
	}
	var subDiv = document.createElement('div');
	subDiv.innerHTML = '+';
	subDiv.onmousedown = function(){calendar.slideDropDown(this)}
	subDiv.onmouseup = function(){clearTimeout(calendar.thread);}
	div.appendChild(subDiv);
	return div;
 },

 'createMinuteDiv':function()
 {
	if(!document.getElementById('minuteDropDown')){var div = document.createElement('div');}
    else
    {
     var div = document.getElementById('minuteDropDown');
     var subDivs = div.getElementsByTagName('div');
     for(var no=0;no<subDivs.length;no++) subDivs[no].parentNode.removeChild(subDivs[no]);
	}
	var prefix = '';
	for(var no=0;no<60;no+=5)
    {
		if(no<10)prefix='0'; else prefix = '';
		var subDiv = document.createElement('div');
		subDiv.innerHTML = prefix + no;
		subDiv.onclick = function(){calendar.selectDropDown(this)}
		subDiv.id = 'minuteDiv' + prefix + no;
		div.appendChild(subDiv);
		if(calendar.displayMinute==no)
        {
		 subDiv.style.color = calendar.selectBoxHighlightColor;
		 calendar.activeSelectBoxMinute = subDiv;
		}
	}
	return div;
 },

	var yearPicker = calendar.createYearDiv();
	yearPicker.id = 'yearDropDown';
	topBar.appendChild(yearPicker);

	var monthPicker = calendar.createMonthDiv();
	monthPicker.id = 'monthDropDown';
	topBar.appendChild(monthPicker);

	var span = document.createElement('span');
	span.id = 'calendar_hour_txt';
	span.onclick = calendar.showDropDown(2);
	span.innerHTML = calendar.displayHour;
	topBar.appendChild(span);

	var hourPicker = calendar.createHourDiv();
	hourPicker.id = 'hourDropDown';
	topBar.appendChild(hourPicker);

	var span = document.createElement('span');
	span.id = 'calendar_minute_txt';
	span.onclick = calendar.showDropDown(3);
	span.innerHTML = calendar.displayMinute;
	topBar.appendChild(span);

	var minutePicker = calendar.createMinuteDiv();
	minutePicker.id = 'minuteDropDown';
	topBar.appendChild(minutePicker);

*/

