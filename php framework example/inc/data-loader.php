<?php
/* PHP TROUBLESHOOTING uncomment this and comment out json_encode below [ echo json_encode($objOut) ] */
/*
function my_error_handler(){
    $error = error_get_last();
    header('Content-Type: application/json');
    echo json_encode($error);
}
register_shutdown_function('my_error_handler');
set_error_handler('my_error_handler');
*/
error_reporting(0);

$contentType = isset($_SERVER["CONTENT_TYPE"]) ? trim($_SERVER["CONTENT_TYPE"]) : '';
if (!$contentType === "application/json"){die();}
header('Content-Type: application/json'); //set header

  //Receive the RAW post data.
  $content = trim(file_get_contents("php://input"));
  $decoded = json_decode($content, true);

  if(is_array($decoded)) { //check if we got an array

    // require functions
    require_once('func.php');
    $objIn = $decoded['objJson']; //all the data

/* === CHECK [1] === */
/* check href parameters for pass reset or other things */
if(getHrefString( 'reset', $objIn ) != '' && $objIn['fetchID'] !=300)
$objIn['fetchID'] = 306; //redirect to reset the password

/* === CHECK [2] === */
//NON LOGIN PAGES access
$nonLoginpage = false;
$allaccessPage =  array(300, 301, 302, 303,304,305,306,307,308,309,350); //any page id # that you wish to give access without login
if (in_array($objIn['fetchID'], $allaccessPage))
   $nonLoginpage = true;

/* === CHECK [3] === */
//CHECK USER LOGIN:::
$userCheck = currentUser();
if(!empty($userCheck['error']) && $nonLoginpage === false){

      $objIn['fetchID'] = 300;

 }//!empty($userCheck['error']

 //local/server data (make them available for all functions above)
 $objIn['serverdata'] = $userCheck;
//require all pagesToShow
require_once('process-authentication.php');
require_once('process-dashboard.php');
require_once('process-users.php');
require_once('process-companies.php');
require_once('process-account.php');


/* Check user access, admin access only pages */
if($userCheck['access'] == 1){

  if($objIn['fetchID'] >= 100 && $objIn['fetchID'] < 200){ //companies/clients

     $objOut = companies($objIn);

  }
  if($objIn['fetchID'] >= 200 && $objIn['fetchID'] < 300){ //users
      $objOut = users($objIn);

  }
}//$userCheck['access'] === 1


/* all user other user pages/functions below */

     if($objIn['fetchID'] >= 0 && $objIn['fetchID'] < 100){ //dashboard

         $objOut = dashboard($objIn);

     }

     if($objIn['fetchID'] >= 300 && $objIn['fetchID'] < 400){ //authentication
         $objOut = authenticate($objIn);

     }
     if($objIn['fetchID'] >= 400 && $objIn['fetchID'] < 500){ //account
         $objOut = account($objIn);

     }

   $objOut['url'] = 'inc/data-loader.php';
   echo json_encode($objOut);

 }else{
   die();
 }//is_array($decoded)

?>
