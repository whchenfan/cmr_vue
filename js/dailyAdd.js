 	
$(function(){
	//dailyPaper
	var user,parmas={};
 	new Vue({
 		beforeCreate(){
 			if(!sessionStorage.getItem("user")){
 				window.location.href="login.html";
 			}

 			user=JSON.parse(sessionStorage.getItem("user"));
 			
 		},
 		methods:{
 			selFn(event){
 				var _this=event.target,
 					_index=_this.selectedIndex,
 					options=_this.options;
 				_this.parentNode.querySelector("span").innerHTML=options[_index].innerHTML;

 			},
 			submitFn(){
 				
 				var inp=document.querySelectorAll("input"),
 				    btn=true;
 				for(var i=0,maxl=inp.length;i<maxl;i++){
 					var _value=inp[i].value,
 						_name=inp[i].getAttribute("name");
 					if(!_value){
 						if(_name=='company_name'){
 							AlertFn({"cont":"公司名称不能为空"});
 							btn=false;
 							break;
 						}
 					}
 					if(!_value){
 						if(_name=='service_line'){
 							AlertFn({"cont":"业务线不能为空"});
 							btn=false;
 							break;
 						}
 					}
 					if(!_value){
 						if(_name=='progress_situation'){
 							AlertFn({"cont":"进展情况不能为空"});
 							btn=false;
 							break;
 						}
 					}
 					if(!_value){
 						if(_name=='communication_points'){
 							AlertFn({"cont":"沟通要点不能为空"});
 							btn=false;
 							break;
 						}
 					}
 					if(!_value){
 						if(_name=='cantract_ method'){
 							AlertFn({"cont":"业务线不能为空"});
 							btn=false;
 							break;
 						}
 					}
 					if(!_value){
 						if(_name=='cantract_method'){
 							AlertFn({"cont":"沟通形式不能为空"});
 							btn=false;
 							break;
 						}
 					}
 					if(!_value){
 						if(_name=='cantract_type'){
 							AlertFn({"cont":"联系方式不能为空"});
 							btn=false;
 							break;
 						}
 					}
 					if(!_value){
 						if(_name=='customers_person'){
 							AlertFn({"cont":"联系人不能为空"});
 							btn=false;
 							break;
 						}
 					}
                   parmas[_name]=_value;
 				}
 				if(!btn)return;
 				var select=document.querySelectorAll("select");
 				for(var i=0,maxl=select.length;i<maxl;i++){
 					var _name=select[i].getAttribute("name"),
 						_value=select[i].value;
 					if(!_value){
 						if(_name=='contract_type'){
 							AlertFn({"cont":"请选择沟通方式"});
 							btn=false;
 							break;
 						}
 						if(_name=='customer_source'){
 							AlertFn({"cont":"请选择可会来源"});
 							btn=false;
 							break;
 						}
 					}
 					parmas[_name]=_value;
 				}
 				if(!btn)return;
 				parmas['user_id']=user.id;
 				parmas['type']='submit';
 				console.log(parmas);
 				loading();
 				ajaxComm({
 					url:'dailyPaper.php',
 					params:parmas,
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
 			}
 		}

 	}).$mount("#daily");
});