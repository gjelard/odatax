<?php

function companies($objIn){
  $objOut[] = array(); /* create an empty array fro return */
/*check if the subDataID is set, change the case */
if(isset($objIn['subDataID']))
   $objIn['fetchID'] = $objIn['subDataID'];
switch ($objIn['fetchID']) {
case 100: //companies
case 101:


if($objIn['dataOrder'] == 'addnew'){

  $objOut['dialogbox'] = array( //table, form, list, etc.
            'fetchID' => 101,

            'data' => array('headtitle' => '<span style="padding:10px;">add a new company</span>', //you can use html (optional)
                            'columns' => array('name'=>['company name','required'], //columns (color) provide [min,max,ormin_max] then values and color
                                               'address'=>['address/location','required']
                                              )
                          ),
            'settings' => array('buttons' => array('save' =>'add')), //show buttons (optional)
            );

}//[add]

if($objIn['dataOrder'] == 'save' && !empty($objIn['data'])){

  if(empty($objIn['id'])){ //insert
     $result = insertArray("companies",$objIn['data']);
  }else{ //update
     $result = updateArray("companies",$objIn['data'], "WHERE id=".$objIn['id']);
  }
  //ALERTS
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
        $result = selectArray('companies',array("id","name","address"),"","WHERE id =".(int)$objIn["id"] );
      $objOut['dialogbox'] = array( //table, form, list, etc.
                'fetchID' => 101,

                'data' => array('headtitle' => '<span style="padding:10px;">edit company</span>', //you can use html (optional)
                                'columns' => array('name'=>['company name','required'], //columns (color) provide [min,max,ormin_max] then values and color
                                                   'address'=>['address/location','']
                                                 ),
                                'rows' => $result['q']
                              ),
                'settings' => array('buttons' => array('delete' =>'delete','save' =>'save')), //show buttons (optional)
                );
      }

}//edit


if($objIn['dataOrder'] == 'delete'){

  if(empty($objIn['id'])){
    $objOut['alerts'] = array(
               'alertmsg' => "Missing information!",
               'alertstatus' => 4
             );

      }else{
        $result = deleteArray("companies", "WHERE id=".(int)$objIn["id"]);
          //ALERTS
        if($result['error'] == ""){
          $objOut['alerts'] = array(
                     'alertmsg' => "Data deleted successfully",
                     'alertstatus' => 3
                   );
                   //reload the data
                   $objIn['dataOrder'] = "";
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
$rowsperpage = 5;
$search_keyword = '';

if(!empty($objIn['search'])) {
  $search_keyword = trim($objIn['search']);
  $search_keyword = strip_tags($search_keyword);
}
if(!empty($objIn['page'])) {
 $pagestart=($objIn['page']-1) * $rowsperpage;
 $currentpage = $objIn['page'];
}

$bindValueArr = ["%{$search_keyword}%","%{$search_keyword}%","%{$search_keyword}%",(int)$pagestart,(int)$rowsperpage];
$result = selectBindParmArray("companies",array("id","name","address","timestamp"),"","WHERE (`name` LIKE ? OR `address` LIKE ? OR `timestamp` LIKE ? )  ORDER BY `name` ASC LIMIT ?,?",$bindValueArr);


    $objOut['table'] = array( //table, form, list, etc.
              'fetchID' => 101,

              'data' => array('headtitle' => '<div class="titleHeader">edit companies/clients</div>', //you can use html (optional)
                              'columns' => array('name'=>['company name',''], //columns (color) provide [min,max,ormin_max] then values and color
                                                 'address'=>['address / location',''],
                                                 'timestamp'=>['date / time updated','']
                                                ),
                              'rows' => $result['q']
                            ),
              'settings' => array('search' => true, //show search (optional)
                                  'buttons' => array('th'=>array('addnew' =>'[add]'),'td'=>array('edit'=>'[edit]','subdata'=>'[ leads &#x21B4; ]')), //show buttons (optional)
                                  'pages' => array('totalRows' =>$result['foundRows'],'rowsPerPage'=>$rowsperpage,'currentPage'=>$currentpage), //show pages (optional)
                                  'subDataID' => 102, //subdata (optional)
                                  'tabs' => ['LEADS DATA'], //tabs of subdata (optional)
                                  'heighlight' => '#FFFACD' //heighlight the row/tab when selected (optional)
                                ),
              'subTable' => false, //true, false, if not set it's considered as a main table
              'loadTo' => 'o-main', //provide the id where you want the data to be loaded in the page, if not assigned it will create one and append to the body
            );
    //$objOut['emptyElement'] = ['#o-main'];
    $objOut['popstate'] = false;
    $objOut['url'] = 'inc/data-loader.php'; //where data is fetched


//empty elements
if($objIn['fetchID'] == 100)
  $objOut["emptyElement"] = array('#o-main');

}//$objIn['dataOrder'] == 'nav' || empty($objIn['dataOrder'])

break;
case 102: //anything

if(isset($objIn['tab']) && isset($objIn['mainid'])){

if($objIn['tab'] == 0){


  if($objIn['dataOrder'] == 'addnew'){

    $objOut['dialogbox'] = array( //table, form, list, etc.
              'fetchID' => 102,
              'data' => array('headtitle' => '<span style="padding:10px;">add a new hmi/pc</span>', //you can use html (optional)
                              'columns' => array('lead_name'=>['Lead name','required'], //columns (color) provide [min,max,ormin_max] then values and color
                                                 'phone'=>['Phone #','required']
                                                )
                            ),
              'settings' => array('buttons' => array('save' =>'add')), //show buttons (optional)
              );
  break;
  }//[add]

  if($objIn['dataOrder'] == 'save' && !empty($objIn['data'])){

    if(empty($objIn['id'])){ //insert
       $objIn['data']['companyid'] = $objIn['mainid']; //add foreign key link
       $result = insertArray("leads",$objIn['data']);
    }else{ //update
       $result = updateArray("leads",$objIn['data'], "WHERE id=".$objIn['id']);
    }
    //ALERTS
  if($result['error'] == ""){
    $objOut['alerts'] = array(
               'alertmsg' => "Data saved successfully",
               'alertstatus' => 3
             );
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
          $result = selectArray('leads',array("id","lead_name","phone"),"","WHERE id =".(int)$objIn["id"] );
        $objOut['dialogbox'] = array( //table, form, list, etc.
                  'fetchID' => 102,

                  'data' => array('headtitle' => '<span style="padding:10px;">edit hmi/pc</span>', //you can use html (optional)
                                  'columns' => array('lead_name'=>['PC name','required'], //columns (color) provide [min,max,ormin_max] then values and color
                                                     'phone'=>['phone address','']
                                                   ),
                                  'rows' => $result['q']
                                ),
                'settings' => array('buttons' => array('delete' =>'delete','save' =>'save')), //show buttons (optional)
                  );
        }

  }//edit


  if($objIn['dataOrder'] == 'delete'){

    if(empty($objIn['id'])){
      $objOut['alerts'] = array(
                 'alertmsg' => "Missing information!",
                 'alertstatus' => 4
               );

        }else{
          $result = deleteArray("leads", "WHERE id=".(int)$objIn["id"]);
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

  }//delete


  $result = selectArray('leads',array("id","companyid","lead_name","phone","timestamp"),"","WHERE companyid =".(int)$objIn["mainid"] );
  $compName = selectArray('companies',array("name"),"","WHERE id =".(int)$objIn["mainid"] );
      $objOut['table'] = array( //table, form, list, etc.
                'fetchID' => 102,

                'data' => array('headtitle' => '<div class="subTitleHeader">Leads / Anything - '.$compName['q'][0]['name'].'</div>', //you can use html (optional)
                                'columns' => array('lead_name'=>['Lead name',''], //columns (color) provide [min,max,ormin_max] then values and color
                                                   'phone'=>['phone #',''],
                                                   'timestamp'=>['date/time updated','']
                                                  ),
                                'rows' => $result['q']
                              ),
                'settings' => array('buttons' => array('th'=>array('addnew' =>'[add]'),'td'=>array('edit'=>'[edit]')), //show buttons (optional)
                                    'heighlight' => '#FFFACD' //heighlight the row/tab when selected (optional)
                                  ),
                'subTable' => true, //true, false, if not set it's considered as a main table
              //  'loadTo' => 'o-main', //provide the id where you want the data to be loaded in the page, if not assigned it will create one and append to the body
            );
}//$objIn['tab'] == 0


}


break;
case 104: //anything


break;
case 106: //anything

break;
case 108: //anything

break;
case 110: //anything


break;
case 112: //anything


break;
} //end switch $objIn['fetchID']

  return $objOut;
}
