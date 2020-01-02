window.onscroll = function(){

	if (document.all.going_origin){
		document.all.going_origin.style.visibility = "visible";
	}
};

function makingPoints(tagObj, pos){

	var e = document.getElementsByTagName("area");
	for (var j = 0; j < e.length; j++) {
		var eTemp = e[j];
		var coordinate = eTemp.coords.split(',');
		var coordinateTop = new Array(), coordinateTopCount = 0;
		var coordinateLeft = new Array(), coordinateLeftCount = 0;
		for (var i = 0; i < coordinate.length; i++)
			if ((i % 2) == 0)
				coordinateLeft[coordinateLeftCount++] = coordinate[i];
			else
				coordinateTop[coordinateTopCount++] = coordinate[i];
		coordinateTop.sort(function(a, b){return b - a;});
		var menuTop = coordinateTop[0];

		coordinateTop.sort(function(a, b){return a - b;});
		coordinateLeft.sort(function(a, b){return a - b;});

		var comId = eTemp.getAttribute("onMouseOver").toString().split("'")[1];
		tagObj.insertAdjacentHTML(pos, "<div id='" + comId + "' onmouseover=\"processingMenu('" + comId + "',new Array(" + menuTop + "," + coordinateLeft[0] + "),this);\" onmouseout=\"onMouseOutChoice();\" style='display:none;position:absolute;top:" + (parseInt(coordinateTop[0]) - 5) + "px;left:" + (parseInt(coordinateLeft[0]) - 5) + "px;background:url(images/go.png) no-repeat;width:31px;height:32px;'></div>");
	}
}

function hidingAllPoints(){

	var e = document.getElementsByTagName("area");
	for (var j = 0; j < e.length; j++) {
		var eTemp = e[j];
		//尋找公司名稱
		var comId = eTemp.getAttribute("onMouseOver").toString().split("'")[1];
		if (comId != "")
			document.getElementById(comId).style.display = "none";
	}
}

function findingTarget(mode, cs_query){

	hidingAllPoints();

	if (cs_query.indexOf("請輸入欲查詢的關鍵字...") != -1 || cs_query == "") {
		document.all.cs_search.my_query.select();
		return false;
	}

	var cs_result = FunSQL(parseInt(mode), cs_query);
	var my_counter = 0;
	var coordinate = Array();
	for (var i = 0; i < cs_result.length; i++)
		try {
			if (parseInt(cs_result[i][4])) {
				document.getElementById(cs_result[i][4]).style.display = "";
				coordinate[i] = new Array(parseInt(document.getElementById(cs_result[i][4]).style.left.replace("px", "")), parseInt(document.getElementById(cs_result[i][4]).style.top.replace("px", "")))
				my_counter++;
			}
		}
		catch (e) {};
	alert("搜尋到 " + my_counter + " 筆資料");

	coordinate.sort(function(a, b){return a[0] - b[0];});
	scrollTo(coordinate[0][0] - 80, coordinate[0][1]);
	document.all.going_origin.style.visibility = "visible";

	return true;
}

//滑鼠移動
function showChoiceMenu(id_no, e){

    var coordinate = e.coords.split(',');
    var coordinateTop = new Array(), coordinateTopCount = 0;
    var coordinateLeft = new Array(), coordinateLeftCount = 0;
	for (var i = 0; i < coordinate.length; i++)
		if ((i % 2) == 0) coordinateLeft[coordinateLeftCount++] = coordinate[i];
        else coordinateTop[coordinateTopCount++] = coordinate[i];
	coordinateTop.sort(function(a, b){return b - a;});
	coordinateLeft.sort(function(a, b){return a - b;});
	processingMenu(id_no, new Array(coordinateTop[0], coordinateLeft[0]), e);
}



//滑鼠移動
function processingMenu(id_no, coordinate, e){

    if (id_no != "") {
        var cs_present = FunSQL_ID(id_no);
        document.all.map_1.style.cursor = 'hand';
        DohiddenChoiceMenu();
        document.all.cs_form.map_id.value = id_no;
        document.all.com_choice.style.top = parseInt(coordinate[0]) - 5;
        document.all.com_choice.style.left = parseInt(coordinate[1]) + 5;

        if (cs_present[0][1] != "&nbsp;" && cs_present[0][1] != "") {
            document.getElementById("m_company").style.letterSpacing = "0";
            document.getElementById("m_company").style.padding = "5px";
            document.getElementById("m_company").style.width = "500px";
            document.getElementById("m_company").style.background = "none repeat scroll 0% 0% rgb(244, 102, 0)";
            document.getElementById("m_company").style.color = "rgb(255, 255, 255)";
            document.getElementById("m_company").innerHTML = cs_present[0][1];
        }
        else {
            document.getElementById("m_company").innerHTML = "參展單位";
        }
        document.getElementById("com_product").innerHTML = "";
        var myText = "";
        if (cs_present[0][2][0] != "&nbsp;" && cs_present[0][2][0] != "")
        myText = cs_present[0][2][0];
        else
            myText = "展出產品";
        document.getElementById("com_product").innerHTML += "<div onclick=\"GoProductByPID('" + id_no + "','" + cs_present[0][3][0] + "');document.all.com_choice.style.display='none';\" onmouseover=\"this.style.background='#F0FFF0';this.style.color='#CC6600';\" onmouseout=\"this.style.background='#F0FFF0';this.style.color='#00017D';\" style='width: 500px; padding: 5px; text-align: left; background: none repeat scroll 0% 0% rgb(240, 255, 240); color: rgb(0, 1, 125);'>" + myText + "</div>";
        document.all.com_choice.style.display = "";
    }
    else {
        e.href = "#";
        document.all.cs_form.map_id.value = "";
    }
}

