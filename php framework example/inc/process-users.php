<?php

function users($objIn){
  $objOut[] = array(); /* create an empty array fro return */
/*check if the subDataID is set, change the case */
if(isset($objIn['subDataID']))
   $objIn['fetchID'] = $objIn['subDataID'];
switch ($objIn['fetchID']) {
case 200: //users
case 201:


if($objIn['dataOrder'] == 'addnew'){

  $objOut['dialogbox'] = array( //table, form, list, etc.
            'fetchID' => 201,

            'data' => array('headtitle' => '<span style="padding:10px;">add a new user</span>', //you can use html (optional)
                            'columns' => array('firstname'=>['First-name','required',''], //columns (color) provide [min,max,ormin_max] then values and color
                                              'lastname'=>['Last-name','required',''],
                                              'username'=>['Username','required',''],
                                               'email'=>['Email','required','email'],
                                               'password'=>['Password','required','password'],
                                               'repassword'=>['Re-enter Password','required','password']
                                              )
                          ),
                  'settings' => array('buttons' => array('save' =>'add')), //show buttons (optional)
            );

}//[add]

if($objIn['dataOrder'] == 'save' && !empty($objIn['data'])){

  if(empty($objIn['id'])){ //signup new user
    //unset([$objIn["dataOrder"]]);
    $result = signup($objIn['data']);

    if(empty($result['error'])){
         $objOut['alerts'] = array(
                    'alertmsg' => "New account created for:".$objIn['data']['firstname'],
                    'alertstatus' => 3
                  );
    }else{
      $objOut['alerts'] = array(
                 'alertmsg' => $result['error'],
                 'alertstatus' => 4
               );

    }
  }else{ //update
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
  }


}//save

if($objIn['dataOrder'] == 'edit'){
  if(empty($objIn['id'])){
    $objOut['alerts'] = array(
               'alertmsg' => "Missing information!",
               'alertstatus' => 4
             );

      }else{
      $result = selectArray('users',array("id","firstname","lastname","username","email","lead_access","active"),"","WHERE id =".(int)$objIn["id"] );
      $companies = selectArray('companies',array("id AS value","name AS text"),"","");
      $companies['q'][] = array('value'=>'all','text'=>'All Access'); //add for all access option
      $objOut['dialogbox'] = array( //table, form, list, etc.
                'fetchID' => 201,

                'data' => array('headtitle' => '<span style="padding:10px;">edit user</span>', //you can use html (optional)
                                'columns' => array('firstname'=>['First-name','required',''], //columns (color) provide [min,max,ormin_max] then values and color
                                                  'lastname'=>['Last-name','required',''],
                                                  'username'=>['Username','required',''],
                                                  'email'=>['Email','required','email'],
                                                  'active'=>['Check to activate','','checkbox'],
                                                  'lead_access'=>['Company access','required','multiple']
                                                 ),
                                'rows' => $result['q'],
                                'select' => array("lead_access"=>$companies['q']),
                              ),
                  'settings' => array('buttons' => array('delete' =>'delete user','save' =>'save')), //show buttons (optional)
                );
      }

}//edit

if($objIn['dataOrder'] == 'view'){ //not used

  if(empty($objIn['id'])){
    $objOut['alerts'] = array(
               'alertmsg' => "Missing information!",
               'alertstatus' => 4
             );

      }else{
        $result = selectArray('users',array("id","firstname","lastname","username","email"),"","WHERE id =".(int)$objIn["id"] );
      $objOut['dialogbox'] = array( //table, form, list, etc.
                'fetchID' => 201,

                'data' => array('headtitle' => '<span style="padding:10px;">add a new company</span>', //you can use html (optional)
                                'columns' => array('firstname'=>['First-name','required',''], //columns (color) provide [min,max,ormin_max] then values and color
                                                  'lastname'=>['Last-name','required',''],
                                                  'username'=>['Username','required',''],
                                                   'email'=>['Email','required','email']
                                                 ),
                                'rows' => $result['q']
                              )
                );
      }

}//view

if($objIn['dataOrder'] == 'delete'){

  if(empty($objIn['id'])){
    $objOut['alerts'] = array(
               'alertmsg' => "Missing information!",
               'alertstatus' => 4
             );
             //reload the data
             $objIn['dataOrder'] = "";
      }else{
        $result = deleteArray("users", "WHERE id=".(int)$objIn["id"]);
          //ALERTS
        if($result['error'] == ""){
          $objOut['alerts'] = array(
                     'alertmsg' => "Data deleted successfully",
                     'alertstatus' => 3
                   );
        }else{
          $objOut['alerts'] = array(
                     'alertmsg' => "Could not delete the data: ".$result['error'],
                     'alertstatus' => 4
                   );
        }
      }
$objIn['dataOrder'] =""; //it's to load the main data
}//delete

if($objIn['dataOrder'] == 'nav' || empty($objIn['dataOrder'])){


//settings [pagination,etc]
$pagestart = 0;
$currentpage = 1;
$rowsperpage = 10;
$search_keyword = '';

if(!empty($objIn['search'])) {
  $search_keyword = trim($objIn['search']);
  $search_keyword = strip_tags($search_keyword);
}
if(!empty($objIn['page'])) {
 $pagestart=($objIn['page']-1) * $rowsperpage;
 $currentpage = $objIn['page'];
}

if(!empty($objIn['order'])){
  $orderBy = "`".$objIn['orderby']."` ".$objIn['order'];
}else{
  $orderBy = "`firstname` ASC";
}

$bindValueArr = ["%{$search_keyword}%","%{$search_keyword}%","%{$search_keyword}%",(int)$pagestart,(int)$rowsperpage];
$result = selectBindParmArray("users",array("id","firstname","lastname","username","email","timestamp"),"","WHERE (`firstname` LIKE ? OR `lastname` LIKE ? OR `email` LIKE ? )  ORDER BY {$orderBy} LIMIT ?,?",$bindValueArr);


    $objOut['table'] = array( //table, form, list, etc.
              'fetchID' => 201,

              'data' => array('headtitle' => '<div class="titleHeader">edit users</div>', //you can use html (optional)
                              'columns' => array('firstname'=>['First-name','',''], //columns (color) provide [min,max,ormin_max] then values and color
                                                'lastname'=>['Last-name','',''],
                                                'username'=>['Username','order',''],
                                                 'email'=>['Email'],
                                                 'timestamp'=>['Timestamp','order','']
                                                ),
                              'rows' => $result['q']
                            ),
              'settings' => array('search' => true, //show search (optional)
                                  'buttons' => array('th'=>array('addnew' =>'[add]'),'td'=>array('edit'=>'[edit]','view'=>'[view]')), //show buttons (optional)
                                  'pages' => array('totalRows' =>$result['foundRows'],'rowsPerPage'=>$rowsperpage,'currentPage'=>$currentpage), //show pages (optional)
                                  //'subDataID' => 202, //subdata (optional)
                                  //'tabs' => ['User Aceess Control'], //tabs of subdata (optional)
                                  'heighlight' => '#FFFACD' //heighlight the row/tab when selected (optional)
                                ),
              'subTable' => false, //true, false, if not set it's considered as a main table
              'loadTo' => 'o-main', //provide the id where you want the data to be loaded in the page, if not assigned it will create one and append to the body
            );
    //$objOut['emptyElement'] = ['#o-main'];
    $objOut['popstate'] = false;
    $objOut['url'] = 'inc/data-loader.php'; //where data is fetched


//empty elements
if($objIn['fetchID'] == 200)
  $objOut["emptyElement"] = array('#o-main');

}//$objIn['dataOrder'] == 'nav' || empty($objIn['dataOrder'])

break;
case 202: //anything

break;
case 204: //anything


break;
case 206: //anything

break;
case 208: //anything

break;
case 210: //anything


break;
case 212: //anything


break;
} //end switch $objIn['fetchID']

  return $objOut;
}
