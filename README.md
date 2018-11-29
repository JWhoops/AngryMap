TODO:
<ol>
<li>Need to finish the auth part</li>
<li>another db for unverified data</li>
<li>add update/remove functions</li>
<li>add validation on new post(will do for front end)</li>
<li>add new/post functions</li>
<li>finish front-end posting page</li>
</ol>

<hr>
<pre>
STR: US WISC UWMAD MSHUM F001 2250x
LEN: 2    4         5             5            4       5

eg:
US{
Country:’United States’,
 States:[‘ALBM’:’Alabama’,’WISC’:’Wisconsin’,...]
}

USWISC{
	Country:’United States’,
State:’Wisconsin’,
 Institutions:[‘UWMAD’:‘University of Wisconsin, Madison’,’UWMIL’:’University of Wisconsin, Milwaukee’,...]
}

USWISCUWMAD{
Country:’United States’,
State:’Wisconsin’,
Institution:’University of Wisconsin, Madison’, 
Buildings:[‘MSHUM’:‘Moose Humanity’,’HElCW’:’Helen C White’,...]
}

USWISCUWMADMSHUM{
	Country:’United States’,
State:’Wisconsin’,
Institution:’University of Wisconsin, Madison’, 
	Building:’Moose Humanity’,
Floors:[‘F001’:’Floor 1’,’F002’:’Floor 2’,...]
}

USWISCUWMADMSHUMF001{
	Country:’United States’,
State:’Wisconsin’,
Institution:’University of Wisconsin, Madison’, 
	Building:’Moose Humanity’,
image:’url.xxx.xxx/xxx’,
Rooms:[‘1100’:obj1100,’1120’:obj1120,...]//arr of room objects, need xy information
}


USWISCUWMADMSHUMF0012250x{
	Country:’United States’,
State:’Wisconsin’,
Institution:’University of Wisconsin, Madison’, 
	Building:’Moose Humanity’,
Room:’2250’,
room:{Occupancy:500,
type:'room',
function:’lecture’,
X:123,
Y:456}
}


Annotation:
Room 可以是房间(hash='1150b', type='room', function='lecture')，也可以是楼层入口(hash='ent01', type='entrance', function='entrance door')，也可以是楼梯(hash='sta01', type='stair', function='stair to floor 1')，也可以是电梯(hash='ele01', type='elevator', function='elevator to xx')。。。
</pre>
