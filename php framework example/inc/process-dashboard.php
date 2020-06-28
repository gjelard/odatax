<?php

function dashboard($objIn){
  $objOut[] = array(); /* create an empty array fro return */
switch ($objIn['fetchID']) {
case 0: //WELCOME PAGE

/* WELCOME PAGE LOAD DATA */
       if($objIn['serverdata']['lead_access'] === "All" || $objIn['serverdata']['lead_access'] === "all"){
         $where = ""; $where2 = "";
       }else{
         $leadstr = rtrim($objIn['serverdata']['lead_access'], ','); $where = " WHERE `id` IN(".$leadstr.")"; $where2 = " WHERE `companyid` IN(".$leadstr.")";
       }
       $liMain = selectArray("companies",array("id","name AS text"),"",$where);
       $liSub = selectArray("leads",array("id","companyid AS mainid","lead_name AS text"),"",$where2);


/* different navigation menu for different access levels */
/* Check user access */
  if($objIn['serverdata']['access'] == 1){
           $objOut['navBody'] = array(
                       'nav' => array('text'=>['dashboard','companies','users','account','logout'],'id'=> [0,100,200,400,308]),
                       'body' => array('main'=>'<div class="row"><div class="col" id="data"></div>','footer'=>CopyRight())
                     );
  }else{
        $objOut['navBody'] = array(
                    'nav' => array('text'=>['dashboard','account','logout'],'id'=> [0,400,308]),
                    'body' => array('main'=>'<div class="row"><div class="col" id="data"></div>','footer'=>CopyRight())
                  );
  }

        if(!empty($liMain ['q'])){
         $objOut['list'] = array(
            'fetchID' => 1,
            'data' => array('headtitle' => "<div class='titleHeader'>[ example site name, logo or anything ]</div>", //you can use html (optional)
                            'liMain' => $liMain ['q'],
                            'liSub' => $liSub['q'],
                     ),
           'settings' => array('search' => true, //show search (optional)
                 ),
           'loadTo' => 'o-main', //provide the id where you want the data to be loaded in the page, if not assigned it will create one and append to the body
         );
       }//!empty($liMain ['q'])
         $objOut['emptyElement'] = ['#o-wrapper']; //(for id use "#" and class use "." example ['#o-wrapper','.o-classname'])
         $objOut['removeElement'] = ['#o-wrapper'];
         $objOut['url'] = 'inc/data-loader.php'; //where data is fetched
         $objOut['emptyUrlParm'] = true;
         $objOut['emptyUrlHash'] = false;
        // $objOut['popstate'] = true;


break;
case 1: // access



if($objIn['liSubID'] != ""){//$objIn['liMainID']

  $lead = selectArray("leads",array("ip","companyid"),"","WHERE id =".(int)$objIn["liSubID"]);
  $accessArr = explode(',', $objIn['serverdata']['lead_access']);

/* check if the user has the right to access the selected screen */
  $access = false;
  if ($accessArr[0] === 'all' || $accessArr[0] === 'All')
     $access = true;
  if (in_array($lead['q'][0]['companyid'], $accessArr))
     $access = true;


if($access){

  //$objOut['goToUrl'] = "/example/page.php";
  $objOut['alerts'] = array(
             'alertmsg' => "Direct to another page/function or do anything here!",
             'alertstatus' => 1
           );

}else{
  $objOut['alerts'] = array(
             'alertmsg' => "Access denied",
             'alertstatus' => 2
           );
}


}


break;
case 2: //anything


break;
case 3: //anything

break;
case 4: //anything

break;
case 5: //anything


break;
case 6: //anything


break;
} //end switch $objIn['fetchID']

  return $objOut;
}