function onMouseOutChoice(){

	document.all.map_1.style.cursor = "text";
	hiddenChoiceMenu();
	status = "";
}

window.ChoiceMenuFlag = null;
function DohiddenChoiceMenu(){
  var Today=new Date();
	//alert("今天日期是 " + Today.getFullYear()+ " 年 " + (Today.getMonth()+1) + " 月 " + Today.getDate() + " 日");
	document.all.com_choice.style.display = "none";
	clearInterval(window.ChoiceMenuFlag);
}

function hiddenChoiceMenu(){

	if (window.ChoiceMenuFlag)
		clearInterval(window.ChoiceMenuFlag);
	window.ChoiceMenuFlag = (DohiddenChoiceMenu, 100);
}

function FunSQL_ID(id_no){

    var cs_result=new Array();
    for (var i = 0; i < cs_src.length; i++) {
        if (FunKind_ID(i, id_no) != -1 && id_no != "") {
            var n = cs_result.length;
            cs_result[n] = new Array();
            cs_result[n][0] = cs_src[i][0];
            cs_result[n][1] = cs_src[i][1];
            cs_result[n][2] = cs_src[i][2];
            cs_result[n][3] = cs_src[i][3];
            cs_result[n][4] = cs_src[i][4];
        }
    }
    if (cs_result.length == 0) {
        var n = cs_result.length;
        cs_result[n] = new Array();
        cs_result[n][0] = '&nbsp;';
        cs_result[n][1] = '&nbsp;';
        cs_result[n][2] = new Array('&nbsp;');
        cs_result[n][3] = new Array('&nbsp;');
        cs_result[n][4] = '&nbsp;';
    }
    return cs_result;
}

function FunKind_ID(i, id_no){

    return cs_src[i][4].indexOf(id_no);
}

function FunKind(i, cs_kind, cs_query){

    if (cs_kind == 1)
        return cs_src[i][cs_kind].indexOf(cs_query);
    if (cs_kind == 2)
        return cs_src[i][cs_kind].join('€').indexOf(cs_query);
    if (cs_kind == 0) {
        var cs_list = cs_src[i][1] + '€' + cs_src[i][2].join('€');
        return cs_list.indexOf(cs_query);
    }
}

function FunSQL(cs_kind, cs_query){

    var cs_result = new Array();
    for (var i = 0; i < cs_src.length; i++) {
        if (FunKind(i, cs_kind, cs_query) != -1) {
            var n = cs_result.length;
            cs_result[n] = new Array();
            cs_result[n][0] = cs_src[i][0];
            cs_result[n][1] = cs_src[i][1];
            cs_result[n][2] = cs_src[i][2];
            cs_result[n][3] = cs_src[i][3];
            cs_result[n][4] = cs_src[i][4];
        }
    }

    if (cs_result.length == 0) {
        var n = cs_result.length;
        cs_result[n] = new Array();
        cs_result[n][0] = '&nbsp;';
        cs_result[n][1] = '&nbsp;';
        cs_result[n][2] = new Array('&nbsp;');
        cs_result[n][3] = new Array('&nbsp;');
        cs_result[n][4] = '&nbsp;';
    }
    return (cs_result);
}

function get_company1(){
	var Today=new Date();
alert("今天日期是 " + Today.getFullYear()+ " 年 " + (Today.getMonth()+1) + " 月 " + Today.getDate() + " 日" + Today.getHours() + " 點" + Today.getMinutes() + " 分" );

}

function get_company123(id_no){
	if(id_no.style.display=="block"){
		id_no.style.display="none";	
	} else {
		id_no.style.display="block";
	}
}


