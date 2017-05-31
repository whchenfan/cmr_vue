 	
$(function(){
	//dailyPaper
	
	var user,parmas={},
		id=GetQueryString("id")
 	new Vue({
 		data:{
 			data:[],
 			user_id:0,
 			flg:false
 		},
 		beforeCreate(){
 			var _this=this;
 			if(!sessionStorage.getItem("user")){
 				window.location.href="login.html";
 			}
 			if(!id){
 				AlertFn({"cont":"数据出错,请从新在进入。","fn":function(){window.history.back();}})
 			   return false;

 			}
 			loading();
 			user=JSON.parse(sessionStorage.getItem("user"));	
 		},
 		mounted(){
 			var _this=this;
 			_this.$data.user_id=user.id;
 			ajaxComm({
 				url:"dailyPaper.php",
 				params:{id:id,type:"select"},
 				success:function(data){
 					loadingRemove();
 					_this.$data.data=data;
 					_this.$data.flg=data.user_id==_this.$data.user_id;
 				}
 			})
 		},
 		methods:{
 			selFn(event){
 				var _this=event.target,
 					_index=_this.selectedIndex,
 					options=_this.options;
 				_this.parentNode.querySelector("span").innerHTML=options[_index].innerHTML;
 			},
 			updateFn(){
 				var _this=this;
 				var inp=document.querySelectorAll("input"),
 				    btn=true;
 				for(var i=0,maxl=inp.length;i<maxl;i++){
 					var _value=inp[i].value,
 						_name=inp[i].getAttribute("name");
 					if(_value){
 						parmas[_name]=_value;
 					}
 				}
 				
 				var select=document.querySelectorAll("select");
 				for(var i=0,maxl=select.length;i<maxl;i++){
 					var _name=select[i].getAttribute("name"),
 						_value=select[i].value;
 					if(_value){
 						parmas[_name]=_value;
 					}
 					
 				}
 				parmas['user_id']=user.id;
 				parmas['id']=id;
 				parmas['type']='update';
 				loading();
 				ajaxComm({
 					url:'dailyPaper.php',
 					params:parmas,
 					success:function(data){
 						loadingRemove();
 						if(data.flg){
 							AlertFn({"cont":"修改数据成功。"});
 						}else{
 							AlertFn({"cont":data.rspDesc||"修改数据失败。"});
 						}
 					}
 				})
 			}
 		}

 	}).$mount("#daily");
});