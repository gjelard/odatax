<?php
require_once('func.php');
function authenticate($objIn){
    $objOut[] = array(); /* create an empty array fro return */
switch ($objIn['fetchID']) {
  case 300: //LOGIN

   $objOut =  array(
  'navBody' => array(
             'body' => array('main'=>'<div style="width:100%;text-align: center;margin:5px;">Compnay Name [logo]</div><div id="login" style="width:300px; margin:0 auto; padding:10px;border:thin solid black;"></div>',
             'footer'=>CopyRight())
           ),
  'html' => array(
     //'data'=>'<div style="display: flex; justify-content: center; align-items: stretch; list-style-type: none; flex-direction: row;">Example content</div>'
  ),
  'form' => array( //table, form, list, etc.
            'fetchID' => 301,
            'data' => array('headtitle' => '<p style="color:#bbb;">please sign in here:</p>', //you can use html (optional)
                            'columns' => array('username'=>['Username','required','text'], //columns (color) provide [min,max,ormin_max] then values and color
                                               'password'=>['Password','required','password']
                                              ),
                            'foottitle' => '<div style="width:100%;margin-top: 20px;display: flex;flex-direction: row;flex-wrap: wrap;justify-content: space-between;">
                            <a href="javascript:void(0);" data-buttonid="304">forgot password?</a>
                            <a href="javascript:void(0);" data-buttonid="302">sign up</a>
                            </div>', //you can use html (optional)
                          ),
            'settings' => array(//'search' => true, //show search (optional)
                                'buttons' => array('submit' =>'login'), //show buttons (optional)
                    ),
            'loadTo' => 'login', //provide the id where you want the data to be loaded in the page, if not assigned it will create one and append to the body
        ),

  'emptyElement' => ['#o-wrapper'], //(for id use "#" and class use "." example ['#o-wrapper','.o-classname'])
  'removeElement' => ['#o-wrapper','#o-nav'],
  'url' => 'inc/data-loader.php', //where data is fetched
  'emptyUrlParm' => true,
  'emptyUrlHash' => false
    );
break;

case 301: //AUTHENTICATION

     $result = login($objIn['data']);
     if(empty($result['error'])){
                //serverdata needed for the dashboard page/function
                $result = selectArray("users",array("lead_access","access"),"","WHERE id=".(int)$result['userid']);
                $obj['serverdata']['access'] = $result['q'][0]['access'];
                $obj['serverdata']['lead_access'] = $result['q'][0]['lead_access'];
                $obj['fetchID'] = 0;
                return  dashboard($obj);

     }else{
       $objOut['alerts'] = array(
                  'alertmsg' => $result['error'],
                  'alertstatus' => 4
                );
     }
break;


case 302: //SIGN UP

     $objOut =  array(
    'form' => array( //table, form, list, etc.
            'fetchID' => 303,
            'data' => array('headtitle' => '<p style="color:#bbb;">please fill in the form:</p>', //you can use html (optional)
                            'columns' => array('firstname'=>['First-name','required',''], //columns (color) provide [min,max,ormin_max] then values and color
                                              'lastname'=>['Last-name','required',''],
                                              'username'=>['Username','required',''],
                                               'email'=>['Email','required','email'],
                                               'password'=>['Password','required','password'],
                                               'repassword'=>['Re-enter Password','required','password']
                                              ),
                            'foottitle' => '<div style="width:100%; margin:10px; taxt-align:right;"><a href="javascript:void(0);" data-buttonid="300">back to login</a>', //you can use html (optional)
                          ),
            'settings' => array(//'search' => true, //show search (optional)
                                'buttons' => array('save' =>'submit'), //show buttons (optional)
                              ),
            'loadTo' => 'login', //provide the id where you want the data to be loaded in the page, if not assigned it will create one and append to the body
          ),
    'url' => 'inc/data-loader.php', //where data is fetched

      );
break;

case 303: //SIGNING UP

    //unset([$objIn["dataOrder"]]);
    $result = signup($objIn['data']);

    if(empty($result['error'])){
              $objIn['fetchID'] = 300;
              authenticate($objIn);
               $objOut['alerts'] = array(
                          'alertmsg' => "Your account is ready, you can login now.",
                          'alertstatus' => 3
                        );
    }else{
      $objOut['alerts'] = array(
                 'alertmsg' => $result['error'],
                 'alertstatus' => 4
               );

    }

break;
case 304: //FORGOT PASS

     $objOut =  array(
    'form' => array( //table, form, list, etc.
            'fetchID' => 305,
            'data' => array('headtitle' => '<p style="color:#bbb;">please enter your email address:</p>', //you can use html (optional)
                            'columns' => array('email'=>['Email','required','email'], //columns (color) provide [min,max,ormin_max] then values and color
                                              ),
                            'foottitle' => '<div style="width:100%; margin:10px; taxt-align:right;"><a href="javascript:void(0);" data-buttonid="300">back to login</a>', //you can use html (optional)
                          ),
            'settings' => array(//'search' => true, //show search (optional)
                                'buttons' => array('save' =>'submit'), //show buttons (optional)
                              ),
            'loadTo' => 'login', //provide the id where you want the data to be loaded in the page, if not assigned it will create one and append to the body
          ),
    'url' => 'inc/data-loader.php', //where data is fetched

      );
break;

case 305:  //send email to reset password

if($objIn['data']['email'] !=''){
  $objIn['data']['email'] = trim($objIn['data']['email']);
  $email = selectArray("users",array("email"),"","WHERE email='".$objIn['data']['email']."'");

  if (!empty($email['q']) && empty($email['error'])){
    $hash = sessionValueCheck();
    $updateHash = updateArray("users",array('forgotpass'=>$hash),"WHERE email ='".$email['q'][0]['email']."'");

     if(!empty($updateHash['error'])){
       $out['error']="Sorry, something went wrong, please contact administrator.";
     }else{

       $mailSubject = "Request for password reset";
       $mailMessageArr[0] = "You have requested to reset your password!";
       $mailMessageArr[1] = "Please use the link below here:";
       $mailMessageArr[2] = '<a href="https://example.com?reset='.$hash.'">click here</a>';
        $result = sendMyMail(array($email['q'][0]['email']), $mailSubject, $mailMessageArr);
        if(empty($result['error'])){
          $objOut['alerts'] = array(
                     'alertmsg' => 'A link to reset your password is sent to your email.',
                     'alertstatus' => 3
                   );
        }else{
          $objOut['alerts'] = array(
                     'alertmsg' => $result['error'],
                     'alertstatus' => 4
                   );
        }

     }

  }else{
    $objOut['alerts'] = array(
               'alertmsg' => 'No account found.',
               'alertstatus' => 4
             );
  }

}else{
  $objOut['alerts'] = array(
             'alertmsg' => 'Missing data.',
             'alertstatus' => 4
           );
}

break;
case 306: //RESET PASS

if($objIn['dataOrder'] != 'resetpass'){
  $objOut =  array(
  'navBody' => array(
            //'nav' => array('text'=>['logo','dashboard','users','account','logout'],'id'=> [1,1,2,3,4]),
            'body' => array('main'=>'<div id="login" style="width:300px; margin:0 auto; padding:10px;border:thin solid black;"></div>','footer'=>CopyRight())
          ),

  'form' => array( //table, form, list, etc.
          'fetchID' => 307,
          'data' => array('headtitle' => '<p style="color:#bbb;">please enter your new password:</p>', //you can use html (optional)
                         'columns' => array('password'=>['Password','required','password'],
                                            'repassword'=>['Re-enter Password','required','password'],
                                           ),
                         'foottitle' => '<div style="width:100%; margin:10px; taxt-align:right;"><a href="javascript:void(0);" data-buttonid="300">back to login</a>', //you can use html (optional)
                       ),
          'settings' => array(//'search' => true, //show search (optional)
                             'buttons' => array('resetpass' =>'submit'), //show buttons (optional)
                           ),
          'loadTo' => 'login', //provide the id where you want the data to be loaded in the page, if not assigned it will create one and append to the body
        ),
  'url' => 'inc/data-loader.php', //where data is fetched

   );
}
if($objIn['dataOrder'] == 'resetpass'){
  $objIn['data']['reset'] = trim(getHrefString( 'reset', $objIn ));
  $result = resetpass($objIn['data']);

  if(empty($result['error'])){
    $objIn['fetchID'] = 300;
    $objOut = authenticate($objIn);
     $objOut['alerts'] = array(
                'alertmsg' => "Your're password is now reset, please login.",
                'alertstatus' => 3
              );
  }else{
    $objOut['alerts'] = array(
               'alertmsg' => $result['error'],
               'alertstatus' => 4
             );
  }
}

break;
case 308: //LOGOUT

     $result = logout($objIn['serverdata']['userid']);

     if(empty($result['error'])){
       $objIn['fetchID'] = 300;
       $objOut = authenticate($objIn);
        $objOut['alerts'] = array(
                   'alertmsg' => "Your're logged out successfully.",
                   'alertstatus' => 3
                 );
     }else{
       $objOut['alerts'] = array(
                  'alertmsg' => $result['error'],
                  'alertstatus' => 4
                );
     }
break;
} //end switch $objIn['fetchID']

  return $objOut;
}
