<?php
    header('Content-Type:text/json;charset=utf-8');
    include_once  "./dbComm.php";
	$db=new connDb();
	$data=Array();
	$data["company"]=$db->fetch_array($db->query("select id,company_name from company"));
	$data["department"]=$db->fetch_array($db->query("select id,de_name from department order by id desc"));

	$data["de_company"]="";
	if(empty($_REQUEST)){
		$sql="select mobile,user_name,tel,email from users";
		
		$data["list"]=$db->page($sql,$index=1,$page=15);
	}else{
		//公司 company 部门de search
		if(array_key_exists("index",$_REQUEST)){
			$pageIndex=intval($_REQUEST["index"]);
		}else{
			$pageIndex=1;
		}
		
		$sql="select mobile,user_name,tel,email from users";
		$data["flg"]=isset($_REQUEST["company"]);

	
		if(array_key_exists("company",$_REQUEST)){
			$data["de_company"]=$_REQUEST["company"];
			$sql.=" where company=".$_REQUEST["company"];
		}
		

		$data["sql"]=$sql;

		$data["list"]=$db->page($sql,$index=$pageIndex,$page=15);
		
	}
	echo json_encode($data);
?>