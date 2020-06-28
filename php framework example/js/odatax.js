let ns = (function() {
/* Created by Gjelard Karrica 2019.
LIST OF FUNCTIONS - not in order
::MAIN ::
[main
oTable
oEdit
oform
oAddNew
oView
oUrl
oBodyNav
oHtml
oList
fetchx {ajax,fetch,post}
postData]

::OTHER::
[iEmpty
pagination
clickDialogFormBox
dialogBox
showDialogBox
constructTable
mainalerts
removeErr
addErr
changeColor]
*/
/*dialogFrame func */
function main(objJson){

	if(typeof objJson === 'object' && objJson !=null){

		/*url check list function (has to be first to run) */
	  objJson = oUrl(objJson);

		//pre-check (clean-up)
		if(typeof objJson.emptyElement != 'undefined')
				objJson['emptyElement'].forEach(function(divId) {
					document.querySelectorAll(divId).forEach((element) => {
							 element.innerHTML = '';
							});
				});
		if(typeof objJson.removeElement != 'undefined')
			objJson['removeElement'].forEach(function(divId) {
				document.querySelectorAll(divId).forEach((element) => {
						 element.remove();
						});
			});

      let gotData = false; //to check if there is data
			for (let [key, obj] of Object.entries(objJson)) {
          if(typeof obj === 'object' && obj !== null)
				    obj['url'] = objJson.url;
			 //key, value
			 switch(key) {
					 case "navBody":
					     gotData = true;
							 oBodyNav(obj);

					 break;
					 case "table":
					     obj['localObj'] = objJson.localObj;
					     gotData = true;
				 			 oTable(obj);

					break;
					case "list":
					    obj['localObj'] = objJson.localObj;
					    gotData = true;
							oList(obj);

					break;
					case "form":
					    obj['localObj'] = objJson.localObj;
					    gotData = true;
						  oForm(obj);

					break;
					case "dialogbox":
				    	obj['localObj'] = objJson.localObj;
					    gotData = true;
						  oDialog(obj);

					break;
					case "html":
					    gotData = true;
						  oHtml(obj);

					break;

					 default:
		 }

		}

	//	if(!gotData)
	//	 mainalerts({alertmsg:'No results found',alertstatus:1});

	}else{
		 mainalerts({alertmsg:'No results found',alertstatus:2});
	}//objJson != null


	/* at the end add event listener if there is any button (data-buttonid)*/
	var button = document.querySelectorAll('[data-buttonid]');
	for (i = 0; i < button.length; i++) {
	    button[i].addEventListener('click', function(event) {
							postData({fetchID:event.target.getAttribute('data-buttonid'),url:objJson.url});
	    });
	}
	/* the addEventListener above here might need to be revised */

}//main()
/* URl related function */
function oUrl(objJson){

	/*check the url used for fetching data */
	if(typeof objJson.url == 'undefined')
			  objJson['url'] = '';
	if(typeof objJson.localObj == 'undefined')
			objJson['localObj'] = {};
	if(typeof objJson.localObj.url == 'undefined')
			objJson.localObj['url'] = '';
 objJson.url = objJson.url != '' ? objJson.url : objJson.localObj.url;
 if(objJson.url == '')
    mainalerts({alertmsg:'url is undefined',alertstatus:4});

	 /* url clean up, parametrs, hash  */
			if(typeof objJson.emptyUrlParm != 'undefined'){
				if(objJson.emptyUrlParm == true)
				 window.history.pushState(null, null, window.location.pathname);
			}
			if(typeof objJson.emptyUrlHash != 'undefined'){
				if(objJson.emptyUrlHash == true)
				 window.history.pushState(null, null, window.location.href.split('#')[0]);
			}
		/* set up, parametrs, hash, directory, new url  */
			 if(typeof objJson.setUrlParm != 'undefined'){
				 //const urlParams = new URLSearchParams(window.location.search);
               //urlParams.set(objJson.setUrlParm[0], objJson.setUrlParm[1]);
               //window.location.search = urlParams;
							 window.history.pushState('', '', '?'+ objJson.setUrlParm);
			 }
			 if(typeof objJson.setUrlHash != 'undefined')
				  //window.location.hash = objJson.setUrlHash;
					window.history.pushState('', '', '#'+ objJson.setUrlHash);

			 if(typeof objJson.setUrlDirectory != 'undefined')
				 //window.location.hash = objJson.setUrlHash;
				 window.history.pushState('', '', objJson.setUrlDirectory);
       console.log(objJson)
			 if(typeof objJson.goToUrl != 'undefined')
				window.location.href = objJson.goToUrl;

			if(typeof objJson.popstate != 'undefined')/* pushstate and popstate for browsing hist */
				if(objJson.popstate === true){
					if(typeof objJson.localObj.event != 'undefined')
					   delete objJson.localObj.event; //cannot clone mouse events
						 window.history.pushState({ref: objJson.localObj}, '', '');

						 window.addEventListener('popstate', function(e){
						 	 //if(e.state)
						 		 //ns.postData(e.state.ref);
								 ns.postData(objJson.localObj);
						 });
				}

  return objJson;
}
/* Main body navigation */
function oBodyNav(objJson){


	if(typeof objJson.nav == 'undefined')
		 objJson['nav'] = {};
	if(typeof objJson.body == 'undefined')
		 objJson['body'] = {};


	let nav = document.createElement('div');
  let bars = document.createElement('span');
	let ul = document.createElement('ul');
	let side = document.createElement('div');
	let main = document.createElement('div');
	if (!document.getElementById('o-wrapper')){
			var wrapper = document.createElement('div');
			    wrapper.setAttribute("id","o-wrapper");
	}else{
		var wrapper = document.getElementById('o-wrapper');
	}

	/* at the end add the links */
if(Object.keys(objJson.nav).length > 0){

	/* remove event listeners if any */
	if(typeof clickFunc === "function") //check if function is set
		 nav.removeEventListener('click', clickFunc, false);
		 /* search an remove any previous o-side, if any */
		 document.querySelectorAll('#o-nav').forEach(el => el.remove());

      bars.setAttribute("style","cursor:pointer;font-size: 2em;");
			bars.setAttribute("id","o-bars-nav");
			bars.innerHTML = '&#9776;';
	    nav.setAttribute("id","o-nav");
			nav.setAttribute("style","width:98%;");
			ul.setAttribute("style","display:flex;justify-content:center;align-items: stretch;list-style-type:none;");


		for (let i = 0; i < objJson.nav.text.length; i++) {
				let li = document.createElement('li');
				    li.setAttribute("style","margin:5px;");
						li.innerHTML = '<a class="o-links" href="javascript:void(0);" style="text-decoration:none;" data-linkid="'+objJson.nav.id[i]+'">'+objJson.nav.text[i]+'</a>';
						ul.appendChild(li);
    }
    nav.appendChild(bars);
		nav.appendChild(ul);
		document.body.appendChild(nav);
	}

	/* add the body */
	if(Object.keys(objJson.body).length > 0){
				 wrapper.setAttribute("style","display: flex;width:98%; height:85%;padding:1.2em;");
         var mainWidth = "100%",
				     sideWidth = "20%";

				 if(typeof objJson.body.side != 'undefined'){
					   /* search an remove any previous o-side, if any */
					    document.querySelectorAll('#o-side').forEach(el => el.remove());
					    side.id = 'o-side';
 					    side.style.padding = "20px";
							side.innerHTML = objJson.body.side;
 					    wrapper.appendChild(side);
							mainWidth = "80%";
 				}

				if(typeof objJson.body.main != 'undefined'){
					    /* search an remove any previous o-main, is any */
							document.querySelectorAll('#o-main').forEach(el => el.remove());
					    main.id = 'o-main';
					    main.style.margin = "20px";
							main.innerHTML = objJson.body.main;
					    wrapper.appendChild(main);
				}
        document.body.appendChild(wrapper);
				if(typeof objJson.body.footer != 'undefined'){
					/* search an remove any previous o-main, is any */
					document.querySelectorAll('#o-footer').forEach(el => el.remove());
					let footer = document.createElement('div');
					    footer.id = "o-footer";
					    footer.setAttribute("style","position: fixed;bottom: 0;left: 0;right: 0;z-index: 2;text-align:center;padding: 4px 15px; color: #666;");
							footer.innerHTML = objJson.body.footer;
					    document.body.appendChild(footer);
				}
}
	/*event handlers */
	let widthX = window.matchMedia("(max-width: 700px)");
	 function screenM(e){
		 if (e.matches) { // If media query matches
				 wrapper.style.flexDirection = "column";
				 main.style.flex = "100%";
				 side.style.flex = "100%";
				 ul.style.flexDirection = "column";
				 ul.style.display = "none";
				 bars.style.display = "block";
			 } else {
				 wrapper.style.flexDirection  = "row";
				 main.style.flex = mainWidth;
				 side.style.flex = sideWidth;
				 ul.style.flexDirection = "row";
				 ul.style.display = "flex";
				 bars.style.display = "none";
			 }
	 }
	    screenM(widthX);
	    widthX.addListener(screenM);

   bars.addEventListener('click', function(e){
		 (ul.style.display == "flex") ? ul.style.display = "none" : ul.style.display = "flex";
	 }, false);

	 nav.addEventListener('click',clickFunc = function(){
		event.stopPropagation();

				if (event.target.matches('.o-links') || event.target.parentNode.matches('.o-links')) {
					      let fetchID = event.target.getAttribute('data-linkid') || event.target.parentNode;
								let obj = {fetchID:fetchID,url:objJson.url, dataOrder:'nav', event:event}
										postData(obj);
					}
	},false); //click events

}
function oList(objJson){

	if(typeof objJson.data == 'undefined')
		    objJson['data'] = {};
	if(typeof objJson.fetchID == 'undefined')
		   objJson['fetchID'] = ''; //put a default id if it does not exist
 if(typeof objJson.loadTo == 'undefined')
			 objJson['loadTo'] = '';
	if(typeof objJson.settings == 'undefined')
		  objJson['settings'] = {};
	if(typeof objJson.data.liMain == 'undefined')
				objJson.data['liMain'] = [];
	if(typeof objJson.data.liSub == 'undefined')
				objJson.data['liSub'] = [];

	if(typeof objJson.data.liSubText == 'undefined')
				objJson.data['liSubText'] = [];
	if(typeof objJson.data.liSubID == 'undefined')
				objJson.data['liSubID'] = [];

	var list = document.createElement('div');
	let ul = document.createElement('ul');

	/*check status of the loadTo */
	if(objJson.loadTo !=''){
			if (!document.getElementById(objJson.loadTo)){
						mainalerts({alertmsg:'Could not find the "loadTo" id',alertstatus:4});
			}else{
				var list = document.getElementById(objJson.loadTo);
			}
	}else{
				var idname = 'o-list';

				 if(objJson.localObj.subDataID != '')
						idname = idname+'-'+objJson.localObj.subDataID;

						if (document.getElementById(idname)){
							var list = document.getElementById(idname);
						}else{
							var list = document.createElement('div');
									list.setAttribute('id',idname);
									//check if navBody exists (o-main)
									if (document.getElementById('o-main')){
										document.getElementById('o-main').appendChild(list);
									}else{
										document.body.appendChild(list);
								}
						}
	}
	/* add head title (if any) */
	list.innerHTML = objJson.data.headtitle;
	for (let [key, value] of Object.entries(objJson.settings)) {
	 //key, value
	 switch(key) {
	 case "search":
			if(typeof objJson.localObj.search == 'undefined'){
				let search = document.createElement('div');
						search.innerHTML = '<input type="text" class="o-lisearch" style="width:100%;" placeholder="Search..." title="Search" value="">';
						list.appendChild(search);
			}
	 break;
	 default:
 }
}
 ul.setAttribute("style","list-style-type: none;padding: 0;margin: 0;");
	/*loop through the list */
	for (let i = 0; i < Object.keys(objJson.data.liMain).length; i++) {
			let li = document.createElement('li');
			    li.setAttribute('class','o-listMain');
					li.setAttribute("style","border: 1px solid #ddd;padding: 5px;cursor:pointer;");

            let liSubData = false;
            for (let x = 0; x < objJson.data.liSub.length; x++) {

								if(objJson.data.liMain[i].id === objJson.data.liSub[x].mainid){

									if(!liSubData){

										li.setAttribute("class","o-list-toggle");
										li.innerHTML = '<span class="o-listText">'+objJson.data.liMain[i].text + '</span><span class="o-listIcon" style="float:right;">&#10010;</span>';

										var ulSub = document.createElement('ul');
												ulSub.setAttribute("style","list-style-type: none;padding: 0;margin:10px 0 0 0;display:none;");
												ulSub.setAttribute("class","o-sub-toggle");
									  liSubData = true;
									}

								let liSub = document.createElement('li');
										liSub.setAttribute("style","border: 1px solid #ddd;padding: 5px;cursor:pointer;");
										liSub.setAttribute("class","o-list-link");
										liSub.setAttribute("data-liSubID",objJson.data.liSub[x].id);
										liSub.innerHTML = objJson.data.liSub[x].text+ '<span class="o-listIcon" style="float:right;">&#10095;</span>';
										ulSub.appendChild(liSub);
								}


						}
	          if(liSubData)
						li.appendChild(ulSub);

					if(!liSubData){
						li.setAttribute("class","o-list-link");
						li.setAttribute("data-liMainID",objJson.data.liMain[i].id);
						li.innerHTML = '<span class="o-listText">'+objJson.data.liMain[i].text+ '</span><span class="o-listIcon" style="float:right;">&#10095;</span>';
					}

					ul.appendChild(li);
	}
 list.appendChild(ul);

/*remove event handlers if exist */
if(typeof liClickFunc === "function") //check if function is set
list.removeEventListener('click', liClickFunc, false);
if(typeof liKeyupFunc === "function") //check if function is set
list.removeEventListener('click', liKeyupFunc, false);


/*add event handlers */
 list.addEventListener('click',liClickFunc = function(){
	event.stopPropagation();

			if (event.target.matches('.o-list-link') || event.target.parentNode.matches('.o-list-link')) {
							let liMainID = typeof event.target.getAttribute("data-liMainID") != "undefined" ? event.target.getAttribute('data-liMainID') : '';
							let liSubID = typeof event.target.getAttribute("data-liSubID") != "undefined" ?  event.target.getAttribute('data-liSubID') : '';
							let obj = {liMainID:liMainID,liSubID:liSubID,url:objJson.url, dataOrder:'list', fetchID:objJson.fetchID, event:event};
									postData(obj);
				}
      if (event.target.matches('.o-list-toggle') || event.target.parentNode.matches('.o-list-toggle')) {
           let toggle = event.target.querySelector('.o-sub-toggle') || event.target.parentNode.querySelector('.o-sub-toggle');
					 let iconChange = event.target.querySelector('.o-listIcon') || event.target.parentNode.querySelector('.o-listIcon');
					     if(toggle.style.display == "none"){
								 toggle.style.display = "block";
								 iconChange.innerHTML = '&#9866;';
							 }else {
								  toggle.style.display = "none";
									iconChange.innerHTML = '&#10010;';
							}
			}

},false); //click events

//search filter
list.addEventListener('keyup',liKeyupFunc = function(){
	if(event.target.matches('.o-lisearch')){
		 let filter, listText, i, li, txtValue;
		 filter = event.target.value.toUpperCase();
		 listText = ul.querySelectorAll('span.o-listText');

		 for (i = 0; i < listText.length; i++) {
			 if(listText[i].textContent != "" || listText[i].innerText !=""){
				 txtValue = listText[i].textContent || listText[i].innerText;
			 }else{
				 txtValue = "";
			 }
				 if (txtValue.toUpperCase().indexOf(filter) > -1) {
						 listText[i].parentNode.closest('li').style.display = "";
				 } else {
						 listText[i].parentNode.closest('li').style.display = "none";
				 }
		 }
 }
},false); //keyup events

}//oList(objJson)
function oForm(objJson){

	if(typeof objJson.data == 'undefined')
		 objJson['data'] = {};
	if(typeof objJson.fetchID == 'undefined')
		 objJson['fetchID'] = ''; //put a default id if it does not exist
 if(typeof objJson.loadTo == 'undefined')
			objJson['loadTo'] = '';
	if(typeof objJson.settings == 'undefined')
		 objJson['settings'] = {};
 if(typeof objJson.data.headtitle == 'undefined')
			objJson.data['headtitle'] = '';
 if(typeof objJson.data.foottitle == 'undefined')
			objJson.data['foottitle'] = '';
 if(typeof objJson.data.columns == 'undefined')
			objJson.data['columns'] = {};
if(typeof objJson.data.rows == 'undefined')
			objJson.data['rows'] = [];
 if(typeof objJson.settings.subDataID == 'undefined')
			objJson.settings['subDataID'] = 0;
 if(typeof objJson.settings.buttons == 'undefined')
		 objJson.settings['buttons'] = {};
 if(typeof objJson.data.select == 'undefined')
		objJson.data['select'] = {};
 if(typeof objJson.data.radio == 'undefined')
			objJson.data['radio'] = {};

/*construct the table for the form */
let table = constructTable(objJson);

/*remove old form if it exists */
	 document.querySelectorAll('.o-form').forEach((element) => {
				element.remove();
	 });
/* prepare data structure */
let oform = document.createElement('div');
		oform.setAttribute('class', 'o-form'); //add class
let headtitle = document.createElement('div');
		headtitle.innerHTML = objJson.data.headtitle;
let foottitle = document.createElement('div');
		foottitle.innerHTML = objJson.data.foottitle;

		/* add buttons if any*/
		let buttons = document.createElement('div');
				buttons.setAttribute('style', 'display: flex;justify-content:center;'); //add style
		if(Object.keys(objJson.settings.buttons).length > 0){
				for (const [key, value] of Object.entries(objJson.settings.buttons)) {
					let a = document.createElement('a');
							a.setAttribute("href","javascript:void(0);" );
							a.setAttribute("class","o-dialogbtn" );
							a.setAttribute("data-btnrole",key);
							a.style.margin ='10px';
							a.innerHTML = value;
							buttons.appendChild(a);
			 }

		}//buttons length
		oform.appendChild(headtitle); //append header
		oform.appendChild(table); //append form
		oform.appendChild(buttons); //append form
		oform.appendChild(foottitle); //append footer

if(objJson.loadTo != ''){
	if (!document.getElementById(objJson.loadTo)){
				mainalerts({alertmsg:'Could not find the "loadTo" id',alertstatus:4});
	}else{
		document.getElementById(objJson.loadTo).appendChild(oform);
	}
}else{
	 //check if (o-main) exists
		 if (document.getElementById('o-main'))
			 document.getElementById('o-main').appendChild(oform);
		 else
			 document.body.appendChild(oform);
}

let fetchID = objJson.fetchID != '' ? objJson.fetchID : objJson.localObj.fetchID;
oform.obj = {url:objJson.url,fetchID:fetchID};
oform.table = table;
oform.addEventListener('click', clickDialogFormBox, false);
}//oForm(objJson)
function oDialog(objJson){

	if(typeof objJson.data == 'undefined')
		 objJson['data'] = {};
	if(typeof objJson.fetchID == 'undefined')
		 objJson['fetchID'] = ''; //put a default id if it does not exist
 if(typeof objJson.loadTo == 'undefined')
			objJson['loadTo'] = '';
	if(typeof objJson.settings == 'undefined')
		 objJson['settings'] = {};
 if(typeof objJson.data.headtitle == 'undefined')
			objJson.data['headtitle'] = '';
 if(typeof objJson.data.foottitle == 'undefined')
			objJson.data['foottitle'] = '';
 if(typeof objJson.data.columns == 'undefined')
			objJson.data['columns'] = {};
if(typeof objJson.data.rows == 'undefined')
			objJson.data['rows'] = {};
 if(typeof objJson.settings.buttons == 'undefined')
		 objJson.settings['buttons'] = {};
 if(typeof objJson.data.select == 'undefined')
		objJson.data['select'] = {};
 if(typeof objJson.data.radio == 'undefined')
			objJson.data['radio'] = {};
/* check for ID in any of the options below */
let id = '';
if(typeof objJson.data.id != 'undefined')
		  id = objJson.data.id;
if(Object.keys(objJson.data.rows).length > 0){
	if(typeof objJson.data.rows[0]['id'] != 'undefined' )
 		  id =  objJson.data.rows[0]['id'];
}

			let [topBar, dialogFrame] = dialogBox(); //add dialog
      let table = constructTable(objJson);
 		  let fetchID = objJson.fetchID != '' ? objJson.fetchID : objJson.localObj.fetchID;
 		  dialogFrame.obj = {id:id,url:objJson.url,fetchID:fetchID};
 		  dialogFrame.table = table;

 		let headtitle = document.createElement('div');
 				headtitle.innerHTML = objJson.data.headtitle;
 		let foottitle = document.createElement('div');
 				foottitle.innerHTML = objJson.data.foottitle;


				/* add buttons if any*/
				let buttons = document.createElement('div');
				    buttons.setAttribute('style', 'display: flex;justify-content:center;'); //add style
				if(Object.keys(objJson.settings.buttons).length > 0){


						for (const [key, value] of Object.entries(objJson.settings.buttons)) {
              let a = document.createElement('a');
							    a.setAttribute("href","javascript:void(0);" );
									a.setAttribute("class","o-dialogbtn" );
									a.setAttribute("data-btnrole",key);
									a.setAttribute("data-id",id);
									a.style.margin ='10px';
									a.innerHTML = value;
									buttons.appendChild(a);
					 }

				}//buttons length


 			let scrollDiv = document.createElement('div');
 					scrollDiv.setAttribute('style','min-height:150px;max-height:400px;height:100%;overflow:auto;');
 					scrollDiv.appendChild(table);
 					dialogFrame.appendChild(scrollDiv); //append scrolldiv/table
 					dialogFrame.appendChild(buttons); //append
 		      dialogFrame.appendChild(foottitle); //append footer
 			    topBar.prepend(headtitle);

 showDialogBox(dialogFrame);


 dialogFrame.addEventListener('click', clickDialogFormBox, false);

}
function oTable(objJson){

	if(typeof objJson.data == 'undefined')
		 objJson['data'] = {};
	if(typeof objJson.fetchID == 'undefined')
		 objJson['fetchID'] = ''; //put a default id if it does not exist
 if(typeof objJson.subTable == 'undefined')
			objJson['subTable'] = false;
 if(typeof objJson.loadTo == 'undefined')
			objJson['loadTo'] = '';
	if(typeof objJson.settings == 'undefined')
		 objJson['settings'] = {};
 if(typeof objJson.data.headtitle == 'undefined')
		  objJson.data['headtitle'] = '';
 if(typeof objJson.data.foottitle == 'undefined')
			objJson.data['foottitle'] = '';
 if(typeof objJson.data.columns == 'undefined')
			objJson.data['columns'] = {};
 if(typeof objJson.data.rows == 'undefined')
		 objJson.data['rows'] = [];
	if(typeof objJson.settings.subDataID == 'undefined')
			 objJson.settings['subDataID'] = 0;
 if(typeof objJson.settings.tabs == 'undefined')
		 objJson.settings['tabs'] = [];
 if(typeof objJson.settings.buttons == 'undefined')
		 objJson.settings['buttons'] = {};
 if(typeof objJson.settings.heighlight == 'undefined')
		objJson.settings['heighlight'] = 'none';

/*data display start*/
let headTitle = document.createElement('div');
let search = document.createElement('div');
let table = document.createElement('table');
let pages = document.createElement('div');
let footTitle = document.createElement('div');
let tabs = document.createElement('div');
var oTable = document.createElement('div');
let noloadTo = false;
var btnTDArr =new Array();
var btnTHArr = new Array();
/*check subTable or mainTable */
	if(objJson.subTable == true){
		 if(document.querySelector('#o-subTable') == null)
				oTable.setAttribute('id','o-subTable');
		 else{
			 oTable =  document.getElementById('o-subTable');
			 noloadTo = true;
		 }

	}else{
		if(document.querySelector('#o-table') == null)
			 oTable.setAttribute('id','o-table');
		else{
			 oTable =  document.getElementById('o-table');
			 noloadTo = true;
		}

	}
	/*check status of the loadTo */
	if(!noloadTo){
		if(objJson.loadTo !=''){
				if (!document.getElementById(objJson.loadTo)){
							mainalerts({alertmsg:'Could not find the "loadTo" id',alertstatus:4});
				}else{
					document.getElementById(objJson.loadTo).appendChild(oTable);
				}
		}else{
							if (document.getElementById('o-main'))
								 document.getElementById('o-main').appendChild(oTable);
							else
								 document.body.appendChild(oTable);
		}
	}//noloadTo


/* add head and foot title (if any) */
	headTitle.setAttribute('class','o-headtitle');
	headTitle.innerHTML = objJson.data.headtitle;
	footTitle.setAttribute('class','o-foottitle');
	footTitle.innerHTML = objJson.data.foottitle;

/* check settings */
if(Object.keys(objJson.settings).length > 0){

	for (let [key, value] of Object.entries(objJson.settings)) {
   //key, value
	 switch(key) {
	 case "search":
	    if(oTable.querySelector('.o-tablesearch') == null){
				    search.setAttribute('class','o-tablesearch');
				    search.innerHTML = '<input type="text" id="search" placeholder="Search..." title="Search" value="" autofocus>';
			}else{

				search = oTable.querySelector('.o-tablesearch');
			}

	 break;

	 case "pages":
		  let totalPages = Math.ceil(objJson.settings[key].totalRows / objJson.settings[key].rowsPerPage);
			    pages.appendChild(pagination(objJson.settings[key].currentPage, totalPages));

	 break;
	 case "tabs":
	    if(oTable.querySelector('.o-tab') == null){
				tabs.setAttribute('class','o-tabs');
				tabs.setAttribute('style','margin-top:10px;')
				 for (let i =0;i<objJson.settings.tabs.length;i++){
					 let link = document.createElement('a');
							 link.setAttribute('href','javascript:void(0)');
							 link.setAttribute('class','o-tab');
							 link.setAttribute('data-tab',i);
							 link.setAttribute('style','margin-right:5px;')
							 link.innerHTML = objJson.settings.tabs[i];
							 tabs.appendChild(link);
						}
			}else{
				tabs = oTable.querySelector('.o-tabs');
			}

	 break;
	 case "buttons":
		/* create array of buttons for th and td if any*/
		if(Object.keys(objJson.settings.buttons).length > 0){
			if(objJson.settings.buttons.td instanceof Object){
				for (const [key, value] of Object.entries(objJson.settings.buttons.td)) {
					btnTDArr.push('<a href="javascript:void(0);" class="o-btn" data-btnrole="'+key+'">'+value+'</a>');
			 }
		 }//td
			 if(objJson.settings.buttons.th instanceof Object){
					for (const [key, value] of Object.entries(objJson.settings.buttons.th)) {
						btnTHArr.push('<a href="javascript:void(0);" class="o-btn" data-btnrole="'+key+'">'+value+'</a>');
					}
				}//th
		}//buttons length

	 break;
	 default:

 }
}

}//objJson.settings.length > 0

/* add table head */
if(Object.keys(objJson.data.columns).length > 0){
 let tr = document.createElement("tr");
	for (let [key, value] of Object.entries(objJson.data.columns)) {
		//key, value
	   let th = document.createElement("th");
		 switch(value[1]) {
				case 'order':
				let dataO = "asc";
				if(key == getCookie("orderby")){
					dataO = getCookie("order");
					setCookie("orderby",""); //empty
				}
			  th.innerHTML = '<a href="javascript:void(0);" data-order="'+dataO+'" data-orderby="'+key+'">'+value[0]+' &#x21C5;</a>';
				break;
				default:
				  th.innerHTML = value[0];
				}

		     tr.appendChild(th);
	}

let th = document.createElement("th");
/*add TH buttons if any*/
btnTHArr.forEach((element) => {th.innerHTML=element;});
if(btnTDArr.length > 1)
th.setAttribute('colspan', btnTDArr.length);
tr.appendChild(th);
table.appendChild(tr);

}//objJson.data.columns.length > 0


/* add table rows */
if(objJson.data.rows.length > 0){

	for (let i =0;i<Object.keys(objJson.data.rows).length;i++){

			let tr = document.createElement('tr');
			for (let key in objJson.data.columns) {

					let td = document.createElement("td");
					switch(key[1]) {
					case "date":
          		td.innerHTML = dateShort(objJson.data.rows[i][key]);

					break;
					case "time":
							td.innerHTML = convertTime24to12(objJson.data.rows[i][key]);
					break;
					case "status":
					   td.innerHTML = objJson.data.rows[i][key] == 1 ? '<span style="color:green;">ready</span>' : ((objJson.data.rows[i][key] == 0) ? '<span style="color:orange;">pending</span>' : '<span style="color:red;">failed</span>');

					break;
					case "color":
							td.innerHTML = changeColor(objJson.data.columns[key],objJson.data.rows[i][key]);
					break;
					default:
				   	td.innerHTML = objJson.data.rows[i][key];

				}
						tr.appendChild(td);
		} //end of column loop


		/*add TD buttons if any*/
		btnTDArr.forEach((element) => {
			let td = document.createElement("td");
			td.innerHTML =element;
			tr.appendChild(td);
		});
		let id = typeof objJson.data.rows[i].id == 'undefined' ? '' : objJson.data.rows[i].id;
		tr.setAttribute('data-id',id);
		tr.setAttribute('data-subdataid',objJson.settings.subDataID);
		tr.setAttribute('data-dataid',objJson.fetchID);
	  table.appendChild(tr);

 } //end rows for loop i

}//objJson.data.rows !=''

	/* remove event listeners if any */
	if(typeof clickFunc === "function") //check if function is set
	   oTable.removeEventListener('click', clickFunc, false);
	if(typeof keyupFunc === "function") //check if function is set
	   oTable.removeEventListener('keyup', keyupFunc, false);


 /* add event listeners */
 oTable.addEventListener('click',clickFunc = function(){
	 event.stopPropagation();

	 /* event listener for page o-navigation, numbers or next/previous and search button */
	 if (event.target.tagName.toLowerCase() === 'a' || event.target.parentNode.tagName.toLowerCase() === 'a') {

			if (event.target.hasAttribute("data-page")) {
						 let val = event.target.getAttribute('data-page');
						 let currentpage = parseInt(oTable.querySelector('.currentpage').getAttribute('data-page'));
						 let page, search;
						 if(oTable.querySelector('#search') != null)
						    search = oTable.querySelector('#search').value;

					if(val == 'next' || val == 'prev'){
							 if(val == 'prev'){
									page = currentpage - 1;
							 }
							 if(val == 'next'){
									page = currentpage + 1;
							 }

							 }else{
									page = parseInt(val);

							 }
							 if(!isEmpty(page)){
							 let obj = {page:parseInt(page), search:search,url:objJson.url,fetchID:objJson.fetchID,tab:getCookie("tab"),mainid:getCookie("mainid"), event:event}
						       postData(obj);
								 }else{
  								 mainalerts({alertmsg:'Cannot identify page, missing info',alertstatus:2});
  							 }
			 }//data-pages
			 if (event.target.hasAttribute("data-order")) {
         let order = event.target.getAttribute("data-order");
				 let orderby = event.target.getAttribute("data-orderby");
				 let ascDesc = (order == 'asc') ? 'desc' : 'asc';
				 setCookie("orderby",orderby);
				 setCookie("order",ascDesc);

				 let obj = {order:order, orderby:orderby,url:objJson.url,fetchID:objJson.fetchID,tab:getCookie("tab"),mainid:getCookie("mainid"), event:event}
						 postData(obj);
			 }

			 //buttons addnew/edit/view/etc
			 if (event.target.matches('.o-btn') || event.target.parentNode.matches('.o-btn')) {
                let id = event.target.parentNode.closest('tr').getAttribute('data-id');
                let btnrole = event.target.getAttribute('data-btnrole') || event.target.parentNode.getAttribute('data-btnrole');
								if(btnrole != 'subdata'){
									let obj = {id:id,url:objJson.url,fetchID:objJson.fetchID, dataOrder:btnrole,tab:getCookie("tab"),mainid:getCookie("mainid"), event:event}
										 postData(obj);
								}else{//for subdata only
                  setCookie("mainid",parseInt(id));
									let tab = 0;
								 if(objJson.settings.tabs.length > 0){

									 if(oTable.querySelector('.o-active-tab') != null){
											tab = oTable.querySelector('.o-active-tab').getAttribute('data-tab');
										}else{
											//set the first tab to active
											 oTable.querySelector('.o-tab').classList.add('o-active-tab');
											 oTable.querySelector('.o-tab').style.background=objJson.settings.heighlight;
										}
	                setCookie("tab",parseInt(tab));
								 }

								 if(!isEmpty(id)){
									 let obj = {mainid:id,url:objJson.url,fetchID:objJson.fetchID, subDataID:objJson.settings.subDataID,tab:tab,dataOrder:'subdata', event:event}
											 postData(obj);
	                //set the row to active
									let trs = event.target.parentNode.closest('table').getElementsByTagName('tr');
									    for(let i=0;i<trs.length;i++){
										   if(trs[i].querySelector('.o-active-sub') != null)
	 										    trs[i].querySelector('.o-active-sub').classList.remove('o-active-sub');
	                 }
									   if(event.target.matches('.o-subdata')){
											 event.target.classList.add('o-active-sub');
										 }else{
											 event.target.parentNode.classList.add('o-active-sub');
										 }


									 //highlight the row
									 if(objJson.settings.heighlight != ''){
											 for(let i=0;i<trs.length;i++)
												 trs[i].style.background='';
									       event.target.parentNode.closest('tr').style.background=objJson.settings.heighlight;
										 }

								 }else{
									 mainalerts({alertmsg:'Cannot identify this row, missing id',alertstatus:2});
								 }
								}


				 }
    //tabs
		if (event.target.matches('.o-tab')) {

			 tablinks = oTable.getElementsByClassName("o-tab");
			 for (i = 0; i < tablinks.length; i++) {
				 tablinks[i].classList.remove('o-active-tab');
				 tablinks[i].style.background='';
			 }
			 event.target.classList.add('o-active-tab');
       event.target.style.background=objJson.settings.heighlight;
			 tab = event.target.getAttribute('data-tab');
       setCookie("tab",parseInt(tab));
			 let mainid = 0;
			 if(objJson.data.rows.length > 0){

					 if(oTable.querySelector('.o-active-sub') != null){
						 mainid = oTable.querySelector('.o-active-sub').parentNode.closest('tr').getAttribute('data-id');
					 }else{
						 //set the first sub to active
						  let firstRow = oTable.querySelector('a[data-btnrole="subdata"]');
							firstRow.classList.add('o-active-sub');
							firstRow.parentNode.closest('tr').style.background=objJson.settings.heighlight;
							mainid = firstRow.parentNode.closest('tr').getAttribute('data-id');
					 }
           setCookie("mainid",parseInt(mainid));
			 }

			 if(!isEmpty(tab) && !isEmpty(mainid)){
				 let obj = {mainid:parseInt(mainid),url:objJson.url,fetchID:objJson.fetchID, subDataID:objJson.settings.subDataID,dataOrder:'tab',tab:tab,event:event}
						 postData(obj);
			 }else{
				 mainalerts({alertmsg:'Cannot identify this tab, missing tab id',alertstatus:2});
			 }

		}

	 }//a

},false); //click events

oTable.addEventListener('keyup',keyupFunc = function(){
	event.stopPropagation();
	 if (event.target.tagName.toLowerCase() === 'input') {

		 /* search on enter keyup */
			if (event.target.id == 'search' && event.keyCode === 13) {
				let obj = {search:event.target.value, url:objJson.url,fetchID:objJson.fetchID,tab:getCookie('tab'), event:event}
						postData(obj);

			 }
	 }

},false); //keyup events

  oTable.innerHTML = ""; //empty
/* finally add data to the screen */
  oTable.appendChild(headTitle);
  oTable.appendChild(search);
	oTable.appendChild(table);
	oTable.appendChild(footTitle);
	oTable.appendChild(pages);
	oTable.appendChild(tabs);



} //end oTable()
function oHtml(objJson){

	if(typeof objJson.data == 'undefined')
		 objJson['data'] = '';
 if(typeof objJson.loadTo == 'undefined')
			objJson['loadTo'] = '';
let htmlData = document.createElement('div');
    htmlData.innerHTML = objJson.data;
/* load the HTML data */
if(objJson.loadTo != ''){
		if (!document.getElementById(objJson.loadTo)){
					mainalerts({alertmsg:'Could not find the "loadTo" id',alertstatus:4});
		}else{
			document.getElementById(objJson.loadTo).appendChild(htmlData);
		}
	}else{
		 //check if (o-main) exists
			 if (document.getElementById('o-main'))
				 document.getElementById('o-main').appendChild(htmlData);
			 else
				 document.body.appendChild(htmlData);
	}
}//oHtml()
function clickDialogFormBox(event){
	/* click handlers */
		   event.stopPropagation();
		   let obj = event.currentTarget.obj;
       let table = event.currentTarget.table;
			 let objData = {};

		   if(event.target.matches('.o-close')){

				 if(typeof clickDialogFormBox === "function") //check if function is set
						document.removeEventListener('click', clickDialogFormBox, false);
				    document.querySelectorAll('.o-dialogFrame').forEach((element) => {
								 element.remove();
						});

		   }

		   if(event.target.matches('.o-toggleBtn')){

			  if(event.target.getAttribute('data-toggleValue') == 0){
				  event.target.value = 'ON';
				  event.target.setAttribute('data-toggleValue','1');
				  event.target.style.color = 'green';
			  }else{
				  event.target.value = 'OFF';
				  event.target.setAttribute('data-toggleValue','0');
				  event.target.style.color = 'red';
			  }

		   }

 if (event.target.matches('.o-dialogbtn') || event.target.parentNode.matches('.o-dialogbtn')) {
			let id = event.target.getAttribute('data-id') || event.target.parentNode.getAttribute('data-id');
			let btnrole = event.target.getAttribute('data-btnrole') || event.target.parentNode.getAttribute('data-btnrole');

if(btnrole != 'delete'){
		    removeErr(); //remove err
		     //get all data
				let goodToGo = true;
				let data = table.querySelectorAll('[data-read]');

			for (let i = 0; i < data.length; i++) {

					 switch(data[i].nodeName) {
						case "INPUT":
							 if(data[i].type == 'checkbox'){
								objData[data[i].getAttribute('data-read')] = data[i].checked; //text
							 } else if(data[i].type == 'button'){
								objData[data[i].getAttribute('data-read')] = data[i].getAttribute('data-toggleValue');
							} else if(data[i].type == 'email'){
											if(data[i].value.match(/\S+@\S+\.\S+/)){ //check email validity
												objData[data[i].getAttribute('data-read')] = data[i].value;
											}else{
												addErr(data[i]);
												goodToGo=false;
												mainalerts({alertmsg:'invalid email address',alertstatus:4});
												break;
											}
							 } else if(data[i].type == 'password'){ //check re-entered password match
								 if(data[i].getAttribute('data-read') !="repassword"){ //do not add to arr re-entered password
												 if(data.length <= i+1){
													 objData[data[i].getAttribute('data-read')] = data[i].value;
												 }else{
												 if(data[i+1].getAttribute('data-read') == "repassword") { //checking if the next row is re-enter pass
														  if(data[i].value === data[i+1].value ){
																 objData[data[i].getAttribute('data-read')] = data[i].value;
															}else{
																addErr(data[i]);
																goodToGo=false;
																mainalerts({alertmsg:'passwords do not match',alertstatus:4});
																break;
															}
														}else{
															 objData[data[i].getAttribute('data-read')] = data[i].value;
														}
													}
					 	 			}//!="repassword"
								}else{
									objData[data[i].getAttribute('data-read')] = data[i].value;
								}

							break;
						case "SELECT":
						      if (typeof data[i].options[data[i].selectedIndex] != 'undefined'){
										if(data[i].multiple){
											   objData[data[i].getAttribute('data-read')] = Array.from(data[i].options).filter(o => o.selected).map(o => o.value).join();//join is temporarly for testing
										  }else{
											   objData[data[i].getAttribute('data-read')] = data[i].options[data[i].selectedIndex].value;
										  }

							  }else{
								  objData[data[i].getAttribute('data-read')] = '';
							  }
							break;
							case "DIV":
							    //RADIO butons
		               let name = data[i].getAttribute('data-read');
							     objData[name] = ((data[i].querySelector('input[name="'+name+'"]:checked') || {}).value) ||'';
								break;
						case "TEXTAREA":
							  objData[data[i].getAttribute('data-read')] = data[i].value;
							break;
						}
					//check required fields
					if(data[i].required || data[i].getAttribute('required') == 'required'){
						if(isEmpty(objData[data[i].getAttribute('data-read')]) || objData[data[i].getAttribute('data-read')] == 'null'){
				      addErr(data[i]);
							goodToGo=false;
							//msg['alertmsg']=data[i].getAttribute('data-read')+" is required";
							mainalerts({alertmsg:data[i].parentNode.previousSibling.innerHTML+' is required',alertstatus:4});
							break;
							}
					}

				}//for
			if (goodToGo == true){
				    obj.dataOrder = btnrole;
				    obj.mainid = getCookie('mainid'); //used for subdata only
					  obj.tab = getCookie('tab');//used for subdata only
				    obj.data = objData;
			      postData(obj);
			}
		}else{
	let result = confirmDelete();
	if(result){
		obj.mainid = getCookie('mainid'); //used for subdata only
		obj.tab = getCookie('tab');//used for subdata only
	  obj.dataOrder = btnrole;
	 postData(obj);
	 event.cancelBubble = true;
	 document.removeEventListener('click', clickDialogFormBox, false);
	 document.querySelectorAll('.o-dialogFrame').forEach((element) => {
				element.remove();
	 });
	}

}// !=delete
}//o-dialogbtn click
}//clickDialogFormBox()
function constructTable(objJson){ //used for the FORMS and DIALOGS

	var table = document.createElement('table');
		  table.setAttribute('class', '');
		  table.style.width = "100%";
	//let datepickArr = new Array(); //used for data and time functions

	/* Check if there are data or this is a new entry */
	const emptyRow = Object.keys(objJson.data.rows).length === 0 ? true : false; //true or false

	/* go through the object */
	for (const [key, value] of Object.entries(objJson.data.columns)) {

	    var tr = document.createElement('tr');
		  var select = document.createElement('select');
		      select.setAttribute('data-read', key);
		  var input = document.createElement('input');
		      input.setAttribute('data-read', key);
		  var textarea = document.createElement('textarea');
		      textarea.setAttribute('data-read', key);
			var radioGroupWrap = document.createElement('div');
		 			radioGroupWrap.setAttribute('style','display:flex; flex-direction: column;');
					radioGroupWrap.setAttribute('data-read', key);

	/* add first td */
	var td = document.createElement('td');
	    td.innerHTML = value[0];
			tr.appendChild(td);

	/* second:: go through the inner array [skip 0, i=1] */
	for (let i = 1; i < value.length; i++){

	      if(value[i] == 'required'){
					select.required = true;
					input.required = true;
					textarea.required = true;
					//radioGroupWrap.required = true;
					radioGroupWrap.setAttribute('required','required');
				}
	       var td = document.createElement('td');
			   /* configure settings below here */
	       switch(value[i]) {
					  case "select":
								var exist = false; //in case the "name" is not found in the list but is recorded in the database
	              //if(typeof objJson.data.select[key] != 'undefined')
								if(objJson.data.select.hasOwnProperty(key))
								for (let x =0;x<Object.keys(objJson.data.select[key]).length;x++){


									let option = document.createElement( 'option' );

									option.value = objJson.data.select[key][x].value;
									option.text = objJson.data.select[key][x].text;
									if (!emptyRow)
									if(objJson.data.select[key][x].value == objJson.data.rows[0][key]){
										option.selected ='selected';
										exist = true;
									}
									select.appendChild( option );

								}
								else{
									select.innerHTML = '<option>missing options!</option>';
								}
								if(!emptyRow)
								if(exist == false){
									option = document.createElement( 'option' );
									option.selected ='selected';
									option.value = objJson.data.rows[0][key];
									option.text = objJson.data.rows[0][key];
									select.appendChild(option);

								}
								td.appendChild(select);
						break;
						case "multiple":
						  select.multiple = true;
							if (!emptyRow)
							var selectedAr = [];
							if (objJson.data.rows[0][key] instanceof Array)
							  selectedArr = objJson.data.rows[0][key];
							else
							  selectedArr = objJson.data.rows[0][key].replace(/(^,)|(,$)/g, "").split(',');
							 var exist = false; //in case the "name" is not found in the list but is recorded in the database
							 //if(typeof objJson.data.select[key] != 'undefined')
							 if(objJson.data.select.hasOwnProperty(key))
							 for (let x =0;x<Object.keys(objJson.data.select[key]).length;x++){
								 let option = document.createElement( 'option' );

								 option.value = objJson.data.select[key][x].value;
								 option.text = objJson.data.select[key][x].text;
								 if (!emptyRow)
								 selectedArr.forEach((element) => {
									 if(element == objJson.data.select[key][x].value){
										 option.selected = true;
										 exist = true;
									 }

								 });
								 select.appendChild( option );
							 }
							 else{
								 select.innerHTML = '<option>missing options!</option>';
							 }
							 if(!emptyRow)
							 if(exist == false){
								 option = document.createElement( 'option' );
								 option.selected = true;
								 option.value = objJson.data.rows[0][key];
								 option.text = objJson.data.rows[0][key];
								 select.appendChild(option);

							 }
							 td.appendChild(select);
					 break;
						case "radio":
									if(objJson.data.radio.hasOwnProperty(key))
									for (let x =0;x<Object.keys(objJson.data.radio[key]).length;x++){
										let radioWrap = document.createElement('div');
	                  let label = document.createElement('label');
										let radio = document.createElement( 'input' );
	                      radio.type = 'radio';
												radio.name = key;
												radio.value = objJson.data.radio[key][x];
										    label.innerHTML = objJson.data.radio[key][x];
												label.setAttribute('style','text-transform:capitalize;');
										if (!emptyRow)
										if(objJson.data.radio[key][x] == objJson.data.rows[0][key]){
											radio.checked = 'checked';

										}

										radioWrap.appendChild(radio);
										radioWrap.appendChild(label);
										radioGroupWrap.appendChild(radioWrap);

									}else{
										radioGroupWrap.innerHTML = '<b style="color:red;">missing radios!</b>';
									}
								td.appendChild(radioGroupWrap);
						break;
					  case "checkbox":
				       if (!emptyRow)
						   input.checked = objJson.data.rows[0][key]== 1 ? true:false;
						   input.type = "checkbox";
						   td.appendChild(input);
						break;
						case "textarea":
								if (!emptyRow)
								textarea.value = objJson.data.rows[0][key];
								td.appendChild(textarea);

						break;
						case "number":
								if (!emptyRow)
								input.value = objJson.data.rows[0][key];
								input.type = "number";
								td.appendChild(input);
						break;
						case "disabled":
								let temp ="N/A";
								if (!emptyRow)
								temp = objJson.data.rows[0][key];
								input.value = getCookie(key) || temp;
								input.type = "text";
								input.disabled = true;
								td.appendChild(input);
						break;
						case "autoGenerate":
								input.value = objJson.data.rows[0][key];
								input.type = "text";
								td.appendChild(input);
						break;
						case "toggleButton":
						    let toggle = 0;
								if (!emptyRow)
								toggle = objJson.data.rows[0][key];
								let text = toggle == 1 ? '<span style="color:green;">ON</span>' : '<span style="color:red;">OFF</span>' ;
										input.value = text;
										input.type = "button";
										input.setAttribute("class", "o-toggleBtn");
										input.setAttribute("data-toggleValue", toggle);
										td.appendChild(input);
						break;
	          case "date":
					      if (!emptyRow)
					      input.value = objJson.data.rows[0][key];
				 				input.id = key;
								input.type = "date";
								td.appendChild(input);
						break;
						case "time":
						    if (!emptyRow)
						    input.value = objJson.data.rows[0][key];
								input.id = key;
								input.type = "time";
								td.appendChild(input);
	          break;
						case "email":
						    if (!emptyRow)
						    input.value = objJson.data.rows[0][key];
								input.id = key;
								input.type = "email";
								td.appendChild(input);
	          break;
						case "password":
								input.id = key;
								input.type = "password";
								if(typeof keyupFuncPass === "function") //check if function is set
									 document.removeEventListener('keyup', keyupFuncPass, false);
								  input.addEventListener('keyup',keyupFuncPass = function(){
									event.stopPropagation();
									if (event.keyCode === 13)
	                   document.querySelector(".o-dialogbtn").click();
								},false); //keyup events
								td.appendChild(input);
	          break;
					  default: //default is text
								if (!emptyRow)
								input.value = objJson.data.rows[0][key];
								input.id = key;
								input.type = "text";
								td.appendChild(input);


					}
	 }//second loop

	    tr.appendChild(td);
	    table.appendChild(tr);
	}//key, value objJson.data.columns


	return table;
}
function dialogBox(){

	if(document.querySelector('.o-dialogFrame') != null){ //check if it exists and remove it if so
	    let dropListeners = document.querySelectorAll('.o-dialogFrame');
			dropListeners.forEach((drop) => {
				drop.removeEventListener('click', clickDialogFormBox, false);
				drop.parentNode.removeChild(document.querySelector('.o-dialogFrame'));
			});
	}

	/* new dialog elements */
	let dialogFrame = document.createElement('div');
	    dialogFrame.setAttribute('class', 'o-dialogFrame'); //add class
	let topBar = document.createElement('div');

	dialogFrame.setAttribute('style', 'border-radius: 5px;border:solid thin #c5c5c5;padding:10px;display: inline-block;position: fixed;z-index: 9999;box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);min-width:200px;max-width:400px;background-color: #fff;'); //add style
	topBar.setAttribute('style','display: flex;margin-bottom:5px;justify-content:space-between;cursor:move;padding:10;background:whitesmoke;');
	let closeBtn = document.createElement('div');
			closeBtn.innerHTML = '<a href="javascript:void(0);" class="o-close">[close]</a>'
	topBar.appendChild(closeBtn);
	dialogFrame.appendChild(topBar); //append topBar


	var drag     = new Object();
	drag.obj = topBar;
	drag.obj.addEventListener(isMobile() ? 'touchstart' : 'mousedown', function(e)
	{
	    drag.top  = parseInt(drag.obj.parentNode.offsetTop);
	    drag.left = parseInt(drag.obj.parentNode.offsetLeft);
	    drag.oldx = drag.x;
	    drag.oldy = drag.y;
	    drag.drag = true;
	});

	window.addEventListener(isMobile() ? 'touchend' : 'mouseup', function()
	{
	    drag.drag = false;
	});

	window.addEventListener(isMobile() ? 'touchmove' : 'mousemove', function(e)
	{
	    drag.x    = e.clientX;
	    drag.y    = e.clientY;
	    let diffw = drag.x - drag.oldx;
	    let diffh = drag.y - drag.oldy;

	    if (drag.drag)
	    {

	        drag.obj.parentNode.style.left = drag.left + diffw + 'px';
	        drag.obj.parentNode.style.top  = drag.top  + diffh + 'px';
	        e.preventDefault();
	    }
	});
	//END DRAGG OPTION

 return [topBar,dialogFrame];
}//dialogBox()
function showDialogBox(dialogFrame){
	document.body.appendChild(dialogFrame); //append to body
	dialogFrame.style.top=(window.innerHeight/2)-(dialogFrame.offsetHeight/2)+'px';
	dialogFrame.style.left=(window.innerWidth/2)-(dialogFrame.offsetWidth/2)+'px';

}//showDialogBox()
/*remove all errors */
function removeErr() {
	document.querySelectorAll('.o-err').forEach((element) => {
			 element.classList.remove('o-err');
	});
}
function addErr(err){
if(document.getElementById('o-err'))
  err.classList.add("o-err");
else {
	let css = '.o-err { outline: 1px solid red !important; }',
      head = document.head,
      style = document.createElement('style');
      style.type = 'text/css';
      style.appendChild(document.createTextNode(css));
      style.setAttribute("id","o-err");
      head.appendChild(style);
			err.classList.add("o-err");
}
}
/* empty check */
function isEmpty(str){
    str = str+''; //so it can check the numbers too
    if (typeof str == 'undefined' || !str || str.length === 0 || str === "" || !/[^\s]/.test(str) || /^\s*$/.test(str) || str.replace(/\s/g,"") === ""){
        return true;
    }else{
		return false;
	}
}
/*confirm delete */
function confirmDelete(str) {
  if (typeof str === 'undefined' || str === null || str === '') {
    str="Are you sure you want to delete this?";
  }
  let x = confirm(str);
  if (x)
      return true;
  else
    return false;
}
/* pagination */
function pagination(currentPage, nrOfPages) {

	let pagesToShow = 3,
		  page = currentPage - pagesToShow > 0 ?  (currentPage - pagesToShow) : 1,
		  first = 0,
	    pageList = [];


		 for (let i = 0; i < (pagesToShow * 2) && page < nrOfPages; i++) {
			 if(currentPage == page){ //do not add the link to current page number
				  if(page != 1 && page != nrOfPages)
 			 				pageList.push('<a href="javascript:void(0)" class="o-nav currentpage" data-page="'+page+'"  style="text-decoration: none; font-weight:bold;">'+page+'</a>');
				 }else{
					    if(page != 1 && page != nrOfPages)
					 		pageList.push('<a href="javascript:void(0)" class="o-nav" data-page="'+page+'">'+page+'</a>');
				 }
      page++;

		}

   if(nrOfPages > 1){ //dont't show if there is one page
	 //add first page
	 if(pagesToShow + 2  < currentPage){
		 pageList.unshift('...');
		 pageList.unshift('<a href="javascript:void(0)" class="o-nav" data-page="'+1+'">'+1+'</a>');
	 }else{
		    if(currentPage == 1){
		    pageList.unshift('<a href="javascript:void(0)" class="o-nav currentpage" data-page="'+1+'"  style="text-decoration: none;">'+1+'</a>');
			}else{
				pageList.unshift('<a href="javascript:void(0)" class="o-nav" data-page="'+1+'">'+1+'</a>');
			}

	 }


	 //add last page
	 //if(nrOfPages > 1)
	 if(nrOfPages - pagesToShow  >  currentPage){
		 pageList.push('...');
		 pageList.push('<a href="javascript:void(0)" class="o-nav" data-page="'+nrOfPages+'">'+nrOfPages+'</a>');
	 }else{
		 if(nrOfPages == currentPage){
		    pageList.push('<a href="javascript:void(0)" class="o-nav currentpage" data-page="'+nrOfPages+'"  style="text-decoration: none;">'+nrOfPages+'</a>');
			}else{
				pageList.push('<a href="javascript:void(0)" class="o-nav" data-page="'+nrOfPages+'">'+nrOfPages+'</a>');
			}

	 }
 }//nrOfPages > 1

	let pagination = document.createElement('div');
		pagination.setAttribute('id', 'pagination'); //add id
		pagination.setAttribute('style','display: flex; margin-top:20px; justify-content: space-between;');
	let btnDisplay = document.createElement('div');
	let next = currentPage == nrOfPages || nrOfPages == 0 ? '' : ' | <a href="javascript:void(0)" class="o-nav" data-page="next">Next</a>';
	let prev = currentPage == 1  || nrOfPages < 1 ? '' : '<a href="javascript:void(0)" class="o-nav" data-page="prev">Prev</a> | ';
	    btnDisplay.innerHTML = prev + pageList.join(" ") + next;
	let pagInfo = document.createElement('div');
	    pagInfo.innerHTML = " page: "+ currentPage + " of " + nrOfPages;

   	    pagination.appendChild(btnDisplay);
	    pagination.appendChild(pagInfo);
    return pagination;

}//pagination
/* color change */
function changeColor(compareType, value){

	//`chromium`, `nickel`, `carbon`, `manganese`, `silicon`, `phosphorus`, `sulphur`, `nitrogen`, `tensile_strength`, `elongation`, `tolerance`
	let r = "";
	let colorVal = '<span style="color:'+compareType[2]+';">'+value+'</span>';
	switch (compareType[3]) {

		  //WIRE
		  case 'max':
				r = value > compareType[4] ? colorVal : value;
			break;
		  case 'min':
				r = value < compareType[4] ? colorVal : value;
			break;
		  case 'max_min':
				r = value > compareType[4] || value < compareType[5] ? colorVal : value;
			break;
		  default:
				r = "N/A";
		}

		return r;
}//changeColor
/* Alert Massage */
function mainalerts(result){
	if(typeof result == 'undefined'){
		let result = {alertmsg:'Empty message',alertstatus:4}
	}
  if(isEmpty(result['alertmsg'])){result['alertmsg']="ERROR: 0";}
  if(isEmpty(result['alertstatus'])){result['alertstatus']=4;}
  let alertStatus = "border:1px solid tomato;";
  let icon = '&#x2717;'; // default err
  switch(result['alertstatus']) {
      case 1: //// INFO:
          alertStatus = "border:1px solid #2196F3 !important;";
          icon = '&#9432;';
          break;
      case 2: //// WARNING:
          alertStatus = "border:1px solid #ff9800 !important;";
          icon = '&#x26A0;';
          break;
      case 3://// SUCCESS:
          alertStatus = "border:1px solid #4CAF50 !important;";
          icon = '&#x2713;';
          break;
      default:
          // error is default 0 or 4
  }
//check if old pop exists::::
if(document.querySelector('.o-popalert') != null){ //check if it exists and remove it if so
    let removePop = document.querySelectorAll('.o-popalert');
		removePop.forEach((drop) => {
			drop.removeEventListener('click', onClickHandlerAlerts, false);
			drop.parentNode.removeChild(document.querySelector('.o-popalert'));
		});
}
//create div here::::::
let alertPop = document.createElement('div');
    alertPop.setAttribute("class","o-popalert");
let topBottom = 'bottom';
if(isMobile()){
  topBottom = 'top';
}
alertPop.setAttribute('style', 'min-width: 30%;padding: 20px;background-color:whitesmoke;color: #111;border-radius: 2px;padding: 16px;position: fixed;z-index: 999999;'+topBottom+':0%; left: 50%;transform: translateX(-50%);box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);'+alertStatus); //add css
alertPop.innerHTML = icon+'  '+result['alertmsg'];
document.body.appendChild(alertPop); //append alertPop
//animation
let i = 1;
let animate = setInterval(function(){
	if(topBottom == 'top'){
		alertPop.style.top = i+'%';
	}else{
		alertPop.style.bottom = i+'%';
	}
	i++;
	if(i == 10)
	clearInterval(animate);
}, 5);

var onClickHandlerAlerts = function (event) {

  if (document.body.contains(alertPop)){
    document.body.removeEventListener('click', onClickHandlerAlerts, false);
		//document.body.removeEventListener('touchstart', onClickHandlerAlerts, false);
    document.body.removeChild(alertPop);
  } //check if it exists
};

document.body.addEventListener('click', onClickHandlerAlerts, false);
//document.body.addEventListener('touchend', onClickHandlerAlerts, false);
setTimeout(onClickHandlerAlerts, 5000); //remove dive after 5 sec

}//main alerts
/*cookies*/
function getCookie(name) {let v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');return v ? v[2] : null;}
function setCookie(name, value) {document.cookie = name + "=" + value;}
function deleteCookie(name) { setCookie(name, '', -1); }
/* check if it's a mobile device */
function isMobile() {
  try{ document.createEvent("TouchEvent"); return true; }
  catch(e){ return false; }
}
/* CUSTOM AJAX/FETCH for sending and receiving JSON data */
let fetchx = {};
fetchx.post = function (url, data, callback) {
	let svgLoader =  document.createElement('div');
			svgLoader.setAttribute('style','position:fixed;top:0;width:100%;');
			svgLoader.innerHTML = '<svg version="1.1"class="svg-divider"xmlns="http://www.w3.org/2000/svg"xmlns:xlink="http://www.w3.org/1999/xlink"x="0px"y="0px"viewBox="0 0 80 3" xml:space="preserve"><rect x="1"fill="tomato"width="16"height=".1"><animate attributeName="x"attributeType="XML"values="1; 64; 1"begin="0s" dur="1.5s" repeatCount="indefinite" /></rect>';
			document.body.appendChild(svgLoader);

  //check if browser supports fetch, if not use ajax
  if('fetch' in window){
      fetchx.fetch(url,callback,data,svgLoader);
  }else{
      fetchx.ajax(url,callback,data,svgLoader);
  }
};
fetchx.ajax = function(url,callback,data,svgLoader){

  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      callback(JSON.parse(this.responseText),0);
      document.body.removeChild(svgLoader); //remove loader
    }else{
      //callback(this.responseText),this.statusText);
      document.body.removeChild(svgLoader); //remove loader
    }
  };
  xhttp.open("POST", url, true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send(JSON.stringify(data));
}
fetchx.fetch = function(url,callback,data,svgLoader){
  fetch(url, {
    mode: "same-origin",
    credentials: "same-origin",
    method: 'POST', // or 'PUT'
    body: JSON.stringify(data), // data can be `string` or {object}!
    headers:{
      'Content-Type': 'application/json'
    }
  })
	.then((response) => {
	  if (response.ok)
		return response.json();
	   else
		throw new Error(response.status);
	})
  .catch(function(error) { callback(0,error);})
  .then(function(response) {
	    if(typeof response !="undefined")
		   callback(response,0);
	       document.body.removeChild(svgLoader);
  });

}
/* using fetchX */
function postData(objJson){
if(typeof objJson.url == 'undefined' || objJson.url == ''){
	mainalerts({alertmsg:'The "url" is not defined or it is empty',alertstatus:4});
}else{
	/*pass the url info, used for navigation if need be */
	objJson.href = window.location.href;
	objJson.hash = window.location.hash;
	fetchx.post(objJson.url, {objJson}, function(response,err) {
  if(typeof objJson.password != 'undefined')
	 delete objJson.password;
	 console.log(response);
	  /* ERRORS */
		if(typeof response == 'undefined' || response == null || err != 0){
			mainalerts({alertmsg:'Cannot reach the server or null returned! '+err,alertstatus:4});
		}else{
			/* GOT RESPONSE */
			//append local objects
			if(typeof response != 'undefined')
			  if(typeof objJson.localObj !== 'undefined') //delete old localObj
				 delete objJson.localObj;
			   response['localObj'] = objJson; //add new one
				 main(response);

				 /* ALL ALERTS FROM SERVER */
			 if(typeof response != 'undefined'){
				 if(typeof response.alerts != 'undefined')
				   mainalerts(response.alerts);
						//document.querySelector('.closebtn').click();
			 }
		}
	});
}//typeof objJson.url == 'undefined'

}//postData
// stuff visible in namespace object
return {
	main : main,
	postData : postData
};
})(); //end ns
