<?php
header('Access-Control-Allow-Origin:*');
header('Content-Type:text/json;charset=utf-8');
include_once  "./dbComm.php";
$db=new connDb();
$data=Array();
if(!array_key_exists("type",$_REQUEST)){
	if(array_key_exists("index",$_REQUEST)){
			if(!array_key_exists("search",$_REQUEST)){
				$sql="SELECT a.*,b.user_name FROM monthly AS a,(SELECT id,user_name FROM admin WHERE `power`=".intval($_REQUEST['user_id'])." OR id=".intval($_REQUEST['user_id']).") AS b WHERE a.user_id=b.id order by create_time desc";
			}else{
				$search=$_REQUEST['search'];
				$startTime=$_REQUEST['startTime'];
				$endTime=$_REQUEST['endTime'];
				if(!empty($search)&&!empty($startTime)&&!empty($endTime)){
					$sql="SELECT a.*,b.user_name FROM monthly AS a,(SELECT id,user_name,department FROM admin WHERE `power`=".intval($_REQUEST['user_id'])." OR id=".intval($_REQUEST['user_id']).") AS b,branch as c WHERE a.user_id=b.id and b.department=c.id and a.create_time>=".strtotime($startTime)." and a.create_time<=".strtotime($endTime)." and (b.user_name like '%".$_REQUEST['search']."%' OR c.branch_name like '%".$_REQUEST['search']."%')order by create_time desc";
					
				}else if(empty($search)&&!empty($startTime)&&!empty($endTime)){
					$sql="SELECT a.*,b.user_name FROM monthly AS a,(SELECT id,user_name FROM admin WHERE `power`=".intval($_REQUEST['user_id'])." OR id=".intval($_REQUEST['user_id']).") AS b WHERE a.user_id=b.id and a.create_time>=".strtotime($startTime)." and a.create_time<=".strtotime($endTime)." order by create_time desc";
				}else if(empty($search)&&empty($startTime)&&!empty($endTime)){
					$sql="SELECT a.*,b.user_name FROM monthly AS a,(SELECT id,user_name FROM admin WHERE `power`=".intval($_REQUEST['user_id'])." OR id=".intval($_REQUEST['user_id']).") AS b WHERE a.user_id=b.id and  a.create_time<=".strtotime($endTime)." order by create_time desc";

				}else if(!empty($search)&&empty($startTime)&&!empty($endTime)){
					$sql="SELECT a.*,b.user_name FROM monthly AS a,(SELECT id,user_name,department FROM admin WHERE `power`=".intval($_REQUEST['user_id'])." OR id=".intval($_REQUEST['user_id']).") AS b,branch as c WHERE a.user_id=b.id  and b.department=c.id and a.create_time<=".strtotime($endTime)." and (c.branch_name like '%".$_REQUEST['search']."%' OR b.user_name like '%".$_REQUEST['search']."%')order by create_time desc";
				}else if(empty($search)&&!empty($startTime)&&empty($endTime)){
					$sql="SELECT a.*,b.user_name FROM monthly AS a,(SELECT id,user_name FROM admin WHERE `power`=".intval($_REQUEST['user_id'])." OR id=".intval($_REQUEST['user_id']).") AS b WHERE a.user_id=b.id  and a.create_time>=".strtotime($startTime)." order by create_time desc";
				}else if(!empty($search)&&!empty($startTime)&&empty($endTime)){
					$sql="SELECT a.*,b.user_name FROM monthly AS a,(SELECT id,user_name,department FROM admin WHERE `power`=".intval($_REQUEST['user_id'])." OR id=".intval($_REQUEST['user_id']).") AS b,branch as c WHERE a.user_id=b.id and b.department=c.id and a.create_time>=".strtotime($startTime)." and (c.branch_name like '%".$_REQUEST['search']."%' OR b.user_name like '%".$_REQUEST['search']."%')order by create_time desc";
				}else if(!empty($search)&&empty($startTime)&&empty($endTime)){
					$sql="SELECT a.*,b.user_name FROM monthly AS a,(SELECT id,user_name,department FROM admin WHERE `power`=".intval($_REQUEST['user_id'])." OR id=".intval($_REQUEST['user_id']).") AS b,branch as c WHERE a.user_id=b.id and c.id=b.department and ( c.branch_name like '%".$_REQUEST['search']."%' OR b.user_name like '%".$_REQUEST['search']."%')order by create_time desc";
				}

			}
			$data=$db->page($sql,$_REQUEST['index']);
			
		}else{
			$sql="SELECT a.*,b.user_name FROM monthly AS a,(SELECT id,user_name FROM admin WHERE `power`=".intval($_REQUEST['user_id'])." OR id=".intval($_REQUEST['user_id']).") AS b WHERE a.user_id=b.id order by create_time desc";
			$data=$db->page($sql);
		}	
		
		
}else{
	if($_REQUEST['type']=="submit"){
		$val='';$ky='';
		$month_id='WP'.date('YmdHis',time()).rand(10000,99999);
		$sql='insert into monthly ';
		foreach($_REQUEST as $key => $value){
			if(!empty($value)&&$key!=='type'){
				$ky.='`'.$key.'`,';
				$val.='"'.$value.'",';
			}
		}
		$sql.='('.$ky.'`create_time`,`monthly_id`) VALUES('.$val.'"'.time().'","'.$month_id.'")'; 
		$data['flg']=$db->query($sql);
	}else if($_REQUEST['type']=="select"){
		$sql='SELECT a.*,b.user_name AS `user_name`,c.branch_id AS branch_id,c.branch_name AS branch_name FROM monthly a,admin b,branch c WHERE a.user_id=b.id AND a.id='.$_REQUEST["id"].' AND b.department=c.id ORDER BY a.create_time DESC';
		
		$data=$db->fetch_assoc($db->query($sql));
	}else if($_REQUEST["type"]=="selectAdd"){
		$sql='SELECT * FROM monthly where user_id='.$_REQUEST["user_id"].' and create_time>='.strtotime(date("Y-m-01",time())).' and create_time<'.strtotime(date("Y-m-d",strtotime(date("Y-m-01",time()) ."+1 month")));
		$assoc=$db->fetch_assoc($db->query($sql));
		if($assoc){
			$data["flg"]=true;
			$data["id"]=$assoc["id"];
		}else{
			$data["flg"]=false;
		}
		
	}else if($_REQUEST['type']=="update"){
		$not_channel=intval($_REQUEST['not_channel']);
		$channel=intval($_REQUEST['channel']);
		$sql='update monthly set `actual_volume`='.$_REQUEST['actual_volume'].',`channel`='.$channel.',`not_channel`='.$not_channel.',actual_quantity='.($not_channel+$channel).' where id='.$_REQUEST['id'];
		$data["sql"]=$sql;
		$data["flg"]=$db->query($sql);
	}else if($_REQUEST['type']=="selectLine"){
		 $sql='SELECT a.*,b.user_name AS `user_name`,c.branch_id AS branch_id,c.branch_name AS branch_name FROM monthly a,admin b,branch c WHERE a.user_id=b.id AND a.id='.$_REQUEST["id"].' AND b.department=c.id ORDER BY a.create_time DESC';
		if($d=$db->fetch_assoc($db->query($sql))){	
			$sql1='SELECT a.*,b.user_name AS `user_name`,c.branch_id AS branch_id,c.branch_name AS breanck_name FROM monthly a,admin b,branch c WHERE a.user_id=b.id and a.id!='.intval($_REQUEST["id"]).'  AND b.department=c.id AND c.`branch_id`="'.$_REQUEST["branch"].'" and a.create_time>='.strtotime(date("Y-m-01",$d["create_time"])).' and a.create_time<'.strtotime(date("Y-m-d",strtotime(date("Y-m-01",$d["create_time"]) ."+1 month")));
			$data["list"]=$db->fetch_array($db->query($sql1));
			$data["data"]=$d;
		}
	}
}	

echo json_encode($data);

?>