
$(function(){
    var user_id,district,city,province,
        id=GetQueryString("id");
    new Vue({
       data:{
           flg:false,
           data:{},
           source:roueceData
       },
       beforeCreate(){
           //没有登录去登录页面
          if(!sessionStorage.getItem("user")){
              window.location.href="login.html";
           }else{
               loading();
              
               user_id=JSON.parse(sessionStorage.getItem("user")).id; 
           }
       },
       mounted(){
            $(".sel").selFn();
            var _this=this;
            province=getId("province");
            ajaxComm({
                url:"CustomerInformation.php",
                params:{type:"details",id:id},
                success:function(data){
                    loadingRemove();
                    _this.$data.data=data;
                    if(data){
                         _this.$data.flg=(user_id==data.user_id);
                    }
                }

            })
       },
       updated(){
          var _this=this;
          province=getId("province");
          city=getId("city");
          district=getId("district");
          var proviceHtml='<option value="">请选择省份</option>';
            ChineseDistricts["Province"].forEach(function(val,i,data){
                proviceHtml+='<option value="'+val.code+'" '+(val.code==_this.$data.data.province?'selected="selected"':"")+' >'+val.address+'</option>';
                if(val.code==_this.$data.data.province){
                  province.querySelector("span").innerHTML=val.address;
                }
            })
           province.querySelector("select").innerHTML=proviceHtml;
           if(province.querySelector("select").value){
               var cityDate=ChineseDistricts[province.querySelector("select").value],
                    cityHtml='<option value>请选择城市</option>',
                   districtHtml='<option value>请选择区县</option>';
                           
                       if(cityDate.length==1){
                           city.querySelector("p>span").innerHTML=cityDate[0].address; 
                           city.querySelector("select").innerHTML='<option value="'+cityDate[0].code+'">'+cityDate[0].address+'</option>'; 
                           var districtDate=ChineseDistricts[cityDate[0].code];
                               
                           district.querySelector("p>span").innerHTML="请选择区县";
                           districtDate.forEach(function(val){
                              if(val.code==_this.$data.data.district){
                                 districtHtml+='<option value="'+val.code+'" selected="selected">'+val.address+'</option>';
                                 district.querySelector("span").innerHTML=val.address;
                              }else{
                                 districtHtml+='<option value="'+val.code+'">'+val.address+'</option>';
                              }
                           });
                           district.querySelector("select").innerHTML=districtHtml;
                       }else{
                            city.querySelector("p>span").innerHTML="请选择城市"; 
                            
                            district.querySelector("p>span").innerHTML="请选择区县"; 
                            district.querySelector("select").innerHTML='<option value>请选择区县</option>';
                            cityDate.forEach(function(val){
                              if(val.code==_this.$data.data.city){
                                 cityHtml+='<option value="'+val.code+'" selected="selected">'+val.address+'</option>';
                                 city.querySelector("span").innerHTML=val.address;
                              }else{
                                 cityHtml+='<option value="'+val.code+'">'+val.address+'</option>';
                              }
                           });
                           city.querySelector("select").innerHTML=cityHtml;
                           if(city.querySelector("select").value){
                              districtDate=ChineseDistricts[city.querySelector("select").value];
                              districtDate.forEach(function(val){
                              if(val.code==_this.$data.data.district){
                                 districtHtml+='<option value="'+val.code+'" selected="selected">'+val.address+'</option>';
                                 district.querySelector("span").innerHTML=val.address;
                              }else{
                                 districtHtml+='<option value="'+val.code+'">'+val.address+'</option>';
                              }
                            })
                              district.querySelector("select").innerHTML=districtHtml;
                           }
                       } 
           }           
       },
       methods:{
            updateFn(){
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
                
               for(var i=0,maxL=inp.length;i<maxL;i++){
                  if(inp[i].value){
                      if(inp[i].getAttribute("name")=='contact_mobile'
                        &&!iphoneExp.test(inp[i].value)){
                        AlertFn({cont:"手机号码的格式不对"});
                         btn=false;
                        break;
                        
                      }
                      if(inp[i].getAttribute("name")=='contact_email'
                        &&!emailExp.test(inp[i].value)){
                        AlertFn({cont:"邮箱格式不对"});
                          btn=false;
                          break; 
                      }
                       
                  }
                  params+='"'+inp[i].getAttribute("name")+'":"'+inp[i].value+'",';
               }
              
               params='{'+params+'"id":'+this.$data.data.id+',"user_id":'+user_id+',"type":"update"}';
               loading();
               ajaxComm({
                  url:"CustomerInformation.php",
                  params:JSON.parse(params),
                  success:function(data){
                   loadingRemove();
                    if(data.flg){
                        AlertFn({"cont":"修改数据成功"});
                    }else{
                        AlertFn({"cont":data.rspDesc||"修改数据失败"});
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
                           districtDate.forEach(function(val){
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
                       districtDate.forEach(function(val){
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
	