<?php
require_once('dbconnect.php'); //get DB conn

/* authentication */
function login($dataArr){
  global $COOKIENAME;
  global $db_table_prefix;
  global $PAGEACCESS_DIR;
  /*get post data */
	$out['error'] = '';
  $out['userid'] = "";

  $username = isset($dataArr['username']) ? trim_all($dataArr['username']) : '';
  $password = isset($dataArr['password']) ? trim_all($dataArr['password']) : '';

/*login authentication*/
if($username !='' && $password !=''){


  $result = selectArray("users",array("id","username","password","active"),"","WHERE username ='".$username."' OR email='".$username."'");
  $out['userid'] = $result['q'][0]['id']; //used
  if (!empty($result['q']) && empty($result['error'])){

    //if username is correct than check password
    if(password_verify($password, $result['q'][0]['password']) && $result['q'][0]['active'] == 1){

      //do it untill we get the right session (chances are it will only run once)
      do {
           $sessionVal = sessionValueCheck();  //get a session value
      } while ($sessionVal != 1);

      if($dataArr['staysignedin'] == 1 ){
        $time = time()+31556926; /* expire in 1 year */
      }else{
        //$time = time()+28800;  /* expire in 8 hours */
        $time = time()+31556926; /* expire in 1 year */
      }
      $domain = ($_SERVER['HTTP_HOST'] != 'localhost') ? $_SERVER['HTTP_HOST'] : false; //check ift's on localhost or domain, get it
      setcookie($COOKIENAME, $sessionVal);
      setcookie($COOKIENAME, $sessionVal, $time);
      setcookie($COOKIENAME, $sessionVal, $time, '/', $domain, false);  //set the cookies

      //insert/update session onto the database
      $result = updateArray("users",array('session'=>$sessionVal),"WHERE id =".$result['q'][0]['id']);

       if(!empty($result['error'])){
         $out['error']="Sorry, something went wrong, please contact administrator.";//.$result['error'];
       }

    }else{
      $out['error']="Wrong usename or password!";
    }

  }else{
    $out['error'] = 'Wrong username or password!';//$result['error'];
  }
}else{
  $out['error'] = "No data provided!";
}//login authentication

return $out;
}//login()

//GET USER INFORMATION IF AVAILABLE /// LOGIN CHECK
function currentUser(){
global $COOKIENAME;
global $db_table_prefix;
global $PAGEACCESS_DIR;
$session = '';
$out['userid'] = "";
$out['session'] = "";
$out['firstname'] = "";
$out['lastname'] = "";
$out['email'] = "";
$out['access'] = "";
$out['error'] = '';
$out['lead_access'] = "";

if(isset($_COOKIE[$COOKIENAME]) && strlen(trim($_COOKIE[$COOKIENAME])) != 0) {  //Check if there is any cookie
$session = trim($_COOKIE[$COOKIENAME]); //get individual cookie
}else{
  //if the user just signed in, check for it
        $headers = headers_list();
        foreach ($headers as $hdr) {
            $hdrArr = explode(":", $hdr);
            if ($hdrArr[0] == 'Set-Cookie') {
                $valArr = explode("=", $hdrArr[1]);
                if($COOKIENAME == trim($valArr[0]))
                   $session = trim(explode(";", $valArr[1])[0]);
            }
        }
}

if(!empty($session)){

$result = selectArray("users",array("id","session","firstname","lastname","active","email","access","lead_access"),"","WHERE session ='".$session."'");

if (strlen($result['q'][0]['session']) != 0 && $session === $result['q'][0]['session'] && $result['q'][0]['active'] == 1 && empty($result['error'])){

  //access this variable in anypage if needed like this ->  $GLOBALS['userid'];
  $out['userid'] = $result['q'][0]['id'];
  $out['session'] = $result['q'][0]['session'];
  $out['firstname'] = $result['q'][0]['firstname'];
  $out['lastname'] = $result['q'][0]['lastname'];
  $out['access'] = $result['q'][0]['access'];
  $out['email'] = $result['q'][0]['email'];
  $out['lead_access'] = $result['q'][0]['lead_access'];

}else{
  $out['error'] = 1; //$result['error'];
}
}else{
 $out['error'] = 2;

}

return $out;

}

