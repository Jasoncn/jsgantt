/* 
   _        ___            _   _     _   ____  
  (_)___   / _ \__ _ _ __ | |_| |_  / | |___ \ 
  | / __| / /_\/ _` | '_ \| __| __| | |   __) |
  | \__ \/ /_\\ (_| | | | | |_| |_  | |_ / __/ 
 _/ |___/\____/\__,_|_| |_|\__|\__| |_(_)_____|
|__/ 

Copyright (c) 2009, Shlomy Gantz BlueBrick Inc. All rights reserved.
 
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Shlomy Gantz or BlueBrick Inc. nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY SHLOMY GANTZ/BLUEBRICK INC. ''AS IS'' AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL SHLOMY GANTZ/BLUEBRICK INC. BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */



var vTimeout = 0;
var vBenchTime = new Date().getTime();




// Recursively process task tree ... set min, max dates of parent tasks and identfy task level.
JSGantt.processRows = function(pList, pID, pRow, pLevel, pOpen) {

	var vMinDate = new Date();
	var vMaxDate = new Date();
	var vMinSet = 0;
	var vMaxSet = 0;
	var vList = pList;
	var vLevel = pLevel;
	var i = 0;
	var vNumKid = 0;
	var vCompSum = 0;
	var vVisible = pOpen;

	for (i = 0; i < pList.length; i++) {

		if (pList[i].getParent() == pID) {
			vVisible = pOpen;
			pList[i].setVisible(vVisible);
			if (vVisible == 1 && pList[i].getOpen() == 0)
				vVisible = 0;

			pList[i].setLevel(vLevel);
			vNumKid++;

			if (pList[i].getGroup() == 1) {
				JSGantt.processRows(vList, pList[i].getID(), i, vLevel + 1,
						vVisible);
			}

			if (vMinSet == 0 || pList[i].getStart() < vMinDate) {
				vMinDate = pList[i].getStart();
				vMinSet = 1;
			}

			if (vMaxSet == 0 || pList[i].getEnd() > vMaxDate) {
				vMaxDate = pList[i].getEnd();
				vMaxSet = 1;
			}

			vCompSum += pList[i].getCompVal();

		}
	}

	if (pRow >= 0) {
		pList[pRow].setStart(vMinDate);
		pList[pRow].setEnd(vMaxDate);
		pList[pRow].setNumKid(vNumKid);
		pList[pRow].setCompVal(Math.ceil(vCompSum / vNumKid));
	}

}



// This function finds the document id of the specified object

JSGantt.findObj = function(theObj, theDoc){
	
	var p, i, foundObj;
/**
	if (!theDoc)
		theDoc = document;

	if ((p = theObj.indexOf("?")) > 0 && parent.frames.length) {

		theDoc = parent.frames[theObj.substring(p + 1)].document;

		theObj = theObj.substring(0, p);

	}

	if (!(foundObj = theDoc[theObj]) && theDoc.all)

		foundObj = theDoc.all[theObj];

	for (i = 0; !foundObj && i < theDoc.forms.length; i++)

		foundObj = theDoc.forms[i][theObj];

	for (i = 0; !foundObj && theDoc.layers && i < theDoc.layers.length; i++)

		foundObj = JSGantt.findObj(theObj, theDoc.layers[i].document);
		**/

	if (!foundObj && document.getElementById)

		foundObj = document.getElementById(theObj);

	return foundObj;

}

JSGantt.changeFormat = function(pFormat, ganttObj) {

	//	alert(ganttObj)
	//	console.info(ganttObj)

	if (ganttObj)

	{

		ganttObj.setFormat(pFormat);

		ganttObj.drawDependencies();

	}

	else

		alert('Chart undefined');

}

// Function to open/close and hide/show children of specified task

JSGantt.folder = function(pID, ganttObj) {  //组折叠，展开

	var vList = ganttObj.getTaskItems();

	for (i = 0; i < vList.length; i++) {
		if (vList[i].getID() == pID) {

			if (vList[i].getOpen() == 1) {
				vList[i].setOpen(0);
				JSGantt.hide(pID, ganttObj);

				if (JSGantt.isIE())
					JSGantt.findObj('group_' + pID).innerText = '+';
				else
					JSGantt.findObj('group_' + pID).textContent = '+';

			} else {

				vList[i].setOpen(1);

				JSGantt.show(pID, 1, ganttObj);

				if (JSGantt.isIE())
					JSGantt.findObj('group_' + pID).innerText = 'group';
				else
					JSGantt.findObj('group_' + pID).textContent = 'group';

			}

		}
	}
}

JSGantt.hide = function(pID, ganttObj) {  //组折叠
	var vList = ganttObj.getTaskItems();
	var vID = 0;

	for (var i = 0; i < vList.length; i++) {
		if (vList[i].getParent() == pID) {
			vID = vList[i].getID();
			JSGantt.findObj('child_' + vID).style.display = "none";
			JSGantt.findObj('childgrid_' + vID).style.display = "none";
			vList[i].setVisible(0);
			if (vList[i].getGroup() == 1)
				JSGantt.hide(vID, ganttObj);
		}

	}
}

