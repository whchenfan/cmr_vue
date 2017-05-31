<?php
header('Access-Control-Allow-Origin:*');
include_once  "./dbComm.php";
$db=new connDb();
$data=Array();
if(!array_key_exists("type",$_REQUEST)){
	$sql="SELECT a.*,b.user_name FROM client_info AS a,(SELECT id,user_name FROM admin WHERE `power`=".intval($_REQUEST['user_id'])." OR id=".intval($_REQUEST['user_id']).") AS b WHERE a.user_id=b.id order by create_time desc";
	if(!array_key_exists("index",$_REQUEST)){
		$data=$db->page($sql);

	}else{

		if(array_key_exists("province",$_REQUEST)){
			$tiaojian='';
			foreach ($_REQUEST as $key => $value) {
				if($value&&$key!='user_id'&&$key!='index'&&$key!='search'){
					if($tiaojian){
						$tiaojian.=' and a.`'.$key.'`="'.$value.'"';
					}else{
						$tiaojian='a.`'.$key.'`="'.$value.'"';
					}
				}
			};
			if($_REQUEST['search']){
				if($tiaojian){
					$tiaojian.=' and (a.`company_name`  LIKE "%'.$_REQUEST['search'].'%" OR b.user_name like "%'.$_REQUEST['search'].'%")';
				}else{
					$tiaojian=' a.`company_name`  LIKE "%'.$_REQUEST['search'].'%" OR b.user_name like "%'.$_REQUEST['search'].'%"';
				}
			}
			$sql="SELECT a.*,b.user_name FROM client_info AS a,(SELECT id,user_name FROM admin WHERE `power`=".intval($_REQUEST['user_id'])." OR id=".intval($_REQUEST['user_id']).") AS b WHERE a.user_id=b.id and ".$tiaojian." order by create_time desc";
			
			
			$data=$db->page($sql,intval($_REQUEST["index"]));
			$data['sql']=$sql;
		}else{
			$data=$db->page($sql,intval($_REQUEST["index"]));
		}
		
	}
}else{
	$type=$_REQUEST['type'];
	if($type=='details'){
		$sql='select * from client_info where id='.$_REQUEST['id'];
		$data=$db->fetch_assoc($db->query($sql));
	}else if($type=='update'){
		if($_REQUEST['user_id']==1){
			$data['flg']=false;
			$data['rspDesc']="测试账号仅用于查看数据，无法修改数据。";
		}else{
			$sql='UPDATE client_info SET ';
			foreach($_REQUEST as $key => $value){
				if(!empty($value)&&!($key=='id'||$key=='type'||$key=='user_id')){

					$sql.='`'.$key.'`="'.$value.'",';
				}
			}
			$sql=$sql.'`update_time`="'.time().'" where `id`='.$_REQUEST['id'];
			$data['flg']=$db->query($sql);
		}
	}else if($type=='submit'){
		$val='';$ky='';
		$sql='insert into client_info ';
			foreach($_REQUEST as $key => $value){
				if(!empty($value)&&!($key=='id'||$key=='type')){
					$ky.='`'.$key.'`,';
					$val.='"'.$value.'",';
				}
			}
			
			$sql.='('.$ky.'create_time) VALUES('.$val.'"'.time().'")'; 
			$data['sql']=$sql;
			$data['flg']=$db->query($sql);
	}
}

echo json_encode($data);

?>