//CHECK THE url $_GET data
function getHrefString( $parm, $dataArr ) {
    $result = "";
  if (($pos = strpos($dataArr['href'], "?")) !== FALSE) {
       $string = substr($dataArr['href'], $pos+1);
       $array = explode('&', $string);
       if(!empty($array)){
         foreach ($array as &$value) {
               $a = explode('=', $value);

                if(!empty($a)){
                  if($a[0] == $parm)
                  $result = $a[1];
                }
           }
       }
}
return $result;
}
//CHECK THE url $_GET data
function getHashString($dataArr ) {
    $result = "";
  if (($pos = strpos($dataArr['hash'], "#")) !== FALSE) {
       $result = substr($dataArr['hash'], $pos+1);
}
return $result;
}

//RESET Password
function resetpass($dataArr){
  $out['error'] = '';
  if(!empty($dataArr['reset'])){
    $result = selectArray("users",array("id","forgotpass","active","timestamp"),"","WHERE forgotpass ='".$dataArr['reset']."' AND UNIX_TIMESTAMP(timestamp) < (CURRENT_TIMESTAMP() - 3600*12)"); //12 hour timestamp check

    if (!empty($result['q']) && empty($result['error'])){

      if(!empty($dataArr['password'])){
          $passHash = password_hash($dataArr['password'], PASSWORD_DEFAULT);
          $result = updateArray("users",array('password'=>$passHash,'forgotpass'=>''),"WHERE id =".$result['q'][0]['id']);

         if(!empty($result['error']))
           $out['error']="Sorry, something went wrong, please contact administrator.";//.$result['error'];

      }

    }else{
      $out['error'] = 'Session expired or bad value, please try again or contatct the administrator';
    }
  }else{
    $out['error'] = 'Missing string value';
  }
  return $out;
}
//SIGN UP
function signup($dataArr){
  /*get post data */
  $pass = false;
	$out['error'] = '';
  $dataArr['username'] = isset($dataArr['username']) ? trim_all($dataArr['username']) : '';
  $dataArr['password'] = isset($dataArr['password']) ? trim_all($dataArr['password']) : '';
  $dataArr['email'] = isset($dataArr['email']) ? trim_all($dataArr['email']) : '';
  $dataArr['firstname'] = isset($dataArr['firstname']) ? trim_all($dataArr['firstname']) : '';
  $dataArr['lastname'] = isset($dataArr['lastname']) ? trim_all($dataArr['lastname']) : '';
  $dataArr['active'] = 1;
  $dataArr['access'] = 0;
  /*signup new user field check*/
  if($dataArr['username'] !='' && $dataArr['password'] !='' && $dataArr['email'] !=''){
   //check if username/email if it exists
    $result = selectArray("users",array("username","email"),"","WHERE username ='".$dataArr['username']."' OR email = '".$dataArr['email']."'");
    if (isset($result['q']) && !empty($result['q'])){
         $out['error'] = "Username or email address already used!";
      }else{
        //secure the password [hash]
         $dataArr['password'] = password_hash($dataArr['password'], PASSWORD_DEFAULT);

         //finally insert data
         $result = insertArray("users",$dataArr);
         if(!empty($result['error']) || empty($result['q'][0]['id'])){
          $out['error'] = $result['error'];
         }

      }
  }else{
    $out['error'] = "Missing data!";
  }//field empty check

  return $out;

}//signup
//GET FILES FROM A SPECIFIED DIRECTORY
function dirFiles($dir,$filters)
{
    $handle=opendir($dir);
    $files=array();
    if ($filters == "all"){while(($file = readdir($handle))!==false){$files[] = $file;}}
    if ($filters != "all")
    {
        $filters=explode(",",$filters);
        while (($file = readdir($handle))!==false)
        {
            for ($f=0;$f<sizeof($filters);$f++):
                $system=explode(".",$file);
                if ($system[1] == $filters[$f]){$files[] = $file;}
            endfor;
        }
    }
    closedir($handle);
    return $files;
}


