
var vue_app;
var mountedFn=function(){
		loadingRemove();
		$("#app").show();
	$(".comm-page").on("click","li",function(){
		var index=this.getAttribute("data-index");
		ajaxComm({
		   "url":"php/colleague.php",
		   "params":{index:index},
		   "success":function(data){
			   vue_app._data.list=data.list;
			   console.log(data);
			}
		 });
	});	
}
$(function(){
	loading();
	ajaxComm({
	   "url":"php/colleague.php",
       "success":function(data){
		    
	     vue_app=new Vue({
			  el: '#app',
			  data:data,
			  
			  methods:{
				icon_search:function(e){//搜索
					var val=$(e.target).prev().val();
					if(!!val){
						ajaxComm({
						   "url":"php/colleague.php",
						   "params":{"search":val},
						   "success":function(data){
							    vue_app._data.list=data.list;
							}
						 });
					}
				},  
				onchange:function(e){//选择公司或部门
					var _this=e.target,
						_sel=$(_this).parents(".sel"),
						$span=_sel.find("span");
		           $span.html(_this.options[_this.selectedIndex].innerHTML);
					var params;
					if(_this.id=="department"){
						var company=document.getElementById("company").value;
						if(company){
							params={"de":_this.value,"company":company}
						}else{
							params={"de":_this.value}
						}
						
					}else if(_this.id=="company"){
						var department=document.getElementById("department").value;
						if(company){
							params={"company":_this.value,"de":department}
						}else{
							params={"company":_this.value}
						}
					}
					ajaxComm({
					   "url":"php/colleague.php",
					   "params":params,
					   "success":function(data){
						   vue_app._data.list=data.list;
						   vue_app._data.de_company=data.de_company;
						 
						}
					 });
				},
				page1:function(e){
					var index=e.target.parentNode.getAttribute("data-index");
					if(e.target.parentNode.getAttribute("data-company")){
						var params={index:index,"company":e.target.parentNode.getAttribute("data-company")};
					}else{
						var params={index:index};
					}
					ajaxComm({
					   "url":"php/colleague.php",
					   "params":params,
					   "success":function(data){
						   vue_app._data.list=data.list;
						}
					 });
				}  
			  },
			  
			  mounted:mountedFn()
			 
		  })
	    }
     });
  
})