//評分
var time=1;
function get_result1(id_no){
	if(id_no.style.display=="block"){
		id_no.style.display="none";	
	} else {
		id_no.style.display="block";
	}

      var sufuStar = function (){
        //工具函数
        function gbyId(id){return document.getElementById(id);}


          function addEvent(elem,type,func){ //兼容IE
            if(elem.addEventListener){
              elem.addEventListener(type,func,false)
            }else if(elem.attachEvent){
              elem.attachEvent('on'+type,func)
            }
          }

        function getIndex(event) { //兼容IE
          var e = event || window.event;
          var t = e.target || e.srcElement;
          if (t.tagName.toLowerCase() === 'a') {
            return parseInt(t.innerHTML);
          }
        }
        function showInfo(index,msg){
          var info = gbyId('star-info');
          info.style.display = 'block';
          info.style.left = index*21-51+'px';
          info.innerHTML = "<strong> "+index+'分 '+msg[index-1].match(/(.+)\|/)[1]+'<br />'+'</strong>'+msg[index-1].match(/\|(.+)/)[1];
        }
		
		
        function appenStar(elem,nums){

		  var frag = document.createDocumentFragment(); //为了提高性能,因使用DocumentFragment一次性append,这样页面只重新渲染一次					
			
          for(var i = 0;i<nums;i++){
            var a =document.createElement('a');
            a.innerHTML = i+1;
            a.href = "javascript:;"; //阻止浏览器的点击链接的默认行为
            frag.appendChild(a);
          }
          elem.appendChild(frag);
        }
		
        //主体函数
        function star(num,myMsg){
          var n = num||5; //当num有值则取其值,无值则取默认值5;
          var clickStar=curentStar=0; //clickStar保存点击状态
          /*var msg = myMsg||[
            "很不滿意|差得太離譜，與賣家描述嚴重不符，非常不滿",
            "不滿意|部分有破損，與賣家描述的不符，不滿意",
            "一般|質量一般，没有賣家描述的那么好",
            "滿意|質量不錯，與賣家描述的基本一致，還是挺滿意的",
            "非常滿意|質量非常好，與賣家描述的完全一致，非常滿意"
          ];*/
		  
            var starContainer = gbyId('star-div');
			if(time == 1) {
				appenStar(starContainer,n);
				time+=1;
			}
			
            addEvent(starContainer,'mouseover',over); //采用事件代理模式(通过<a>标签的父元素starContainer来代理事件)
            addEvent(starContainer,'mouseout',out);
            addEvent(starContainer,'click',click);
		  
          function over(event){
            if(getIndex(event)){ //若getIndex(event)取不到值,说明当前触发事件的目标不是<a>标签
              var index = getIndex(event);
              change(index);
              showInfo(index,msg);
            }
          }
          function out(event){
            change(); //将评分设为已点击状态clickStar
            gbyId('star-info').style.display = 'none'
          }
          function click(event) {
            if (getIndex(event)) {
              var index = getIndex(event);
              clickStar = index; //保存点击状态
              gbyId('star-info').style.display = 'none';
              gbyId('star-span').innerHTML = "<strong>" + index + '分 ' + msg[index - 1].match(/(.+)\|/)[1] + '</strong>'+'<br />'+ msg[index - 1].match(/\|(.+)/)[1];
            }
          }
          function change(index){
            curentStar = index||clickStar;
            for(var i=0;i<n;i++){
              starContainer.children[i].className = i<curentStar ? 'on' : ''
            }
          }
        }
        return {
          star:star
		  
        }
      }(); //这里的()表示函数立即执行,这样变量sufuStar才能调用匿名函数的返回值star
      //调用执行: sufuStar.star(num,myMsg),参数可为空,参数num,myMsg将设为默认值
      sufuStar.star();
}

//滑鼠點擊
function get_company(id_no){
  //alert("視窗內之文字");
	cs_present = FunSQL_ID(id_no);
	cs_record = 0;
	document.cs_form.cs_id.value = cs_present[cs_record][4];
	document.cs_form.cs_row.value = cs_record;
	var PopID;
	PopID = window.open('companyDate.php?cseq=' + id_no + '&cyear=31' + '');
	PopID.focus();
}

function GoProductByPID(id_no, pid){

	document.cs_form.cs_id.value = id_no;
	document.cs_form.cs_pid.value = pid;
	var PopID;
	PopID = window.open('companyDate.php?cseq=' + id_no + '&cyear=31' + '');
	PopID.focus();
}

function GoProduct(id_no, in_pid){

    cs_present = FunSQL_ID(id_no);
    cs_record = 0;
    document.cs_form.cs_id.value = cs_present[cs_record][4];
    document.cs_form.cs_pid.value = cs_present[cs_record][3][in_pid];
    document.cs_form.cs_row.value = cs_record;
    var PopID;
    PopID = window.open('data.html', 'winId', 'resizable=yes,scrollbars=yes,top=0,left=0,status=no,width=660,height=567');
    PopID.focus();
}