//GET THE right session for login
function sessionValueCheck(){
	global $db_table_prefix;
	$len = rand(15,27); // randomized length of the string
	$session = substr(str_shuffle(str_repeat('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', mt_rand(1,10))),1,$len); //generate a random session

	//check is session by any chance already exists:::
	$db = pdoConnect();
	$sql = $db->prepare("SELECT COUNT(*) FROM {$db_table_prefix}users WHERE session = ? LIMIT 1");
	$sql->execute(array("$session"));

	if($sql->fetchColumn()){$result = 1;}
	else{$result = $session;}
	$db = null;

	return $result;
}


// func to send emails
function sendMyMail($mailToArr, $mailSubject, $mailMessageArr){
     global $db_table_prefix;
     $out['error'] = '';
     //loop through each email

			foreach($mailToArr as $email) //loop over values
			{

				// Message
				$message = '
				<html>
				<head>
				  <title>'.$mailMessageArr[0].'</title>
				</head>
				<body>
				  <p>'.$mailMessageArr[1].'</p>
				  <table>
					<tr>
					  <th>'.$mailMessageArr[2].'</th>
					</tr>
				  </table>
				  <br>
				  <p>
				  Copyright ©  Company Name, All rights reserved.
				  <p>
				</body>
				</html>
				';

				// To send HTML mail, the Content-type header must be set
				$headers[] = 'MIME-Version: 1.0';
				$headers[] = 'Content-type: text/html; charset=iso-8859-1';

				// Additional headers
				//$headers[] = 'To: Mary <mary@example.com>, Kelly <kelly@example.com>';
				$headers[] = 'From: CompanyName <no-reply@example.com>';
				//$headers[] = 'Cc: someemail@gmail.com';
				//$headers[] = 'Bcc: otheremail@gmail.com';

				// Mail it
				$retval = mail($email, $mailSubject, $message, implode("\r\n", $headers));


						 if( $retval != true )
							  $out['error'] = 'Error sending email code: [2]';//.error_get_last()['message'];

			}

    return $out;
}

//function to check for exact match words in a comma delimited strings
function stringContains($string, $needle)
{
    $arr = explode(',',$string);
    if(in_array($needle,$arr)){
        return true;
    }else{
		return false;
	}
}

//Trim all the white spaces, tabs and other stuff
function trim_all( $str , $what = NULL , $with = ' ' )
{
	if( $what === NULL )
	{
		//	Character      Decimal      Use
		//	"\0"            0           Null Character
		//	"\t"            9           Tab
		//	"\n"           10           New line
		//	"\x0B"         11           Vertical Tab
		//	"\r"           13           New Line in Mac
		//	" "            32           Space

		$what	= "\\x00-\\x20";	//all white-spaces and control chars
	}

	return trim( preg_replace( "/[".$what."]+/" , $with , $str ) , $what );
}


/*Get Table Columns Names */
function getMaxID($tablename) {
	$out['error'] = '';
	$out['q'] = "";
try {
	$db = pdoConnect();
	global $db_table_prefix;
	/* Get column names */
	$query = $db->prepare("SELECT MAX(id) FROM {$db_table_prefix}$tablename");
	$query->execute();
	$max_id = $query->fetchAll(PDO::FETCH_COLUMN);
	$out['q'] = $max_id;

	//Close connection
	$conn = null;

	} catch(PDOExcepetion $e) {
 	  $out['error'] ="DB Error: ".$e->getMessage();
	}
  catch(Exception $e)
  {
      $out['error'] ="DB Error exception: ".$e->getMessage();
  }
  finally {
    $db = null;
    return $out;
}
}

