var roueceData={1:"网络推广",2:"独立开发"},
	iphoneExp=/^1(3|4|5|7|8)\d{9}$/,//手机号码的验证
	emailExp = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/,//邮箱验证的正则
	nullDistrict='441900,442000,460300,460400';//这些城市下面的没有区县

function ready(fn){  
    if(document.addEventListener){      //标准浏览器  
        document.addEventListener('DOMContentLoaded',function(){  
            //注销时间，避免反复触发  
            document.removeEventListener('DOMContentLoaded',arguments.callee,false);  
            fn();       //执行函数  
        },false);  
    }else if(document.attachEvent){     //IE浏览器  
        document.attachEvent('onreadystatechange',function(){  
            if(document.readyState=='complete'){  
                document.detachEvent('onreadystatechange',arguments.callee);  
                fn();       //函数执行  
            }  
        });  
    }  
}  
///
var trimlr=/(^\s+)|(\s+$)/g;//前后空格
Element.prototype.removeClass=function(str){//去掉class
		if(!str)return false;
		var classN=this.className;
		if(classN==str){
			this.className='';
		}else{
		   this.className=((" "+classN).replace(str,"")).replace(trimlr,"");
		}
		
};
Element.prototype.addClass=function(str){
	
		if(!str)return false;
		if(this.className==null||this.className==''){
			this.className=str;
		}else{
			this.className+=" "+str;
		}
		
};

Element.prototype.isClass=function(str){
	   if(!str)return false;
		var classN=(this.className).replace(trimlr,""),
			str=str.replace(trimlr,"");
		if((" "+classN+" ").indexOf(str)!=-1){
		 return true;	
		}
		return false;	
};
var getId=function(id){return id?document.getElementById(id):document;};
$.fn.selFn=function(){
		  $(this).each(function() {
			  var $span=$(this).find("span"),
			  _sele=$(this).find("select")[0]; 
			  $span.html(_sele.options[_sele.selectedIndex].innerHTML);
			  _sele.onchange=function(){
				  
				  	$(this).prev("p").children("span").html(this.options[this.selectedIndex].innerHTML);
			  };
       	   });
}
$.fn.inpTime=function(){
	$(this).each(function(){
		var $this=$(this),
			$inpTime=$this.find("input[type='date']"),
			$span=$this.find("span");
			
		   !$inpTime.val()?$span.html("请选择"):$span.html($inpTime.val());
		   /*$inpTime.on("change",function(){
			   !$inpTime.val()?$span.html("请选择"):$span.html($inpTime.val());
		   });*/
	});
	
}
//判断更目录的文字大小
var windowWidth=$(window).width();//窗口的宽度
var fontSizeFn=function(){
			if(340>=windowWidth){
				return 14;
			}else if(340<windowWidth&&windowWidth<=365){
				return 16;      
			}else if(365<windowWidth&&windowWidth<=405){
			return 18;
			}else if(405<windowWidth&&windowWidth<=450){
			return 20;
			}else if(450<windowWidth&&windowWidth<=495){
				return 22;
			}else if(495<windowWidth&&windowWidth<=540){
				return 24;
			}else if(540<windowWidth&&windowWidth<=585){
				return 26;
			}else if(585<windowWidth&&windowWidth<=630){
				return 28;
			}else{
				return 30;
			}	
 }
var fontSize=fontSizeFn();
window.onresize=function(){fontSize=fontSizeFn();}
//loading加载效果
var _body=document.body;
var loading=function(opt){
	opt=opt||{};
	opt.mask=!opt.mask||false;//是否要遮罩层
	var div=document.createElement("div");
	var _load=div.cloneNode(true);
	_load.className="spinner-cont";
	_load.innerHTML='<div class="spinner">'+
						'<div class="spinner-container container1">'+
							'<div class="circle1"></div>'+
							'<div class="circle2"></div>'+
							'<div class="circle3"></div>'+
							'<div class="circle4"></div>'+
						'</div>'+
						'<div class="spinner-container container2">'+
							'<div class="circle1"></div>'+
							'<div class="circle2"></div>'+
							'<div class="circle3"></div>'+
							'<div class="circle4"></div>'+
						'</div>'+
						'<div class="spinner-container container3">'+
							'<div class="circle1"></div>'+
							'<div class="circle2"></div>'+
							'<div class="circle3"></div>'+
							'<div class="circle4"></div>'+
						'</div>'+
						'<div class="spinner-container container4">'+
							'<div class="circle1"></div>'+
							'<div class="circle2"></div>'+
							'<div class="circle3"></div>'+
							'<div class="circle4"></div>'+
						'</div>'+
					'</div>';
	if(opt.mask){
		var _mask=div.cloneNode(true);
		_mask.className="mask";
		_mask.style.display="block";
		_body.appendChild(_mask)
		_mask.appendChild(_load);
		_body.appendChild(_mask);
	}else{
		_body.appendChild(_load);
	}
}
var loadingRemove=function(){
	var obj=document.getElementsByClassName("spinner-cont")[0];
	if(obj){
       var parentObj=obj.parentNode;
	   
	   if(parentObj.tagName.toLowerCase()!=="BODY"){
		   parentObj.parentNode.removeChild(parentObj);
	   }else{
		  parentObj.removeChild(obj);
	   }
	}
}
var commHref="http://127.0.0.1/CMR_VUE/php/"
var ajaxComm=function(opt){
	if(!opt.url){return false}
	opt.params=opt.params||{};
	if(!opt.error){
		opt.error=function(HTP){
		   loadingRemove();		
		   if(HTP.status=="timeout"){
			   
		   }
		}
	}
	$.ajax({
		"type":opt.type||"GET",
		"url":commHref+opt.url,
		"data":opt.params,
		"timeout":5E3,
		"async":true,
		"dataType":"json",
		"success":function(data){
			opt.success(data);
		},
		"error":opt.error
	})
	
}


function GetQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}

var AlertFn=function(opt){
	opt=opt||{};
	opt.maskFlg=(opt.maskFlg==='undefined'&&opt.maskFlg)?true:false;//是否存在遮罩层
	opt.objClass=opt.objClass||"comm_alt_info";//对象的class
	opt.cont=opt.cont||"未知错误";//内容提示
	opt.titleCont=opt.titleCont||"提示";//内容提示
	opt.url=opt.url||"javascript:;";//内容提示
	
	if(!opt.mask){//如果遮罩层对象不存在，就创建遮罩层对象
		if(document.getElementsByClassName("mask").length>0){
			opt.mask=document.getElementsByClassName("mask")[0];
			opt.mask.style.display="block";
		}else{
			opt.mask=document.createElement("div");
			opt.mask.className="mask";
			$("body").append(opt.mask);	
		}	
	}
	
	if(!opt._this){//如果对象不存在，就创建对象
		opt._this=document.createElement("div");
		opt._this.className=opt.objClass+" box-size";
		opt._this.innerHTML='<h2>'+opt.titleCont+'</h2>'+
						'<div class="cont">'+opt.cont+'</div>'+
						'<a href="javascript:;" class="btn_alt">确定</a>';
		$("body").append(opt._this);
	}
	$(opt._this).css({marginTop:-Math.round($(opt._this).outerHeight(true)/1.5)});
	opt.urlObj=$(opt._this).find(".btn_alt");
	if(opt.fn&&Object.prototype.toString.call(opt.fn)=== '[object Function]'){
		opt.urlObj.click(function(){
			if(opt._this){$(opt._this).remove(); opt._this=null;}
			if(opt.mask){$(opt.mask).remove(); opt.mask=null;}
			opt.fn();
		})
	}else{
	   if(opt.url!='javascript:;'){
		   opt.urlObj[0].setAttribute("href",opt.url);
	   }else{	
			opt.urlObj.click(function(){
				if(opt._this){$(opt._this).remove(); opt._this=null;}
				if(opt.mask){$(opt.mask).remove(); opt.mask=null;}
			});					
		}
	}
}

var ComfirmFn=function(opt){
	opt=opt||{};
	opt.maskFlg=(opt.maskFlg==='undefined'&&opt.maskFlg)?true:false;//是否存在遮罩层
	opt.objClass=opt.objClass||"comfirm_alt";//对象的class
	opt.cont=opt.cont||"未知错误";//内容提示
	opt.titleCont=opt.titleCont||"提示";//内容提示
	opt.url=opt.url||"javascript:;";//内容提示
	
	if(!opt.mask){//如果遮罩层对象不存在，就创建遮罩层对象
			if(document.getElementsByClassName("mask").length>0){
				opt.mask=document.getElementsByClassName("mask")[0];
				opt.mask.style.display="block";
			}else{
				opt.mask=document.createElement("div");
				opt.mask.className="mask";
				$("body").append(opt.mask);	
			}	
	}
	
	if(!opt._this){//如果对象不存在，就创建对象
		opt._this=document.createElement("div");
		opt._this.className=opt.objClass+" box-size";
		opt._this.innerHTML='<h2>'+opt.titleCont+'</h2>'+
						'<div class="cont">'+opt.cont+'</div>'+
						'<div class="clearfix"><a href="javascript:;" class="ensure_btn">确定</a><a href="javascript:;" class="del_btn">取消</a></div>';
		$("body").append(opt._this);
	}
	$(opt._this).css({marginTop:-Math.round($(opt._this).outerHeight(true)/1.5)});
	opt.urlObj=$(opt._this).find(".ensure_btn");
	if(opt.fn&&Object.prototype.toString.call(opt.fn)=== '[object Function]'){
		opt.urlObj.click(function(){
			if(opt._this){$(opt._this).remove(); opt._this=null;}
			if(opt.mask){$(opt.mask).remove(); opt.mask=null;}
			opt.fn();
		})
	}else{
	   if(opt.url!='javascript:;'){
		   opt.urlObj[0].setAttribute("href",opt.url);
	   }else{	
			opt.urlObj.click(function(){
				if(opt._this){$(opt._this).remove(); opt._this=null;}
				if(opt.mask){$(opt.mask).remove(); opt.mask=null;}
			});					
		}
	}
	opt.delObj=$(opt._this).find(".del_btn");
	opt.delObj.click(function(){
				if(opt._this){$(opt._this).remove(); opt._this=null;}
				if(opt.mask){$(opt.mask).remove(); opt.mask=null;}
	})
}
