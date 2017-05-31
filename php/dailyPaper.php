<?php
	header('Access-Control-Allow-Origin:*');
    header('Content-Type:text/json;charset=utf-8');
    date_default_timezone_set('PRC'); 
    include_once  "./dbComm.php";
	$db=new connDb();
	$data=Array();
	if(!array_key_exists("type",$_REQUEST)){
		if(array_key_exists("index",$_REQUEST)){
			if(!array_key_exists("search",$_REQUEST)){
				$sql="SELECT a.*,b.user_name FROM date_log AS a,(SELECT id,user_name FROM admin WHERE `power`=".intval($_REQUEST['user_id'])." OR id=".intval($_REQUEST['user_id']).") AS b WHERE a.user_id=b.id order by create_time desc";
			}else{
				$search=$_REQUEST['search'];
				$startTime=$_REQUEST['startTime'];
				$endTime=$_REQUEST['endTime'];
				if(!empty($search)&&!empty($startTime)&&!empty($endTime)){
					$sql="SELECT a.*,b.user_name FROM date_log AS a,(SELECT id,user_name FROM admin WHERE `power`=".intval($_REQUEST['user_id'])." OR id=".intval($_REQUEST['user_id']).") AS b WHERE a.user_id=b.id and a.create_time>=".strtotime($startTime)." and a.create_time<=".strtotime($endTime)." and (a.company_name like '%".$_REQUEST['search']."%' OR a.service_line like '%".$_REQUEST['search']."%' OR b.user_name like '%".$_REQUEST['search']."%')order by create_time desc";
					
				}else if(empty($search)&&!empty($startTime)&&!empty($endTime)){
					$sql="SELECT a.*,b.user_name FROM date_log AS a,(SELECT id,user_name FROM admin WHERE `power`=".intval($_REQUEST['user_id'])." OR id=".intval($_REQUEST['user_id']).") AS b WHERE a.user_id=b.id and a.create_time>=".strtotime($startTime)." and a.create_time<=".strtotime($endTime)." order by create_time desc";
				}else if(empty($search)&&empty($startTime)&&!empty($endTime)){
					$sql="SELECT a.*,b.user_name FROM date_log AS a,(SELECT id,user_name FROM admin WHERE `power`=".intval($_REQUEST['user_id'])." OR id=".intval($_REQUEST['user_id']).") AS b WHERE a.user_id=b.id and  a.create_time<=".strtotime($endTime)." order by create_time desc";

				}else if(!empty($search)&&empty($startTime)&&!empty($endTime)){
					$sql="SELECT a.*,b.user_name FROM date_log AS a,(SELECT id,user_name FROM admin WHERE `power`=".intval($_REQUEST['user_id'])." OR id=".intval($_REQUEST['user_id']).") AS b WHERE a.user_id=b.id  and a.create_time<=".strtotime($endTime)." and (a.company_name like '%".$_REQUEST['search']."%' OR a.service_line like '%".$_REQUEST['search']."%' OR b.user_name like '%".$_REQUEST['search']."%')order by create_time desc";
				}else if(empty($search)&&!empty($startTime)&&empty($endTime)){
					$sql="SELECT a.*,b.user_name FROM date_log AS a,(SELECT id,user_name FROM admin WHERE `power`=".intval($_REQUEST['user_id'])." OR id=".intval($_REQUEST['user_id']).") AS b WHERE a.user_id=b.id  and a.create_time>=".strtotime($startTime)." order by create_time desc";
				}else if(!empty($search)&&!empty($startTime)&&empty($endTime)){
					$sql="SELECT a.*,b.user_name FROM date_log AS a,(SELECT id,user_name FROM admin WHERE `power`=".intval($_REQUEST['user_id'])." OR id=".intval($_REQUEST['user_id']).") AS b WHERE a.user_id=b.id and a.create_time>=".strtotime($startTime)." and (a.company_name like '%".$_REQUEST['search']."%' OR a.service_line like '%".$_REQUEST['search']."%' OR b.user_name like '%".$_REQUEST['search']."%')order by create_time desc";
				}else if(!empty($search)&&empty($startTime)&&empty($endTime)){
					$sql="SELECT a.*,b.user_name FROM date_log AS a,(SELECT id,user_name FROM admin WHERE `power`=".intval($_REQUEST['user_id'])." OR id=".intval($_REQUEST['user_id']).") AS b WHERE a.user_id=b.id and (a.company_name like '%".$_REQUEST['search']."%' OR a.service_line like '%".$_REQUEST['search']."%' OR b.user_name like '%".$_REQUEST['search']."%')order by create_time desc";
				}

			}
			$data=$db->page($sql,$_REQUEST['index']);
			$data['sql']=$sql;
		}else{
			$sql="SELECT a.*,b.user_name FROM date_log AS a,(SELECT id,user_name FROM admin WHERE `power`=".intval($_REQUEST['user_id'])." OR id=".intval($_REQUEST['user_id']).") AS b WHERE a.user_id=b.id order by create_time desc";
			$data=$db->page($sql);
		}
		
	}else{
		if($_REQUEST['type']=='submit'){
			$val='';$ky='';
			$sql='insert into date_log ';
			foreach($_REQUEST as $key => $value){
				if(!empty($value)&&$key!=='type'){
					$ky.='`'.$key.'`,';
					$val.='"'.$value.'",';
				}
			}
			$organization_number='WP'.date('YmdHis',time()).rand(10000,99999);
			$sql.='('.$ky.'`create_time`,`campany_code`) VALUES('.$val.'"'.time().'","'.$organization_number.'")'; 
			$data['sql']=$sql;
			$data['flg']=$db->query($sql);
		}else if($_REQUEST['type']=='selectAdd'){
			$sql='select * from date_log where user_id='.intval($_REQUEST['user_id']).' and create_time>='.strtotime(date("Y-m-d")).' and create_time<'.strtotime(date("Y-m-d",time()+86400));
			$assoc=$db->fetch_assoc($db->query($sql));
			if($assoc){
				$data["flg"]=true;
				$data["id"]=$assoc["id"];
			}else{
				$data["flg"]=false;
			}
		
		}else if($_REQUEST['type']=='update'){
			if($_REQUEST['user_id']==1){
				$data['flg']=false;
				$data['rspDesc']="测试账号，您无权修改数据。";
			}else{
				$val='';$ky='';
				$sql='update date_log SET ';
				foreach($_REQUEST as $key => $value){
					if(!empty($value)&&($key!='type'&&$key!='id')){
						$sql.='`'.$key.'`="'.$value.'",';
						$data[$key]=$key;
					}
				}
				$sql.='`update_time`="'.time().'" where id='.$_REQUEST['id'];
				$data['flg']=$db->query($sql);
			}
		}else if($_REQUEST['type']=='updatePostil'){
			$sql='update date_log SET `postil`="'.$_REQUEST["postil"].'",`postil_type`=1 where id='.intval($_REQUEST["id"]);
			$data['flg']=$db->query($sql);
			$data['sql']=$sql;
		}else if($_REQUEST['type']=='select'){
			$sql='select * from date_log where id='.$_REQUEST['id'];
			$data=$db->fetch_assoc($db->query($sql));
		}
	}
	echo json_encode($data);
?>