/*Get Table Columns Names */
function getColumns($tablename) {
	$out['error'] = '';
	$out['q'] = "";
try {
	$db = pdoConnect();
	global $db_table_prefix;
	/* Get column names */
	$query = $db->prepare("DESCRIBE {$db_table_prefix}$tablename");
	$query->execute();
	$table_names = $query->fetchAll(PDO::FETCH_COLUMN);
	$out['q'] = $table_names;

	//Close connection
	$conn = null;

	} catch(PDOExcepetion $e) {
 	   $out['error'] ="DB Error: ".$e->getMessage();
	}
  catch(Exception $e)
  {
      $out['error'] ="DB Error exception: ".$e->getMessage();
  }
  finally {
    $db = null;
    return $out;
}
}

/*Select data through array */
function selectArray($table,$array,$joins,$where) {
	global $db_table_prefix;
	$out['error'] = '';
	$out['q'] = "";
try {
	$db = pdoConnect();

	$array = array_filter($array);/*disallow blank fields*/

    $sql = "SELECT ".implode(",",$array)." FROM ".$db_table_prefix.$table;
	  $sql .= " ".$joins;
    $sql .= " ".$where;
    $q = $db->prepare($sql);
    $q->execute();
	  $out['q'] = $q->fetchAll(PDO::FETCH_ASSOC);

	} catch(PDOExcepetion $e) {
 	   $out['error'] ="DB Error: ".$e->getMessage();
	}
  catch(Exception $e)
  {
      $out['error'] ="DB Error exception: ".$e->getMessage();
  }
  finally {
    $db = null;
    return $out;
}
}

/*Select data through array with bind values */
function selectBindParmArray($table,$array,$joins,$where,$paramsArr) {
	global $db_table_prefix;
	$out['error'] = '';
	$out['q'] = "";
  $out['foundRows'] = 0;
try {
	$db = pdoConnect();

	  $array = array_filter($array);/*disallow blank fields*/

    $sql = "SELECT SQL_CALC_FOUND_ROWS ".implode(",",$array)." FROM ".$db_table_prefix.$table;
	  $sql .= " ".$joins;
    $sql .= " ".$where;

   $q = $db->prepare($sql);

   /*example arr: ["%{$var1}%", (int)$var2, , $val3 ]  */
   foreach ($paramsArr as $key => &$val) {

           switch (true) {
              case is_bool($val):
                   $var_type = PDO::PARAM_BOOL;
                   break;
               case is_int($val):
                   $var_type = PDO::PARAM_INT;
                   break;
               case is_null($val):
                   $var_type = PDO::PARAM_NULL;
                   break;
               default:
                   $var_type = PDO::PARAM_STR;
           }

       $q->bindParam($key+1, $val, $var_type);
   }
   $q->execute();
   $out['q'] = $q->fetchAll(PDO::FETCH_ASSOC);
   $rows= $db->query('SELECT FOUND_ROWS()');
   $out['foundRows'] = (int) $rows->fetchColumn();


	} catch(PDOExcepetion $e) {
 	   $out['error'] ="DB Error: ".$e->getMessage();
	}
  catch(Exception $e)
  {
      $out['error'] ="DB Error exception: ".$e->getMessage();
  }
  finally {
    $db = null;
    return $out;
}
}

/* Insert Data through Array */
function insertArray($table,$array){
	global $db_table_prefix;
  $out['error'] = '';
	$out['id'] = "";
	$array = array_filter($array);/*disallow blank fields*/
	try {
	    $db = pdoConnect();

	    $keys = array_keys($array);
		foreach($array as $key => $value){
		 $columns .= "`".$key."`,";
		}
		$columns = rtrim($columns, ',');

	    $sql = "INSERT INTO `".$db_table_prefix.$table."` (".$columns.")";
	    $sql .= " VALUES ( :".implode(", :",$keys).")";
	    $q = $db->prepare($sql);
	    $q->execute($array);
		  $id = $db->lastInsertId();
		  $out['id'] = $id;

	    }
	catch(PDOException $e)
	    {
	    $out['error'] ="DB Error: ".$e->getMessage();
	    }
      catch(Exception $e)
      {
          $out['error'] ="DB Error exception: ".$e->getMessage();
      }
      finally {
        $db = null;
        return $out;
    }
}

