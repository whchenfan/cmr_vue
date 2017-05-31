<?php
    header('Access-Control-Allow-Origin:*');
	include_once  "./dbComm.php";
	$db=new connDb();
	$data=Array();
	$sql='SELECT * FROM `admin` WHERE user_name="'.$_REQUEST['user'].'" AND `password`="'.$_REQUEST['pass'].'"';
	$user=$db->fetch_assoc($db->query($sql));
    if($user){
    	$data["flg"]=true;
    	$data["user"]=$user;
    }else{
    	$data["flg"]=false;
    	$data["user"]=(object)Array();
    }

   echo json_encode($data);
?>