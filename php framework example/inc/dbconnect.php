<?php
//Database Information
$db_host = "127.0.0.1"; //Host address (most likely localhost)
$db_name = "odatax"; //Name of Database
$db_user = ""; //Name of database user
$db_pass = ""; //Password for database user
$db_table_prefix = "ox_"; // Change default "ox_" to something different (but still ending with an underscore) for better security

// PDO connection
function pdoConnect(){
	// Let this function throw a PDO exception if it cannot connect
	global $db_host, $db_name, $db_user, $db_pass, $db_table_prefix;
	$db = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8", $db_user, $db_pass);
	$db->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
	$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	return $db;
}

//GLOBAL VARIABLES
$COOKIENAME = 'remotesupportsessions';
$PAGEACCESS_DIR = $_SERVER['DOCUMENT_ROOT'].'/remotesupport/';
setlocale(LC_MONETARY, 'en_US.UTF-8');
