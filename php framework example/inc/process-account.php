<?php

function account($objIn){
  $objOut[] = array(); /* create an empty array fro return */
/*check if the subDataID is set, change the case */
if(isset($objIn['subDataID']))
   $objIn['fetchID'] = $objIn['subDataID'];
switch ($objIn['fetchID']) {
case 400: //users
case 401:

if($objIn['dataOrder'] == 'update' && !empty($objIn['data'])){


     $result = updateArray("users",$objIn['data'], "WHERE id=".$objIn['id']);
     if($result['error'] == ""){
       $objOut['alerts'] = array(
                  'alertmsg' => "Data saved successfully",
                  'alertstatus' => 3
                );
                //reload the data
                $objIn['dataOrder'] = "";
     }else{
       $objOut['alerts'] = array(
                  'alertmsg' => "Could not save the data: ".$result['error'],
                  'alertstatus' => 4
                );
     }

}//save

if($objIn['dataOrder'] == 'edit'){
  if(empty($objIn['id'])){
    $objOut['alerts'] = array(
               'alertmsg' => "Missing information!",
               'alertstatus' => 4
             );

      }else{
      $result = selectArray('users',array("id","firstname","lastname","username","email"),"","WHERE id =".(int)$objIn["id"] );


      $objOut['dialogbox'] = array( //table, form, list, etc.
                'fetchID' => 401,

                'data' => array('headtitle' => '<span style="padding:10px;">edit user</span>', //you can use html (optional)
                                'columns' => array('firstname'=>['First-name','required',''], //columns (color) provide [min,max,ormin_max] then values and color
                                                  'lastname'=>['Last-name','required',''],
                                                  'username'=>['Username','required',''],
                                                  'email'=>['Email','required','email']
                                                 ),
                                'rows' => $result['q']

                              ),
                'settings' => array(//'search' => true, //show search (optional)
                                    'buttons' => array('delete' =>'delete account','update' =>'save'), //show buttons (optional)
                        )
                );
      }

}//edit


if($objIn['dataOrder'] == 'pass'){

      $objOut['dialogbox'] = array( //table, form, list, etc.
                'fetchID' => 401,

                'data' => array('headtitle' => '<span style="padding:10px;">reset password</span>', //you can use html (optional)
                                'columns' => array('oldpass'=>['old password','required','password'], //columns (color) provide [min,max,ormin_max] then values and color
                                                  'password'=>['new password','required','password'],
                                                  'repassword'=>['re-enter password','required','password'],
                                                 ),

                              ),
                'settings' => array(//'search' => true, //show search (optional)
                                    'buttons' => array('passchange' =>'submit'), //show buttons (optional)
                        )
                );

}//pass
if($objIn['dataOrder'] == 'passchange'){
 $error = '';
  $result = selectArray("users",array("id","password"),"","WHERE id=".(int)$objIn['serverdata']['userid']);

  if (!empty($result['q']) && empty($result['error'])){

    //check passwords
    if(password_verify($objIn['data']['oldpass'], $result['q'][0]['password'])){
       if(!empty($objIn['data']['password'])){
         $newpass = password_hash($objIn['data']['password'], PASSWORD_DEFAULT);
         $result = updateArray("users",array('password'=>$newpass,'forgotpass'=>''),"WHERE id =".$result['q'][0]['id']);

        if(!empty($result['error']))
          $error="Sorry, something went wrong, please contact administrator.";//.$result['error'];

       }else{
         $error = 'Empty or bad value, please try again or contatct the administrator';
       }

    }else{
      $error = 'Old password does not match!';
    }

}
if($error == ""){
  $objOut['alerts'] = array(
             'alertmsg' => "Password updated successfully",
             'alertstatus' => 3
           );
}else{
  $objOut['alerts'] = array(
             'alertmsg' => $error,
             'alertstatus' => 4
           );
}
}//passchange


if($objIn['dataOrder'] == 'delete'){

        $result = deleteArray("users", "WHERE id=".(int)$objIn['serverdata']['userid']);
          //ALERTS
        if($result['error'] == ""){
          $objOut['alerts'] = array(
                     'alertmsg' => "Data deleted successfully",
                     'alertstatus' => 3
                   );
                  //logout or send to login page
                   logut();
        }else{
          $objOut['alerts'] = array(
                     'alertmsg' => "Could not delete the data: ".$result['error'],
                     'alertstatus' => 4
                   );
        }

$objIn['dataOrder'] =""; //it's to load the main data
}//delete



if($objIn['dataOrder'] == 'nav' || empty($objIn['dataOrder'])){

$result = selectArray("users",array("id","firstname","lastname","username","email","timestamp"),"","WHERE id=".(int)$objIn['serverdata']['userid']);
    $objOut['table'] = array( //table, form, list, etc.
              'fetchID' => 401,

              'data' => array('headtitle' => '<div class="titleHeader">edit account</div>', //you can use html (optional)
                              'columns' => array('firstname'=>['First-name','',''], //columns (color) provide [min,max,ormin_max] then values and color
                                                'lastname'=>['Last-name','',''],
                                                'username'=>['Username','',''],
                                                 'email'=>['Email','','']
                                                ),
                              'rows' => $result['q']
                            ),
              'settings' => array('buttons' => array('td'=>array('edit'=>'[&#x270E;]','pass'=>'[&#x1f511;]')), //show buttons (optional)
                                ),
              'loadTo' => 'o-main', //provide the id where you want the data to be loaded in the page, if not assigned it will create one and append to the body
            );
    //$objOut['emptyElement'] = ['#o-main'];
    $objOut['popstate'] = false;
    $objOut['url'] = 'inc/data-loader.php'; //where data is fetched


//empty elements
if($objIn['fetchID'] == 400)
  $objOut["emptyElement"] = array('#o-main');

}//$objIn['dataOrder'] == 'nav' || empty($objIn['dataOrder'])

break;
case 402: //anything

break;
case 404: //anything


break;
case 406: //anything

break;
case 408: //anything

break;
case 410: //anything


break;
case 412: //anything


break;
} //end switch $objIn['fetchID']

  return $objOut;
}
