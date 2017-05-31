<?php
	date_default_timezone_set('PRC'); 
	define("DB_URL","localhost");
	define("USER", "root");
	define("PASS", "");
	define("DB", "crm");
	define("CHARSET", "utf8");
	class connDb{
		public $dbUrl=DB_URL;//数据库的地址
		public $user=USER;//数据库的用户名
		public $pass=PASS;//数据库的密码
		public $db=DB;//数据库的密码
		public $con;//数据库的密码
		public function __construct(){
			$this->connect();
			$this->changeDb();
			$this->setQueryChar();
		}
	
		public function connect(){
			$this->con = mysql_connect($this->dbUrl,$this->user,$this->pass);
			if(!$this->con){die('链接数据库:' . mysql_error());}
		}
		public function changeDb(){
			$connDB=mysql_select_db($this->db,$this->con); //打开数据库
			if(!$connDB){
				die('选择数据库:' . mysql_error());
			}
		}
		//设置mysql返回的编码
		public function setQueryChar(){
			mysql_query("set names '".constant("CHARSET")."'");
		   //mysql_query("set names utf8");  
		}
		//返回上一条sql影响的条数
		public function mysql_rows(){
			return mysql_affected_rows();
		}
		//关闭持久化链接
		public function close(){
			mysql_close($this->con);
		}
		
		/*
		发送一条 MySQL 查询
		sql  一条sql语句
		*/
		public function query($sql){
			return mysql_query($sql);
		}
		//从结果集中取得一行作为关联数组。
		/*
			 函数返回上一步 INSERT 操作产生的 ID。
		*/
		public function insert_id(){
			
			return mysql_insert_id();
		}
		/*
			函数返回最近一条查询的信息。
			如果成功,则返回有关该语句的信息,如果失败,则返回 false。
		*/
		public function info(){
			return mysql_info($this->con);
		}
		/*
		  从结果集中取得一行作为数字数组。
		
		*/
		public function fetch_row($query){
			return mysql_fetch_row($query);
		}
		/*
		从结果集中取得一行作为关联数组。
		*/
		public function fetch_assoc($query){
			return mysql_fetch_assoc($query);
		}
		/*
		从结果集中取得列信息并作为对象返回。
		*/
		public function fetch_field($query){
			
			return mysql_fetch_field($query);
		}
		/*
		 返回结果集中行的数目
		*/
		public function num_rows($query){
			return mysql_num_rows($query);
		}
		/*
		从结果集中取得一行作为关联数组,或数字数组,或二者兼有
		*/
		public function fetch_array($query){
			$data=array();
			while($rel=mysql_fetch_array($query)){
				array_push($data,$rel);
			}
			return $data;
		}
		/*
		  返回分页数据
		  $index 默认为第一页
		  $page 默认为十条数据
		*/
		public function page($sql,$index=1,$page=10){
			$data=array();
			$data['maxPage']=ceil(($this->num_rows($this->query($sql)))/$page);
			$list=$this->fetch_array($this->query($sql.' limit '.($index-1)*$page.','.$page));
			$data['data']=$list;
			$data['index']=$index;
			return $list?$data:false;
		}
	}




?>