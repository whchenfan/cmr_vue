$(function(){
	var district,city,province;
	var pageFlag=true;//控制能否出现分页
  var params={};
	new Vue({
         data:{
             data:[],
             index:1,
             maxPage:1,
             power:1
         },
         beforeCreate(){
            //没有登录去登录页面
            if(!sessionStorage.getItem("user"))window.location.href="login.html";
            loading();
             province=getId("province");
            var proviceHtml='<option value="">请选择省份</option>';
            ChineseDistricts["Province"].forEach(function(val,i,data){
                proviceHtml+='<option value="'+val.code+'">'+val.address+'</option>';
            })
            province.querySelector("select").innerHTML=proviceHtml;
            $(".sel").selFn();  
         },
         mounted(){
            
            var _this=this,
            id=JSON.parse(sessionStorage.getItem("user")).id;
            
            ajaxComm({
                url:'CustomerInformation.php',
                params:{"user_id":id},
                success:function(listDate){
                  loadingRemove();
                   _this.$data.data=listDate.data||[];
                   _this.$data.index=listDate.index||1; 
                   _this.$data.maxPage=listDate.maxPage||0; 
                   params["index"]=_this.$data.index;
                   params["user_id"]=id;
                   _this.pageFn();
                }

            });
         },
         methods:{
            pageFn(){
              var _this=this,
                  id=JSON.parse(sessionStorage.getItem("user")).id;
              $(window).scroll(function(){
                  if(pageFlag&&($(window).height()+$(window).scrollTop()>=$("body").outerHeight(true))){
                      pageFlag=false;
                      _this.$data.index++;
                      if(_this.$data.index>_this.$data.maxPage)return false;
                      params["index"]=_this.$data.index;
                      loading();
                      ajaxComm({
                        url:'CustomerInformation.php',
                        params:params,
                        success:function(listDate){
                         listDate.data.forEach(function(v){
                             _this.$data.data.push(v);
                         })
                          setTimeout(function(){
                            loadingRemove();
                            _this.$data.index=listDate.index
                            _this.$data.maxPage=listDate.maxPage
                            if(listDate.maxPage!=_this.$data.index){
                               pageFlag=true;
                             }
                          },0); 
                        }

                     });
                  }
              })
            },
            formTime(a){
              var d=new Date();
                      d.setTime(a);
                      return d.getFullYear()+'/'+(d.getMonth()+1>9?(d.getMonth()+1):('0'+(d.getMonth()+1)))+'/'+(d.getDate()>9?d.getDate():('0'+d.getDate()));
            },
            proCityDis(event){
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
                        params["index"]=1;
                        params["province"]=_value;
                        params["city"]="";
                        params["district"]="";
                        break;
                    case 'city':
                        var districtDate=ChineseDistricts[_value],
                           districtHtml='<option value>请选择区县</option>';
                           district.querySelector("p>span").innerHTML="请选择区县";
                           districtDate.forEach(function(val){
                               districtHtml+='<option value="'+val.code+'">'+val.address+'</option>';
                           });
                          district.querySelector("select").innerHTML=districtHtml;
                        params["index"]=1;
                        params["province"]=document.querySelector('select[name="province"]').value;
                        params["city"]=_value;
                        params["district"]="";
                        break;
                    case 'district':
                        params["index"]=1;
                        params["province"]=document.querySelector('select[name="province"]').value;
                        params["city"]=document.querySelector('select[name="city"]').value;
                        params["district"]=_value;
                        break;
                    default:
                        break;
                   
                }  
                params["search"]=document.querySelector("#search").value;
                this.getData();
            },
            searchFn(){
              var _value=document.querySelector("#search").value;
              if(!_value)return false;
               params["index"]=1;
               params["province"]=document.querySelector('select[name="province"]').value;
               params["city"]=document.querySelector('select[name="city"]').value;
               params["district"]=document.querySelector('select[name="district"]').value;
               params["search"]=_value;
               this.getData();
            },
            getData(){
              loading();
              var _this=this;
              pageFlag=false;
              ajaxComm({
                    url:'CustomerInformation.php',
                    params:params,
                    success:function(listDate){
                        console.log(listDate);
                        loadingRemove();
                        _this.$data.data=listDate.data||[];
                        _this.$data.index=listDate.index||1;
                        _this.$data.maxPage=listDate.maxPage||0;
                        pageFlag=true; 
                        
                    }

                 });
            }

         }
    }).$mount("#demo");
		 
});