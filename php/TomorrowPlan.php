<?php
	header('Access-Control-Allow-Origin:*');
    header('Content-Type:text/json;charset=utf-8');
    include_once  "./dbComm.php";
	$db=new connDb();
	$data=Array();
	if(!array_key_exists("type",$_REQUEST)){
		
		$sql="SELECT a.*,b.user_name FROM tomorrow_log AS a,(SELECT id,user_name FROM admin WHERE `power`=".intval($_REQUEST['user_id'])." OR id=".intval($_REQUEST['user_id']).") AS b WHERE a.user_id=b.id order by create_time desc";
		if(!array_key_exists("index",$_REQUEST)){
			$data=$db->page($sql);
		}else{
			$data=$db->page($sql,intval($_REQUEST['index']));
		 }	
		// $data['sql']=$sql;
	}else{
		if($_REQUEST['type']=='submit'){
			$val='';$ky='';
			$sql='insert into tomorrow_log ';
			foreach($_REQUEST as $key => $value){
				if(!empty($value)&&$key!=='type'){
					$ky.='`'.$key.'`,';
					$val.='"'.$value.'",';
				}
			}
			$organization_number='WP'.date('YmdHis',time()).rand(10000,99999);
			$sql.='('.$ky.'`create_time`,`id_code`) VALUES('.$val.'"'.time().'","'.$organization_number.'")'; 
			$data['sql']=$sql;
			$data['flg']=$db->query($sql);
		}else if($_REQUEST['type']=='update'){
			if($_REQUEST['user_id']==1){
				$data['flg']=false;
				$data['rspDesc']="测试账号无权修改数据。";
			}else{
				if($_REQUEST['id']==1){
					$data['flg']=flase;
					$data['desRec']="测试数据无权修改数据。";
				}else{
				$val='';$ky='';
				$sql='update tomorrow_log SET ';
				foreach($_REQUEST as $key => $value){
					if(!empty($value)&&($key!='type'&&$key!='id')){
						$sql.='`'.$key.'`="'.$value.'",';
						$data[$key]=$key;
					}
				}
				$sql.='`update_time`="'.time().'" where id='.$_REQUEST['id'];
				 $data['flg']=$db->query($sql);
				}
			}
		}else if($_REQUEST["type"]=="updatePostil"){
			$sql='update tomorrow_log SET `postil`="'.$_REQUEST["postil"].'",postil_id='.intval($_REQUEST["user_id"]).',postil_type=1,postil_time="'.time().'" where id='.$_REQUEST['id'];
			$data["sql"]=$sql;
			$data["flg"]=$db->query($sql);
		}else if($_REQUEST["type"]=="selectAdd"){
			$sql='select * from tomorrow_log where user_id='.$_REQUEST['user_id'].' and create_time>='.strtotime(date("Y-m-d")).' and create_time<'.strtotime(date("Y-m-d",time()+86400));
			$assoc=$db->fetch_assoc($db->query($sql));	
			if($assoc){
				$data["flg"]=true;
				$data["id"]=$assoc["id"];
			}else{
				$data["flg"]=false;
			}

		}else if($_REQUEST['type']=='select'){
			$sql='select * from tomorrow_log where id='.$_REQUEST['id'];
			$data=$db->fetch_assoc($db->query($sql));
		}
	}
	echo json_encode($data);
?>