/* Update Data through Array */
function updateArray($table,$array,$where){
	global $db_table_prefix;
    $out['error'] = '';
	//$array = array_filter($array); /*disallow blank fields*/
	try {
	    $db = pdoConnect();

	    $keys = array_keys($array);
	    $sql = "UPDATE `".$db_table_prefix.$table."` SET ";
  		foreach($array as $key => $value){
  		 $sql .= "`".$key."` = :".$key.",";
  		}
		  $sql = rtrim($sql, ',');
		//$sql .=  implode(" = :",$keys);
		$sql .= " ".$where;
	    $q = $db->prepare($sql);
	    $q->execute($array);
		  $out['q'] = $q->rowCount();

	    }
	catch(PDOException $e)
	    {
	    $out['error'] ="DB Error: ".$e->getMessage();
	    }
      catch(Exception $e)
      {
          $out['error'] ="DB Error exception: ".$e->getMessage();
      }
      finally {
        $db = null;
        return $out;
    }
}

/* Update Data through Array */
function deleteArray($table,$where){
	global $db_table_prefix;
    $out['error'] = '';
	//$array = array_filter($array); /*disallow blank fields*/
	try {
	    $db = pdoConnect();

	    $sql = "DELETE FROM `".$db_table_prefix.$table."` ";
		  $sql .= " ".$where;
	    $q = $db->prepare($sql);
	    $q->execute();

	    }
	catch(PDOException $e)
	    {
	    $out['error'] ="DB Error: ".$e->getMessage();
	    }
      catch(Exception $e)
      {
          $out['error'] ="DB Error exception: ".$e->getMessage();
      }
      finally {
        $db = null;
        return $out;
    }
}

/* Replace Data through Array */
function replaceArray($table,$array){
	global $db_table_prefix;
    $out['error'] = '';
	//$array = array_filter($array); /*disallow blank fields*/
	try {
	    $db = pdoConnect();

	   $keys = array_keys($array);
		 $sql = "REPLACE INTO `".$db_table_prefix.$table."` SET ";
		 foreach($array as $key => $value){
		  $sql .= "`".$key."` = ?,";
		 }
		 $sql = rtrim($sql, ',');
		 $q = $db->prepare($sql);
		 $q->execute($array);

	    }
	catch(PDOException $e)
	    {
	    $out['error'] ="DB Error: ".$e->getMessage();
	    }
      catch(Exception $e)
      {
          $out['error'] ="DB Error exception: ".$e->getMessage();
      }
      finally {
        $db = null;
        return $out;
    }
}

/* Search multideminisional array for a specific value and return corresponding result */
function searcharray($value, $key, $array) {
   foreach ($array as $val) {
       if ($val[$key] == $value) {
           return $val;
       }
   }
   return null;
}
/* Search array of objects */
function searchArrOfObj(array $arr, $id) {
    foreach ($arr as $k => $v) {
        if ($v->vendorid == $id)
            return true;
    }
    return false;
}

/*logut */
function logout($id){
  global $db_table_prefix;
  $out['error'] = '';

     // unset all cookies if any
     $host = explode('.', $_SERVER['HTTP_HOST']);
   while ($host) {
       $domain = '.' . implode('.', $host);

       foreach ($_COOKIE as $name => $value) {
           setcookie($name, '', 1, '/', $domain);
       }
       array_shift($host);
   }

  //get user ID
  if($id != ''){

  	//delete the session on user db too
    $out = updateArray("users",array('session'=>''), "WHERE id=".$id);

  }else{
    $out['error'] = 'logout failed: [1]';
  }
return $out;
} //logut()
function CopyRight(){
  /*copy right footer */
  return '<div id="footer">&copy; Company Name '. ((1800 != date('Y')) ? "1800 - " . date('Y') : "").' All Rights Reserved.<span class="no-print"><span></div>';
}