// Function to show children of specified task
JSGantt.show = function(pID, pTop, ganttObj) { //组展开
	var vList = ganttObj.getTaskItems();
	var vID = 0;

	for (var i = 0; i < vList.length; i++) {
		if (vList[i].getParent() == pID) {
			vID = vList[i].getID();
			if (pTop == 1) {
				if (JSGantt.isIE()) { // IE;

					if (JSGantt.findObj('group_' + pID).innerText == '+') {
						JSGantt.findObj('child_' + vID).style.display = "";
						JSGantt.findObj('childgrid_' + vID).style.display = "";
						vList[i].setVisible(1);
					}

				} else {

					if (JSGantt.findObj('group_' + pID).textContent == '+') {
						JSGantt.findObj('child_' + vID).style.display = "";
						JSGantt.findObj('childgrid_' + vID).style.display = "";
						vList[i].setVisible(1);
					}

				}

			} else {

				if (JSGantt.isIE()) { // IE;
					if (JSGantt.findObj('group_' + pID).innerText == '�') {
						JSGantt.findObj('child_' + vID).style.display = "";
						JSGantt.findObj('childgrid_' + vID).style.display = "";
						vList[i].setVisible(1);
					}

				} else {

					if (JSGantt.findObj('group_' + pID).textContent == '�') {
						JSGantt.findObj('child_' + vID).style.display = "";
						JSGantt.findObj('childgrid_' + vID).style.display = "";
						vList[i].setVisible(1);
					}
				}
			}

			if (vList[i].getGroup() == 1)
				JSGantt.show(vID, 0, ganttObj);

		}
	}
}

// function to open window to display task link

JSGantt.taskLink = function(pRef, pWidth, pHeight)

{

	if (pWidth)
		vWidth = pWidth;
	else
		vWidth = 400;
	if (pHeight)
		vHeight = pHeight;
	else
		vHeight = 400;

	var OpenWindow = window.open(pRef, "newwin", "height=" + vHeight
					+ ",width=" + vWidth);

}

JSGantt.parseDateStr = function(pDateStr, pFormatStr) {
	var vDate = new Date();
	vDate.setTime(Date.parse(pDateStr));

	switch (pFormatStr) {
		case 'mm/dd/yyyy' :
			var vDateParts = pDateStr.split('/');
			vDate.setFullYear(parseInt(vDateParts[2], 10), parseInt(
							vDateParts[0], 10)
							- 1, parseInt(vDateParts[1], 10));
			break;
		case 'dd/mm/yyyy' :
			var vDateParts = pDateStr.split('/');
			vDate.setFullYear(parseInt(vDateParts[2], 10), parseInt(
							vDateParts[1], 10)
							- 1, parseInt(vDateParts[0], 10));
			break;
		case 'yyyy-mm-dd' :
			var vDateParts = pDateStr.split('-');
			vDate.setFullYear(parseInt(vDateParts[0], 10), parseInt(
							vDateParts[1], 10)
							- 1, parseInt(vDateParts[1], 10));
			break;
	}

	return (vDate);

}

JSGantt.formatDateStr = function(pDate, pFormatStr) {
    if(pDate){
	vYear4Str = pDate.getFullYear() + '';
	vYear2Str = vYear4Str.substring(2, 4);
	vMonthStr = (pDate.getMonth() + 1) + '';
	vDayStr = pDate.getDate() + '';

	var vDateStr = "";

	switch (pFormatStr) {
		case 'mm/dd/yyyy' :
			return (vMonthStr + '/' + vDayStr + '/' + vYear4Str);
		case 'dd/mm/yyyy' :
			return (vDayStr + '/' + vMonthStr + '/' + vYear4Str);
		case 'yyyy-mm-dd' :
			return (vYear4Str + '-' + vMonthStr + '-' + vDayStr);
		case 'mm/dd/yy' :
			return (vMonthStr + '/' + vDayStr + '/' + vYear2Str);
		case 'dd/mm/yy' :
			return (vDayStr + '/' + vMonthStr + '/' + vYear2Str);
		case 'yy-mm-dd' :
			return (vYear2Str + '-' + vMonthStr + '-' + vDayStr);
		case 'mm/dd' :
			return (vMonthStr + '/' + vDayStr);
		case 'dd/mm' :
			return (vDayStr + '/' + vMonthStr);
	}

    }
}

JSGantt.parseXML = function(file, pGanttVar) { //xml解析起点
	var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1; // Is this Chrome 

	try { //Internet Explorer  
		xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
	} catch (e) {
		try { //Firefox, Mozilla, Opera, Chrome etc. 
			if (is_chrome == false) {
				xmlDoc = document.implementation.createDocument("", "", null);
			}
		} catch (e) {
			alert(e.message);
			return;
		}
	}

	if (!is_chrome) { // can't use xmlDoc.load in chrome at the moment // 非google浏览器
		xmlDoc.async = false;
		xmlDoc.load(file); // we can use  loadxml
		JSGantt.addTasksForOthers(pGanttVar)
		xmlDoc = null; // a little tidying
		Task = null;
	} else {  //googe 浏览器
		JSGantt.addTasksForChrome(file, pGanttVar);
		ta = null; // a little tidying	
	}
}








JSGantt.benchMark = function(pItem) {
	var vEndTime = new Date().getTime();
	alert(pItem + ': Elapsed time: ' + ((vEndTime - vBenchTime) / 1000)
			+ ' seconds.');
	vBenchTime = new Date().getTime();
}
