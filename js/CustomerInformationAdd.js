
$(function(){
	$(".sel").selFn();//select
	var user_id,user,district,city,province;
	new Vue({
		beforeCreate(){
			if(!sessionStorage.getItem("user"))window.location.href="login.html";
            	
            loading();
           	user=JSON.parse(sessionStorage.getItem("user"));
			province=getId("province");
            var proviceHtml='<option value="">请选择省份</option>';
            ChineseDistricts["Province"].forEach(function(val,i,data){
                proviceHtml+='<option value="'+val.code+'">'+val.address+'</option>';
            })
            province.querySelector("select").innerHTML=proviceHtml;
			$(".sel").selFn();  
		},
		mounted(){
			loadingRemove();
		},
		methods:{
		   submitFn(){
		   		var inp=document.getElementsByTagName("input"),
                   select=document.getElementsByTagName("select"),
                   params="",btn=true;
               for(var i=0,maxL=select.length;i<maxL;i++){
                 var _value=select[i].value,
                 	 _name=select[i].getAttribute("name");
                  if(!_value){
                    if(_name=='source'){
                          AlertFn({cont:"请选择客户来源渠道"});
                          btn=false;
                          break;	
                    }else if(_name=='province'){
                          AlertFn({cont:"请选择省份"});
                          btn=false;
                          break;
                    }else if(_name=='city'){
                    	  AlertFn({cont:"请选择城市"});
                          btn=false;
                          break;
                    }else if(_name=='district'){
                    	  if(nullDistrict.indexOf(document.querySelector('select[name="city"]').value)==-1){
                        	  AlertFn({cont:"请选择区县"});
                          	  btn=false;
                          	  break;
                          }
                    }
                   }
                  params+='"'+select[i].getAttribute("name")+'":"'+select[i].value+'",';
               }
              if(!btn)return; 
              
               for(var i=0,maxL=inp.length;i<maxL;i++){
               	var _value=inp[i].value,
               	    _name=inp[i].getAttribute("name");
               	  if(!_value){
               	  	  if(_name=='contact_name'){
               	  	  	AlertFn({cont:"联系人姓名不能为空。"});
               	  	  	btn=false;
               	  	  	break;
               	  	  }
               	  	  if(_name=='company_name'){
               	  	  	AlertFn({cont:"公司名称不能为空。"});
               	  	  	btn=false;
               	  	  	break;
               	  	  }
               	  	  if(_name=='company_mobile'){
               	  	  	AlertFn({cont:"联系人电话号码不能为空。"});
               	  	  	break;
               	  	  }
               	  	  if(_name=='contact_business'){
               	  	  	AlertFn({cont:"联系人职务不能为空。"});
               	  	  	btn=false;
               	  	  	break;
               	  	  }
               	  	  if(_name=='contact_address'){
               	  	  	AlertFn({cont:"公司详情地址不能为空。"});
               	  	  	btn=false;
               	  	  	break;
               	  	  }
               	  }
                  if(_value){
                      if(inp[i].getAttribute("name")=='contact_email'
                        &&!emailExp.test(inp[i].value)){
                         AlertFn({cont:"邮箱格式不对"});
                         btn=false;
                         break; 
                      }   
                  }
                  params+='"'+inp[i].getAttribute("name")+'":"'+inp[i].value+'",';
               }
              if(!btn)return;
               params='{'+params+'"user_id":'+user.id+',"type":"submit"}';
             
              loading();
              ajaxComm({
              	 url:"CustomerInformation.php",
                 params:JSON.parse(params),
                 success:function(data){
                 	loadingRemove();
                  console.log(data);
                 	if(data.flg){
                    AlertFn({"cont":"添加数据成功。"});
                  }else{
                    AlertFn({"cont":"添加数据失败。"});
                  }
                 }
              })
		   },	
		   proCityDis: function(event){
			district=getId("district");
             city=getId("city"); 
            var _this=event.target,
                _span=(_this.previousElementSibling||_this.previousSibling).querySelector("span"),
                _index=_this.selectedIndex,
                _value=_this.value,
                option=_this.options[_index],
                _id=_this.parentNode.id;
            _span.innerHTML=option.innerHTML;
            switch(_id){
                case 'province':

                    if(!_value){
                       city.querySelector("p>span").innerHTML="请选择城市"; 
                       city.querySelector("select").innerHTML='<option value>请选择城市</option>';
                       district.querySelector("p>span").innerHTML="请选择区县"; 
                       district.querySelector("select").innerHTML='<option value>请选择区县</option>';
                       
                    }else{
                       var cityDate=ChineseDistricts[_value],
                           cityHtml='<option value>请选择城市</option>';
                       if(cityDate.length==1){
                           city.querySelector("p>span").innerHTML=cityDate[0].address; 
                           city.querySelector("select").innerHTML='<option value="'+cityDate[0].code+'">'+cityDate[0].address+'</option>'; 
                           var districtDate=ChineseDistricts[cityDate[0].code],
                               districtHtml='<option value>请选择区县</option>';
                           district.querySelector("p>span").innerHTML="请选择区县";
                           districtDate&&districtDate.forEach(function(val){
                               districtHtml+='<option value="'+val.code+'">'+val.address+'</option>';
                           });
                           district.querySelector("select").innerHTML=districtHtml;
                       }else{
                            city.querySelector("p>span").innerHTML="请选择城市"; 
                            
                            district.querySelector("p>span").innerHTML="请选择区县"; 
                            district.querySelector("select").innerHTML='<option value>请选择区县</option>';
                            cityDate.forEach(function(val){
                               cityHtml+='<option value="'+val.code+'">'+val.address+'</option>';
                           });
                           city.querySelector("select").innerHTML=cityHtml;
                       } 
                    }
                    break;
                case 'city':
                    var districtDate=ChineseDistricts[_value],
                       districtHtml='<option value>请选择区县</option>';
                       district.querySelector("p>span").innerHTML="请选择区县";
                       districtDate&&districtDate.forEach(function(val){
                           districtHtml+='<option value="'+val.code+'">'+val.address+'</option>';
                       });
                      district.querySelector("select").innerHTML=districtHtml;
                    break;
                default:
                    break;
               
            }  
      	  }
		}
	}).$mount("#demo");
    


});