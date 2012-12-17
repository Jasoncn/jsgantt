/**
 * Created with JetBrains WebStorm.
 * User: charlie
 * Date: 12-12-6
 * Time: 下午1:23
 * To change this template use File | Settings | File Templates.
 */
window.JSGantt={};


// function that loads the main gantt chart properties and functions
// pDiv: (required) this is a DIV object created in HTML
// pStart: UNUSED - future use to force minimum chart date
// pEnd: UNUSED - future use to force maximum chart date
// pWidth: UNUSED - future use to force chart width and cause objects to scale to fit within that width
// pShowRes: UNUSED - future use to turn on/off display of resource names
// pShowDur: UNUSED - future use to turn on/off display of task durations
// pFormat: (required) - used to indicate whether chart should be drawn in "day", "week", "month", or "quarter" format
//used to indicate whether cart should be drawn in 'day','week','month',or 'quarter' format
// pCationType - what type of Caption to show:  Caption, Resource, Duration, Complete
JSGantt.GanttChart = function(pGanttVar, pDiv, pFormat) //初始化甘特图，初始化实体属性，程序运行起点
{

    //	console.info(pGanttVar);
    var vGanttVar = pGanttVar; //甘特图变量的应用 g
    var vDiv = pDiv; //显示gantt图的容器
    var vFormat = pFormat; //日视图/月视图/年视图
    var vShowRes = 1;
    var vShowDur = 1;
    var vShowComp = 1;
    var vShowStartDate = 1;
    var vShowEndDate = 1;
    var vDateInputFormat = "mm/dd/yyyy";
    var vDateDisplayFormat = "mm/dd/yy";
    var vNumUnits = 0;
    var vCaptionType;
    var vDepId = 1;
    var vTaskList = new Array(); //任务集合
    var vFormatArr = new Array('minute', 'hour', "day", 'three', "week",
        "month", "quarter");
    var vQuarterArr = new Array(1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4);
    var vMonthDaysArr = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30,
        31);
    var vMonthArr = new Array("January", "February", "March", "April", "May",
        "June", "July", "August", "September", "October", "November",
        "December");
    this.setFormatArr = function() {
        vFormatArr = new Array();
        for (var i = 0; i < arguments.length; i++) {
            vFormatArr[i] = arguments[i];
        }
        if (vFormatArr.length > 4) {
            vFormatArr.length = 4;
        }
    };
    this.setShowRes = function(pShow) {
        vShowRes = pShow;
    };
    this.setShowDur = function(pShow) {
        vShowDur = pShow;
    };
    this.setShowComp = function(pShow) {
        vShowComp = pShow;
    };
    this.setShowStartDate = function(pShow) {
        vShowStartDate = pShow;
    };
    this.setShowEndDate = function(pShow) {
        vShowEndDate = pShow;
    };
    this.setDateInputFormat = function(pShow) {
        vDateInputFormat = pShow;
    };
    this.setDateDisplayFormat = function(pShow) {
        vDateDisplayFormat = pShow;
    };
    this.setCaptionType = function(pType) {
        vCaptionType = pType
    };
    this.setFormat = function(pFormat) {
        vFormat = pFormat;
        this.draw();
    };

    this.getShowRes = function() {
        return vShowRes
    };
    this.getShowDur = function() {
        return vShowDur
    };
    this.getShowComp = function() {
        return vShowComp
    };
    this.getShowStartDate = function() {
        return vShowStartDate
    };
    this.getShowEndDate = function() {
        return vShowEndDate
    };
    this.getDateInputFormat = function() {
        return vDateInputFormat
    };
    this.getDateDisplayFormat = function() {
        return vDateDisplayFormat
    };
    this.getCaptionType = function() {
        return vCaptionType
    };
    this.CalcTaskXY = function() {
        var vList = this.getTaskItems();
        var vTaskDiv;
        var vParDiv;
        var vLeft, vTop, vHeight, vWidth;

        for (i = 0; i < vList.length; i++) {
            vID = vList[i].getID();
            vTaskDiv = document.getElementById("taskbar_" + vID);
            vBarDiv = document.getElementById("bardiv_" + vID);
            vParDiv = document.getElementById("childgrid_" + vID);

            if (vBarDiv) {
                vList[i].setStartX(vBarDiv.offsetLeft);
                vList[i].setStartY(vParDiv.offsetTop + vBarDiv.offsetTop + 6);
                vList[i].setEndX(vBarDiv.offsetLeft + vBarDiv.offsetWidth);
                vList[i].setEndY(vParDiv.offsetTop + vBarDiv.offsetTop + 6);
            }
        }
    }

    this.addTaskItems = function(value) //向集合中加入taskItem
    {
        vTaskList.push(value);
    }

    this.getTaskItems = function() {
        return vTaskList
    }; //返回task集合

    this.clearDependencies = function() //Clears dependency lines between tasks
    {
        var parent = document.getElementById('rightside');
        var depLine;
        var vMaxId = vDepId;
        for (i = 1; i < vMaxId; i++) {
            depLine = document.getElementById("line" + i);
            if (depLine) {
                parent.removeChild(depLine);
            }
        }
        vDepId = 1;
    }

    // sLine: Draw a straight line (colored one-pixel wide DIV), need to parameterize doc item
    this.sLine = function(x1, y1, x2, y2) {

        vLeft = Math.min(x1, x2);
        vTop = Math.min(y1, y2);
        vWid = Math.abs(x2 - x1) + 1;
        vHgt = Math.abs(y2 - y1) + 1;

        vDoc = document.getElementById('rightside');

        // retrieve DIV
        var oDiv = document.createElement('div');

        oDiv.id = "line" + vDepId++;
        oDiv.style.position = "absolute";
        oDiv.style.margin = "0px";
        oDiv.style.padding = "0px";
        oDiv.style.overflow = "hidden";
        oDiv.style.border = "0px";

        // set attributes
        oDiv.style.zIndex = 0;
        oDiv.style.backgroundColor = "red";

        oDiv.style.left = vLeft + "px";
        oDiv.style.top = vTop + "px";
        oDiv.style.width = vWid + "px";
        oDiv.style.height = vHgt + "px";

        oDiv.style.visibility = "visible";

        vDoc.appendChild(oDiv);

    }

    // dLine: Draw a diaganol line (calc line x,y paisrs and draw multiple one-by-one sLines)
    this.dLine = function(x1, y1, x2, y2) {

        var dx = x2 - x1;
        var dy = y2 - y1;
        var x = x1;
        var y = y1;

        var n = Math.max(Math.abs(dx), Math.abs(dy));
        dx = dx / n;
        dy = dy / n;
        for (i = 0; i <= n; i++) {
            vx = Math.round(x);
            vy = Math.round(y);
            this.sLine(vx, vy, vx, vy);
            x += dx;
            y += dy;
        }

    }

    this.drawDependency = function(x1, y1, x2, y2) {
        if (x1 + 10 < x2) {
            this.sLine(x1, y1, x1 + 4, y1);
            this.sLine(x1 + 4, y1, x1 + 4, y2);
            this.sLine(x1 + 4, y2, x2, y2);
            this.dLine(x2, y2, x2 - 3, y2 - 3);
            this.dLine(x2, y2, x2 - 3, y2 + 3);
            this.dLine(x2 - 1, y2, x2 - 3, y2 - 2);
            this.dLine(x2 - 1, y2, x2 - 3, y2 + 2);
        } else {
            this.sLine(x1, y1, x1 + 4, y1);
            this.sLine(x1 + 4, y1, x1 + 4, y2 - 10);
            this.sLine(x1 + 4, y2 - 10, x2 - 8, y2 - 10);
            this.sLine(x2 - 8, y2 - 10, x2 - 8, y2);
            this.sLine(x2 - 8, y2, x2, y2);
            this.dLine(x2, y2, x2 - 3, y2 - 3);
            this.dLine(x2, y2, x2 - 3, y2 + 3);
            this.dLine(x2 - 1, y2, x2 - 3, y2 - 2);
            this.dLine(x2 - 1, y2, x2 - 3, y2 + 2);
        }
    }

    this.drawDependencies = function() {

        //First recalculate the x,y
        this.CalcTaskXY();

        this.clearDependencies();

        var vList = this.getTaskItems();
        for (var i = 0; i < vList.length; i++) {

            vDepend = vList[i].getDepend();
            if (vDepend) {

                var vDependStr = vDepend + '';
                var vDepList = vDependStr.split(',');
                var n = vDepList.length;

                for (var k = 0; k < n; k++) {
                    var vTask = this.getArrayLocationByID(vDepList[k]);

                    if (vList[vTask].getVisible() == 1)
                        this.drawDependency(vList[vTask].getEndX(),
                            vList[vTask].getEndY(), vList[i].getStartX()
                                - 1, vList[i].getStartY())
                }
            }
        }
    }

    this.getArrayLocationByID = function(pId) {

        var vList = this.getTaskItems();
        for (var i = 0; i < vList.length; i++) {
            if (vList[i].getID() == pId)
                return i;
        }
    }

    this.draw = function() //绘制ui
    {
        var vMaxDate = new Date();
        var vMinDate = new Date();
        var vTmpDate = new Date();
        var vNxtDate = new Date();
        var vCurrDate = new Date();
        var vTaskLeft = 0;
        var vTaskRight = 0;
        var vNumCols = 0;
        var vID = 0;
        var vMainTable = "";
        var vLeftTable = "";
        var vRightTable = "";
        var vDateRowStr = "";
        var vItemRowStr = "";
        var vColWidth = 0; //宽度
        var vColUnit = 0;
        var vChartWidth = 0;
        var vNumDays = 0;
        var vDayWidth = 0;
        var vStr = "";
        var vNameWidth = 220;
        var vStatusWidth = 70;
        var vLeftWidth = 15 + 220 + 70 + 70 + 70 + 70 + 70;

        if (vTaskList.length > 0) //任务列表
        {

            // Process all tasks preset parent date and completion %
            JSGantt.processRows(vTaskList, 0, -1, 1, 1);

            // get overall min/max dates plus padding
            vMinDate = JSGantt.getMinDate(vTaskList, vFormat); //获取最小时间值
            vMaxDate = JSGantt.getMaxDate(vTaskList, vFormat);

            // Calculate chart width variables.  vColWidth can be altered manually to change each column width
            // May be smart to make this a parameter of GanttChart or set it based on existing pWidth parameter
            if (vFormat == 'day') {
                vColWidth = 18;
                vColUnit = 1;
            } else if (vFormat == 'three') {

                vColWidth = 25;
                vColUnit = 3;

            } else if (vFormat == 'week') {
                vColWidth = 37;
                vColUnit = 7;
            } else if (vFormat == 'month') {
                vColWidth = 37;
                vColUnit = 30;
            } else if (vFormat == 'quarter') {
                vColWidth = 60;
                vColUnit = 90;
            }

            else if (vFormat == 'hour') {
                vColWidth = 18;
                vColUnit = 1;
            }

            else if (vFormat == 'minute') {
                vColWidth = 18;
                vColUnit = 1;
            }

            vNumDays = (Date.parse(vMaxDate) - Date.parse(vMinDate))
                / (24 * 60 * 60 * 1000);
            vNumUnits = vNumDays / vColUnit;

            vChartWidth = vNumUnits * vColWidth + 1;
            vDayWidth = (vColWidth / vColUnit) + (1 / vColUnit);

            vMainTable = '<TABLE id=theTable cellSpacing=0 cellPadding=0 border=0><TBODY><TR>'
                + '<TD vAlign=top bgColor=#ffffff>';

            if (vShowRes != 1)
                vNameWidth += vStatusWidth;
            if (vShowDur != 1)
                vNameWidth += vStatusWidth;
            if (vShowComp != 1)
                vNameWidth += vStatusWidth;
            if (vShowStartDate != 1)
                vNameWidth += vStatusWidth;
            if (vShowEndDate != 1)
                vNameWidth += vStatusWidth;

            /////////////////左边的栏目
            // DRAW the Left-side of the chart (names, resources, comp%)
            vLeftTable = '<DIV class=scroll id=leftside style="width:'
                + vLeftWidth
                + 'px"><TABLE cellSpacing=0 cellPadding=0 border=0><TBODY>'
                + '<TR style="HEIGHT: 17px">'
                + '  <TD style="WIDTH: 15px; HEIGHT: 17px"></TD>'
                + '  <TD style="WIDTH: ' + vNameWidth
                + 'px; HEIGHT: 17px"><NOBR></NOBR></TD>';

            if (vShowRes == 1)
                vLeftTable += '  <TD style="WIDTH: ' + vStatusWidth
                    + 'px; HEIGHT: 17px"></TD>';
            if (vShowDur == 1)
                vLeftTable += '  <TD style="WIDTH: ' + vStatusWidth
                    + 'px; HEIGHT: 17px"></TD>';
            if (vShowComp == 1)
                vLeftTable += '  <TD style="WIDTH: ' + vStatusWidth
                    + 'px; HEIGHT: 17px"></TD>';
            if (vShowStartDate == 1)
                vLeftTable += '  <TD style="WIDTH: ' + vStatusWidth
                    + 'px; HEIGHT: 17px"></TD>';
            if (vShowEndDate == 1)
                vLeftTable += '  <TD style="WIDTH: ' + vStatusWidth
                    + 'px; HEIGHT: 17px"></TD>';

            vLeftTable += '<TR style="HEIGHT: 20px">'
                + '  <TD style="BORDER-TOP: #efefef 1px solid; WIDTH: 15px; HEIGHT: 20px"></TD>'
                + '  <TD style="BORDER-TOP: #efefef 1px solid; WIDTH: '
                + vNameWidth + 'px; HEIGHT: 20px"><NOBR></NOBR></TD>';

            if (vShowRes == 1)
                vLeftTable += '  <TD style="BORDER-TOP: #efefef 1px solid; FONT-SIZE: 12px; BORDER-LEFT: #efefef 1px solid; WIDTH: 60px; HEIGHT: 20px" align=center nowrap>Resource</TD>';
            if (vShowDur == 1)
                vLeftTable += '  <TD style="BORDER-TOP: #efefef 1px solid; FONT-SIZE: 12px; BORDER-LEFT: #efefef 1px solid; WIDTH: 60px; HEIGHT: 20px" align=center nowrap>Duration</TD>';
            if (vShowComp == 1)
                vLeftTable += '  <TD style="BORDER-TOP: #efefef 1px solid; FONT-SIZE: 12px; BORDER-LEFT: #efefef 1px solid; WIDTH: 60px; HEIGHT: 20px" align=center nowrap>% Comp.</TD>';
            if (vShowStartDate == 1)
                vLeftTable += '  <TD style="BORDER-TOP: #efefef 1px solid; FONT-SIZE: 12px; BORDER-LEFT: #efefef 1px solid; WIDTH: 60px; HEIGHT: 20px" align=center nowrap>Start Date</TD>';
            if (vShowEndDate == 1)
                vLeftTable += '  <TD style="BORDER-TOP: #efefef 1px solid; FONT-SIZE: 12px; BORDER-LEFT: #efefef 1px solid; WIDTH: 60px; HEIGHT: 20px" align=center nowrap>End Date</TD>';

            vLeftTable += '</TR>';

            for (i = 0; i < vTaskList.length; i++) {
                if (vTaskList[i].getGroup()) {
                    vBGColor = "f3f3f3";
                    vRowType = "group";
                } else {
                    vBGColor = "ffffff";
                    vRowType = "row";
                }

                vID = vTaskList[i].getID();

                if (vTaskList[i].getVisible() == 0)
                    vLeftTable += '<TR id=child_'
                        + vID
                        + ' bgcolor=#'
                        + vBGColor
                        + ' style="display:none"  onMouseover=g.mouseOver(this,'
                        + vID + ',"left","' + vRowType
                        + '") onMouseout=g.mouseOut(this,' + vID
                        + ',"left","' + vRowType + '")>';
                else
                    vLeftTable += '<TR id=child_' + vID + ' bgcolor=#'
                        + vBGColor + ' onMouseover=g.mouseOver(this,' + vID
                        + ',"left","' + vRowType
                        + '") onMouseout=g.mouseOut(this,' + vID
                        + ',"left","' + vRowType + '")>';

                vLeftTable += '  <TD class=gdatehead style="WIDTH: 15px; HEIGHT: 20px; BORDER-TOP: #efefef 1px solid; FONT-SIZE: 12px; BORDER-LEFT: #efefef 1px solid;">&nbsp;</TD>'
                    + '  <TD class=gname style="WIDTH: '
                    + vNameWidth
                    + 'px; HEIGHT: 20px; BORDER-TOP: #efefef 1px solid; FONT-SIZE: 12px;" nowrap><NOBR><span style="color: #aaaaaa">';

                for (j = 1; j < vTaskList[i].getLevel(); j++) {
                    vLeftTable += '&nbsp&nbsp&nbsp&nbsp';
                }

                vLeftTable += '</span>';

                if (vTaskList[i].getGroup()) {
                    if (vTaskList[i].getOpen() == 1)
                        vLeftTable += '<SPAN id="group_'
                            + vID
                            + '" style="color:#000000; cursor:pointer; font-weight:bold; FONT-SIZE: 12px;" onclick="JSGantt.folder('
                            + vID
                            + ','
                            + vGanttVar
                            + ');'
                            + vGanttVar
                            + '.drawDependencies();">&ndash;</span><span style="color:#000000">&nbsp</SPAN>';
                    else
                        vLeftTable += '<SPAN id="group_'
                            + vID
                            + '" style="color:#000000; cursor:pointer; font-weight:bold; FONT-SIZE: 12px;" onclick="JSGantt.folder('
                            + vID
                            + ','
                            + vGanttVar
                            + ');'
                            + vGanttVar
                            + '.drawDependencies();">+</span><span style="color:#000000">&nbsp</SPAN>';

                } else {

                    vLeftTable += '<span style="color: #000000; font-weight:bold; FONT-SIZE: 12px;">&nbsp&nbsp&nbsp</span>';
                }

                vLeftTable += '<span onclick=JSGantt.taskLink("'
                    + vTaskList[i].getLink()
                    + '",300,200); style="cursor:pointer"> '
                    + vTaskList[i].getName() + '</span></NOBR></TD>';

                if (vShowRes == 1)
                    vLeftTable += '  <TD class=gname style="WIDTH: 60px; HEIGHT: 20px; TEXT-ALIGN: center; BORDER-TOP: #efefef 1px solid; FONT-SIZE: 12px; BORDER-LEFT: #efefef 1px solid;" align=center><NOBR>'
                        + vTaskList[i].getResource() + '</NOBR></TD>';
                if (vShowDur == 1)
                    vLeftTable += '  <TD class=gname style="WIDTH: 60px; HEIGHT: 20px; TEXT-ALIGN: center; BORDER-TOP: #efefef 1px solid; FONT-SIZE: 12px; BORDER-LEFT: #efefef 1px solid;" align=center><NOBR>'
                        + vTaskList[i].getDuration(vFormat)
                        + '</NOBR></TD>';
                if (vShowComp == 1)
                    vLeftTable += '  <TD class=gname style="WIDTH: 60px; HEIGHT: 20px; TEXT-ALIGN: center; BORDER-TOP: #efefef 1px solid; FONT-SIZE: 12px; BORDER-LEFT: #efefef 1px solid;" align=center><NOBR>'
                        + vTaskList[i].getCompStr() + '</NOBR></TD>';
                if (vShowStartDate == 1&&!vTaskList[i].getSequenceList())
                    vLeftTable += '  <TD class=gname style="WIDTH: 60px; HEIGHT: 20px; TEXT-ALIGN: center; BORDER-TOP: #efefef 1px solid; FONT-SIZE: 12px; BORDER-LEFT: #efefef 1px solid;" align=center><NOBR>'
                        + JSGantt.formatDateStr(vTaskList[i].getStart(),
                        vDateDisplayFormat) + '</NOBR></TD>';
                if (vShowEndDate == 1&&!vTaskList[i].getSequenceList())
                    vLeftTable += '  <TD class=gname style="WIDTH: 60px; HEIGHT: 20px; TEXT-ALIGN: center; BORDER-TOP: #efefef 1px solid; FONT-SIZE: 12px; BORDER-LEFT: #efefef 1px solid;" align=center><NOBR>'
                        + JSGantt.formatDateStr(vTaskList[i].getEnd(),
                        vDateDisplayFormat) + '</NOBR></TD>';

                vLeftTable += '</TR>';

            }



            // DRAW the date format selector at bottom left.  Another potential GanttChart parameter to hide/show this selector
            vLeftTable += '</TD></TR>'
           +JSGantt.createSelector(vFormatArr,vFormat,vGanttVar)+
               "</TBODY></TABLE></TD>";

            vMainTable += vLeftTable;

            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            //////////////////////////////////////////////////////////////////////////////////////////////////////////// 右侧的  上半部分
            // Draw the Chart Rows
            vRightTable = '<TD style="width: ' + vChartWidth
                + 'px;" vAlign=top bgColor=#ffffff>'
                + '<DIV class=scroll2 id=rightside>'
                + '<TABLE style="width: ' + vChartWidth
                + 'px;" cellSpacing=0 cellPadding=0 border=0>'
                + '<TBODY><TR style="HEIGHT: 18px">';

            vTmpDate.setFullYear(vMinDate.getFullYear(), vMinDate.getMonth(),
                vMinDate.getDate()); //最小时间
            vTmpDate.setHours(0);
            vTmpDate.setMinutes(0);

            // Major Date Header
            while (Date.parse(vTmpDate) <= Date.parse(vMaxDate)) {
                vStr = vTmpDate.getFullYear() + '';

                vStr = vStr.substring(2, 4);
                vStr = vTmpDate.getMonth() + 1;

                if (vFormat == 'minute') {
                    vRightTable += '<td class=gdatehead style="FONT-SIZE: 12px; HEIGHT: 19px;" align=center colspan=60>';
                    vRightTable += JSGantt.formatDateStr(vTmpDate,
                        vDateDisplayFormat)
                        + ' '
                        + vTmpDate.getHours()
                        + ':00 -'
                        + vTmpDate.getHours() + ':59 </td>';
                    vTmpDate.setHours(vTmpDate.getHours() + 1);
                }

                if (vFormat == 'hour') {
                    vRightTable += '<td class=gdatehead style="FONT-SIZE: 12px; HEIGHT: 19px;" align=center colspan=24>';
                    vRightTable += JSGantt.formatDateStr(vTmpDate,
                        vDateDisplayFormat)
                        + '</td>';
                    vTmpDate.setDate(vTmpDate.getDate() + 1);
                }

                if (vFormat == 'day') {
                    vRightTable += '<td class=gdatehead style="FONT-SIZE: 12px; HEIGHT: 19px;" align=center colspan=7>'
                        + JSGantt.formatDateStr(vTmpDate,
                        vDateDisplayFormat.substring(0, 5)) + ' - ';
                    vTmpDate.setDate(vTmpDate.getDate() + 6);
                    vRightTable += JSGantt.formatDateStr(vTmpDate,
                        vDateDisplayFormat)
                        + '</td>';
                    vTmpDate.setDate(vTmpDate.getDate() + 1);
                }

                if (vFormat == 'three') {
                    vRightTable += '<td class=gdatehead align=center style="FONT-SIZE: 12px; HEIGHT: 19px; align=center"  colspan=10  width='
                        + vColWidth + 'px>' + vStr + '月</td>';
                    vTmpDate.setDate(vTmpDate.getDate() + 1);
                    while (vTmpDate.getDate() > 1) {
                        vTmpDate.setDate(vTmpDate.getDate() + 1);
                    }
                } else if (vFormat == 'week') {
                    vRightTable += '<td class=gdatehead align=center style="FONT-SIZE: 12px; HEIGHT: 19px;" width='
                        + vColWidth + 'px>`' + vStr + '</td>';
                    vTmpDate.setDate(vTmpDate.getDate() + 7);
                } else if (vFormat == 'month') {
                    vRightTable += '<td class=gdatehead align=center style="FONT-SIZE: 12px; HEIGHT: 19px;" width='
                        + vColWidth + 'px>`' + vStr + '</td>';
                    vTmpDate.setDate(vTmpDate.getDate() + 1);
                    while (vTmpDate.getDate() > 1) {
                        vTmpDate.setDate(vTmpDate.getDate() + 1);
                    }
                } else if (vFormat == 'quarter') {
                    vRightTable += '<td class=gdatehead align=center style="FONT-SIZE: 12px; HEIGHT: 19px;" width='
                        + vColWidth + 'px>`' + vStr + '</td>';
                    vTmpDate.setDate(vTmpDate.getDate() + 81);
                    while (vTmpDate.getDate() > 1) {
                        vTmpDate.setDate(vTmpDate.getDate() + 1);
                    }
                }

            }

            vRightTable += '</TR><TR>';

            //////////////////////////////////////////////////////////end

            //////////////////////////////////////////////////////////// 右侧的  下半部分
            // Minor Date header and Cell Rows
            vTmpDate.setFullYear(vMinDate.getFullYear(), vMinDate.getMonth(),
                vMinDate.getDate());
            vNxtDate.setFullYear(vMinDate.getFullYear(), vMinDate.getMonth(),
                vMinDate.getDate());
            vNumCols = 0;

            while (Date.parse(vTmpDate) <= Date.parse(vMaxDate)) {
                if (vFormat == 'minute') {

                    if (vTmpDate.getMinutes() == 0)
                        vWeekdayColor = "ccccff";
                    else
                        vWeekdayColor = "ffffff";

                    vDateRowStr += '<td class="ghead" style="BORDER-TOP: #efefef 1px solid; FONT-SIZE: 12px; HEIGHT: 19px; BORDER-LEFT: #efefef 1px solid;"  bgcolor=#'
                        + vWeekdayColor
                        + ' align=center><div style="width: '
                        + vColWidth
                        + 'px">' + vTmpDate.getMinutes() + '</div></td>';
                    vItemRowStr += '<td class="ghead" style="BORDER-TOP: #efefef 1px solid; FONT-SIZE: 12px; BORDER-LEFT: #efefef 1px solid; cursor: default;"  bgcolor=#'
                        + vWeekdayColor
                        + ' align=center><div style="width: '
                        + vColWidth
                        + 'px">&nbsp&nbsp</div></td>';
                    vTmpDate.setMinutes(vTmpDate.getMinutes() + 1);
                }

                else if (vFormat == 'hour') {

                    if (vTmpDate.getHours() == 0)
                        vWeekdayColor = "ccccff";
                    else
                        vWeekdayColor = "ffffff";

                    vDateRowStr += '<td class="ghead" style="BORDER-TOP: #efefef 1px solid; FONT-SIZE: 12px; HEIGHT: 19px; BORDER-LEFT: #efefef 1px solid;"  bgcolor=#'
                        + vWeekdayColor
                        + ' align=center><div style="width: '
                        + vColWidth
                        + 'px">' + vTmpDate.getHours() + '</div></td>';
                    vItemRowStr += '<td class="ghead" style="BORDER-TOP: #efefef 1px solid; FONT-SIZE: 12px; BORDER-LEFT: #efefef 1px solid; cursor: default;"  bgcolor=#'
                        + vWeekdayColor
                        + ' align=center><div style="width: '
                        + vColWidth
                        + 'px">&nbsp&nbsp</div></td>';
                    vTmpDate.setHours(vTmpDate.getHours() + 1);
                }

                else if (vFormat == 'day') {
                    if (JSGantt.formatDateStr(vCurrDate, 'mm/dd/yyyy') == JSGantt
                        .formatDateStr(vTmpDate, 'mm/dd/yyyy')) {
                        vWeekdayColor = "ccccff";
                        vWeekendColor = "9999ff";
                        vWeekdayGColor = "bbbbff";
                        vWeekendGColor = "8888ff";
                    } else {
                        vWeekdayColor = "ffffff";
                        vWeekendColor = "cfcfcf";
                        vWeekdayGColor = "f3f3f3";
                        vWeekendGColor = "c3c3c3";
                    }

                    if (vTmpDate.getDay() % 6 == 0) {
                        vDateRowStr += '<td class="gheadwkend" style="BORDER-TOP: #efefef 1px solid; FONT-SIZE: 12px; HEIGHT: 19px; BORDER-LEFT: #efefef 1px solid;" bgcolor=#'
                            + vWeekendColor
                            + ' align=center><div style="width: '
                            + vColWidth
                            + 'px">'
                            + vTmpDate.getDate()
                            + '</div></td>';
                        vItemRowStr += '<td class="gheadwkend" style="BORDER-TOP: #efefef 1px solid; FONT-SIZE: 12px; BORDER-LEFT: #efefef 1px solid; cursor: default;"  bgcolor=#'
                            + vWeekendColor
                            + ' align=center><div style="width: '
                            + vColWidth + 'px">&nbsp</div></td>';
                    } else {
                        vDateRowStr += '<td class="ghead" style="BORDER-TOP: #efefef 1px solid; FONT-SIZE: 12px; HEIGHT: 19px; BORDER-LEFT: #efefef 1px solid;"  bgcolor=#'
                            + vWeekdayColor
                            + ' align=center><div style="width: '
                            + vColWidth
                            + 'px">'
                            + vTmpDate.getDate()
                            + '</div></td>';
                        if (JSGantt.formatDateStr(vCurrDate, 'mm/dd/yyyy') == JSGantt
                            .formatDateStr(vTmpDate, 'mm/dd/yyyy'))
                            vItemRowStr += '<td class="ghead" style="BORDER-TOP: #efefef 1px solid; FONT-SIZE: 12px; BORDER-LEFT: #efefef 1px solid; cursor: default;"  bgcolor=#'
                                + vWeekdayColor
                                + ' align=center><div style="width: '
                                + vColWidth + 'px">&nbsp&nbsp</div></td>';
                        else
                            vItemRowStr += '<td class="ghead" style="BORDER-TOP: #efefef 1px solid; FONT-SIZE: 12px; BORDER-LEFT: #efefef 1px solid; cursor: default;"  align=center><div style="width: '
                                + vColWidth + 'px">&nbsp&nbsp</div></td>';
                    }

                    vTmpDate.setDate(vTmpDate.getDate() + 1);

                }

                else if (vFormat == 'three') {
                    if (JSGantt.formatDateStr(vCurrDate, 'mm/dd/yyyy') == JSGantt
                        .formatDateStr(vTmpDate, 'mm/dd/yyyy')) {
                        vWeekdayColor = "ccccff";
                        vWeekendColor = "9999ff";
                        vWeekdayGColor = "bbbbff";
                        vWeekendGColor = "8888ff";
                    } else {
                        vWeekdayColor = "ffffff";
                        vWeekendColor = "cfcfcf";
                        vWeekdayGColor = "f3f3f3";
                        vWeekendGColor = "c3c3c3";
                    }

                    if (vTmpDate.getDay() % 6 == 0) {
                        vDateRowStr += '<td class="gheadwkend" style="BORDER-TOP: #efefef 1px solid; FONT-SIZE: 12px; HEIGHT: 19px; BORDER-LEFT: #efefef 1px solid;" bgcolor=#'
                            + vWeekendColor
                            + ' align=center><div style="width: '
                            + vColWidth
                            + 'px">'
                            + vTmpDate.getDate()
                            + '</div></td>';
                        vItemRowStr += '<td class="gheadwkend" style="BORDER-TOP: #efefef 1px solid; FONT-SIZE: 12px; BORDER-LEFT: #efefef 1px solid; cursor: default;"  bgcolor=#'
                            + vWeekendColor
                            + ' align=center><div style="width: '
                            + vColWidth + 'px">&nbsp</div></td>';
                    } else {
                        vDateRowStr += '<td class="ghead" style="BORDER-TOP: #efefef 1px solid; FONT-SIZE: 12px; HEIGHT: 19px; BORDER-LEFT: #efefef 1px solid;"  bgcolor=#'
                            + vWeekdayColor
                            + ' align=center><div style="width: '
                            + vColWidth
                            + 'px">'
                            + vTmpDate.getDate()
                            + '</div></td>';
                        if (JSGantt.formatDateStr(vCurrDate, 'mm/dd/yyyy') == JSGantt
                            .formatDateStr(vTmpDate, 'mm/dd/yyyy'))
                            vItemRowStr += '<td class="ghead" style="BORDER-TOP: #efefef 1px solid; FONT-SIZE: 12px; BORDER-LEFT: #efefef 1px solid; cursor: default;"  bgcolor=#'
                                + vWeekdayColor
                                + ' align=center><div style="width: '
                                + vColWidth + 'px">&nbsp&nbsp</div></td>';
                        else
                            vItemRowStr += '<td class="ghead" style="BORDER-TOP: #efefef 1px solid; FONT-SIZE: 12px; BORDER-LEFT: #efefef 1px solid; cursor: default;"  align=center><div style="width: '
                                + vColWidth + 'px">&nbsp&nbsp</div></td>';
                    }

                    vTmpDate.setDate(vTmpDate.getDate() + 3);

                }

                else if (vFormat == 'week') {

                    vNxtDate.setDate(vNxtDate.getDate() + 7);

                    if (vCurrDate >= vTmpDate && vCurrDate < vNxtDate)
                        vWeekdayColor = "ccccff";
                    else
                        vWeekdayColor = "ffffff";

                    if (vNxtDate <= vMaxDate) {
                        vDateRowStr += '<td class="ghead" style="BORDER-TOP: #efefef 1px solid; FONT-SIZE: 12px; HEIGHT: 19px; BORDER-LEFT: #efefef 1px solid;" bgcolor=#'
                            + vWeekdayColor
                            + ' align=center width:'
                            + vColWidth
                            + 'px><div style="width: '
                            + vColWidth
                            + 'px">'
                            + (vTmpDate.getMonth() + 1)
                            + '/'
                            + vTmpDate.getDate() + '</div></td>';
                        if (vCurrDate >= vTmpDate && vCurrDate < vNxtDate)
                            vItemRowStr += '<td class="ghead" style="BORDER-TOP: #efefef 1px solid; FONT-SIZE: 12px; BORDER-LEFT: #efefef 1px solid;" bgcolor=#'
                                + vWeekdayColor
                                + ' align=center><div style="width: '
                                + vColWidth + 'px">&nbsp&nbsp</div></td>';
                        else
                            vItemRowStr += '<td class="ghead" style="BORDER-TOP: #efefef 1px solid; FONT-SIZE: 12px; BORDER-LEFT: #efefef 1px solid;" align=center><div style="width: '
                                + vColWidth + 'px">&nbsp&nbsp</div></td>';

                    } else {
                        vDateRowStr += '<td class="ghead" style="BORDER-TOP: #efefef 1px solid; FONT-SIZE: 12px; HEIGHT: 19px; BORDER-LEFT: #efefef 1px solid; bgcolor=#'
                            + vWeekdayColor
                            + ' BORDER-RIGHT: #efefef 1px solid;" align=center width:'
                            + vColWidth
                            + 'px><div style="width: '
                            + vColWidth
                            + 'px">'
                            + (vTmpDate.getMonth() + 1)
                            + '/'
                            + vTmpDate.getDate() + '</div></td>';
                        if (vCurrDate >= vTmpDate && vCurrDate < vNxtDate)
                            vItemRowStr += '<td class="ghead" style="BORDER-TOP: #efefef 1px solid; FONT-SIZE: 12px; BORDER-LEFT: #efefef 1px solid; BORDER-RIGHT: #efefef 1px solid;" bgcolor=#'
                                + vWeekdayColor
                                + ' align=center><div style="width: '
                                + vColWidth + 'px">&nbsp&nbsp</div></td>';
                        else
                            vItemRowStr += '<td class="ghead" style="BORDER-TOP: #efefef 1px solid; FONT-SIZE: 12px; BORDER-LEFT: #efefef 1px solid; BORDER-RIGHT: #efefef 1px solid;" align=center><div style="width: '
                                + vColWidth + 'px">&nbsp&nbsp</div></td>';

                    }

                    vTmpDate.setDate(vTmpDate.getDate() + 7);

                }

                else if (vFormat == 'month') {

                    vNxtDate.setFullYear(vTmpDate.getFullYear(), vTmpDate
                        .getMonth(), vMonthDaysArr[vTmpDate
                        .getMonth()]);
                    if (vCurrDate >= vTmpDate && vCurrDate < vNxtDate)
                        vWeekdayColor = "ccccff";
                    else
                        vWeekdayColor = "ffffff";

                    if (vNxtDate <= vMaxDate) {
                        vDateRowStr += '<td class="ghead" style="BORDER-TOP: #efefef 1px solid; FONT-SIZE: 12px; HEIGHT: 19px; BORDER-LEFT: #efefef 1px solid;" bgcolor=#'
                            + vWeekdayColor
                            + ' align=center width:'
                            + vColWidth
                            + 'px><div style="width: '
                            + vColWidth
                            + 'px">'
                            + vMonthArr[vTmpDate.getMonth()].substr(0, 3)
                            + '</div></td>';
                        if (vCurrDate >= vTmpDate && vCurrDate < vNxtDate)
                            vItemRowStr += '<td class="ghead" style="BORDER-TOP: #efefef 1px solid; FONT-SIZE: 12px; BORDER-LEFT: #efefef 1px solid;" bgcolor=#'
                                + vWeekdayColor
                                + ' align=center><div style="width: '
                                + vColWidth + 'px">&nbsp&nbsp</div></td>';
                        else
                            vItemRowStr += '<td class="ghead" style="BORDER-TOP: #efefef 1px solid; FONT-SIZE: 12px; BORDER-LEFT: #efefef 1px solid;" align=center><div style="width: '
                                + vColWidth + 'px">&nbsp&nbsp</div></td>';
                    } else {
                        vDateRowStr += '<td class="ghead" style="BORDER-TOP: #efefef 1px solid; FONT-SIZE: 12px; HEIGHT: 19px; BORDER-LEFT: #efefef 1px solid; BORDER-RIGHT: #efefef 1px solid;" bgcolor=#'
                            + vWeekdayColor
                            + ' align=center width:'
                            + vColWidth
                            + 'px><div style="width: '
                            + vColWidth
                            + 'px">'
                            + vMonthArr[vTmpDate.getMonth()].substr(0, 3)
                            + '</div></td>';
                        if (vCurrDate >= vTmpDate && vCurrDate < vNxtDate)
                            vItemRowStr += '<td class="ghead" style="BORDER-TOP: #efefef 1px solid; FONT-SIZE: 12px; BORDER-LEFT: #efefef 1px solid; BORDER-RIGHT: #efefef 1px solid;" bgcolor=#'
                                + vWeekdayColor
                                + ' align=center><div style="width: '
                                + vColWidth + 'px">&nbsp&nbsp</div></td>';
                        else
                            vItemRowStr += '<td class="ghead" style="BORDER-TOP: #efefef 1px solid; FONT-SIZE: 12px; BORDER-LEFT: #efefef 1px solid; BORDER-RIGHT: #efefef 1px solid;" align=center><div style="width: '
                                + vColWidth + 'px">&nbsp&nbsp</div></td>';
                    }

                    vTmpDate.setDate(vTmpDate.getDate() + 1);

                    while (vTmpDate.getDate() > 1) {
                        vTmpDate.setDate(vTmpDate.getDate() + 1);
                    }

                }

                else if (vFormat == 'quarter') {

                    vNxtDate.setDate(vNxtDate.getDate() + 122);
                    if (vTmpDate.getMonth() == 0 || vTmpDate.getMonth() == 1
                        || vTmpDate.getMonth() == 2)
                        vNxtDate.setFullYear(vTmpDate.getFullYear(), 2, 31);
                    else if (vTmpDate.getMonth() == 3
                        || vTmpDate.getMonth() == 4
                        || vTmpDate.getMonth() == 5)
                        vNxtDate.setFullYear(vTmpDate.getFullYear(), 5, 30);
                    else if (vTmpDate.getMonth() == 6
                        || vTmpDate.getMonth() == 7
                        || vTmpDate.getMonth() == 8)
                        vNxtDate.setFullYear(vTmpDate.getFullYear(), 8, 30);
                    else if (vTmpDate.getMonth() == 9
                        || vTmpDate.getMonth() == 10
                        || vTmpDate.getMonth() == 11)
                        vNxtDate.setFullYear(vTmpDate.getFullYear(), 11, 31);

                    if (vCurrDate >= vTmpDate && vCurrDate < vNxtDate)
                        vWeekdayColor = "ccccff";
                    else
                        vWeekdayColor = "ffffff";

                    if (vNxtDate <= vMaxDate) {
                        vDateRowStr += '<td class="ghead" style="BORDER-TOP: #efefef 1px solid; FONT-SIZE: 12px; HEIGHT: 19px; BORDER-LEFT: #efefef 1px solid;" bgcolor=#'
                            + vWeekdayColor
                            + ' align=center width:'
                            + vColWidth
                            + 'px><div style="width: '
                            + vColWidth
                            + 'px">Qtr. '
                            + vQuarterArr[vTmpDate.getMonth()]
                            + '</div></td>';
                        if (vCurrDate >= vTmpDate && vCurrDate < vNxtDate)
                            vItemRowStr += '<td class="ghead" style="BORDER-TOP: #efefef 1px solid; FONT-SIZE: 12px; BORDER-LEFT: #efefef 1px solid;" bgcolor=#'
                                + vWeekdayColor
                                + ' align=center><div style="width: '
                                + vColWidth + 'px">&nbsp&nbsp</div></td>';
                        else
                            vItemRowStr += '<td class="ghead" style="BORDER-TOP: #efefef 1px solid; FONT-SIZE: 12px; BORDER-LEFT: #efefef 1px solid;" align=center><div style="width: '
                                + vColWidth + 'px">&nbsp&nbsp</div></td>';
                    } else {
                        vDateRowStr += '<td class="ghead" style="BORDER-TOP: #efefef 1px solid; FONT-SIZE: 12px; HEIGHT: 19px; BORDER-LEFT: #efefef 1px solid; BORDER-RIGHT: #efefef 1px solid;" bgcolor=#'
                            + vWeekdayColor
                            + ' align=center width:'
                            + vColWidth
                            + 'px><div style="width: '
                            + vColWidth
                            + 'px">Qtr. '
                            + vQuarterArr[vTmpDate.getMonth()]
                            + '</div></td>';
                        if (vCurrDate >= vTmpDate && vCurrDate < vNxtDate)
                            vItemRowStr += '<td class="ghead" style="BORDER-TOP: #efefef 1px solid; FONT-SIZE: 12px; BORDER-LEFT: #efefef 1px solid; BORDER-RIGHT: #efefef 1px solid;" bgcolor=#'
                                + vWeekdayColor
                                + ' align=center><div style="width: '
                                + vColWidth + 'px">&nbsp&nbsp</div></td>';
                        else
                            vItemRowStr += '<td class="ghead" style="BORDER-TOP: #efefef 1px solid; FONT-SIZE: 12px; BORDER-LEFT: #efefef 1px solid; BORDER-RIGHT: #efefef 1px solid;" align=center><div style="width: '
                                + vColWidth + 'px">&nbsp&nbsp</div></td>';
                    }

                    vTmpDate.setDate(vTmpDate.getDate() + 81);

                    while (vTmpDate.getDate() > 1) {
                        vTmpDate.setDate(vTmpDate.getDate() + 1);
                    }

                }
            }

            vRightTable += vDateRowStr + '</TR>';
            vRightTable += '</TBODY></TABLE>';

            // Draw each row

            for (i = 0; i < vTaskList.length; i++)

            {

                //	 console.info(vTaskList.length)
                vTmpDate.setFullYear(vMinDate.getFullYear(), vMinDate
                    .getMonth(), vMinDate.getDate());
                vTaskStart = vTaskList[i].getStart();
                vTaskEnd = vTaskList[i].getEnd();

                vNumCols = 0;
                vID = vTaskList[i].getID();

                // vNumUnits = Math.ceil((vTaskList[i].getEnd() - vTaskList[i].getStart()) / (24 * 60 * 60 * 1000)) + 1;
                vNumUnits = (vTaskList[i].getEnd() - vTaskList[i].getStart())
                    / (24 * 60 * 60 * 1000) + 1;
                if (vFormat == 'hour') {
                    vNumUnits = (vTaskList[i].getEnd() - vTaskList[i]
                        .getStart())
                        / (60 * 1000) + 1;
                } else if (vFormat == 'minute') {
                    vNumUnits = (vTaskList[i].getEnd() - vTaskList[i]
                        .getStart())
                        / (60 * 1000) + 1;
                }

                if (vTaskList[i].getVisible() == 0)
                    vRightTable += '<DIV id=childgrid_' + vID
                        + ' style="position:relative; display:none;">';
                else
                    vRightTable += '<DIV id=childgrid_' + vID
                        + ' style="position:relative">';

                if (vTaskList[i].getMile()) { //如果是 ，里程碑

                    vRightTable += '<DIV><TABLE style="position:relative; top:0px; width: '
                        + vChartWidth
                        + 'px;" cellSpacing=0 cellPadding=0 border=0>'
                        + '<TR id=childrow_'
                        + vID
                        + ' class=yesdisplay style="HEIGHT: 20px" onMouseover=g.mouseOver(this,'
                        + vID
                        + ',"right","mile") onMouseout=g.mouseOut(this,'
                        + vID
                        + ',"right","mile")>'
                        + vItemRowStr
                        + '</TR></TABLE></DIV>';

                    // Build date string for Title
                    vDateRowStr = JSGantt.formatDateStr(vTaskStart,
                        vDateDisplayFormat);

                    vTaskLeft = (Date.parse(vTaskList[i].getStart()) - Date
                        .parse(vMinDate))
                        / (24 * 60 * 60 * 1000);
                    vTaskRight = 1

                    vRightTable += '<div id=bardiv_'
                        + vID
                        + ' style="position:absolute; top:0px; left:'
                        + Math.ceil((vTaskLeft * (vDayWidth) + 1))
                        + 'px; height: 18px; width:160px; overflow:hidden;">'
                        + '  <div id=taskbar_'
                        + vID
                        + ' title="'
                        + vTaskList[i].getName()
                        + ': '
                        + vDateRowStr
                        + '" style="height: 16px; width:12px; overflow:hidden; cursor: pointer;" onclick=JSGantt.taskLink("'
                        + vTaskList[i].getLink() + '",300,200);>';

                    if (vTaskList[i].getCompVal() < 100)
                        vRightTable += '&loz;</div>';
                    else
                        vRightTable += '&diams;</div>';

                    if (g.getCaptionType()) {
                        vCaptionStr = '';
                        switch (g.getCaptionType()) {
                            case 'Caption' :
                                vCaptionStr = vTaskList[i].getCaption();
                                break;
                            case 'Resource' :
                                vCaptionStr = vTaskList[i].getResource();
                                break;
                            case 'Duration' :
                                vCaptionStr = vTaskList[i].getDuration(vFormat);
                                break;
                            case 'Complete' :
                                vCaptionStr = vTaskList[i].getCompStr();
                                break;
                        }
                        //vRightTable += '<div style="FONT-SIZE:12px; position:absolute; left: 6px; top:1px;">' + vCaptionStr + '</div>';
                        vRightTable += '<div style="FONT-SIZE:12px; position:absolute; top:2px; width:120px; left:12px">'
                            + vCaptionStr + '</div>';
                    }

                    vRightTable += '</div>';

                } else { //如果不是里程碑
/////////////处理数据//////////////////////////////////////////////////////////////////////
                    // Build date string for Title
                    vDateRowStr = JSGantt.formatDateStr(vTaskStart,
                        vDateDisplayFormat)
                        + ' - '
                        + JSGantt.formatDateStr(vTaskEnd,
                        vDateDisplayFormat)


                    if(!vTaskList[i].getSequenceList()){
                        if (vFormat == 'minute') {
                            vTaskRight = (Date.parse(vTaskList[i].getEnd()) - Date
                                .parse(vTaskList[i].getStart()))
                                / (60 * 1000) + 1 / vColUnit;
                            vTaskLeft = Math.ceil((Date.parse(vTaskList[i]
                                .getStart()) - Date.parse(vMinDate))
                                / (60 * 1000));
                        } else if (vFormat == 'hour') {
                            vTaskRight = (Date.parse(vTaskList[i].getEnd()) - Date
                                .parse(vTaskList[i].getStart()))
                                / (60 * 60 * 1000) + 1 / vColUnit;
                            vTaskLeft = (Date.parse(vTaskList[i].getStart()) - Date
                                .parse(vMinDate))
                                / (60 * 60 * 1000);
                        } else {

                            vTaskRight = (Date.parse(vTaskList[i].getEnd()) - Date
                                .parse(vTaskList[i].getStart()))
                                / (24 * 60 * 60 * 1000) + 1 / vColUnit;
                            vTaskLeft = Math.ceil((Date.parse(vTaskList[i]
                                .getStart()) - Date.parse(vMinDate))
                                / (24 * 60 * 60 * 1000));
                            if (vFormat = 'day') {
                                var tTime = new Date();
                                tTime.setTime(Date.parse(vTaskList[i].getStart()));
                                if (tTime.getMinutes() > 29)
                                    vTaskLeft += .5
                            }
                        }

                    }


                    // Draw Group Bar  which has outer div with inner group div and several small divs to left and right to create angled-end indicators
                    if (vTaskList[i].getGroup()) {  //如果包含分组
                        vRightTable += '<DIV><TABLE style="position:relative; top:0px; width: '
                            + vChartWidth
                            + 'px;" cellSpacing=0 cellPadding=0 border=0>'
                            + '<TR id=childrow_'
                            + vID
                            + ' class=yesdisplay style="HEIGHT: 20px" bgColor=#f3f3f3 onMouseover=g.mouseOver(this,'
                            + vID
                            + ',"right","group") onMouseout=g.mouseOut(this,'
                            + vID
                            + ',"right","group")>'
                            + vItemRowStr
                            + '</TR></TABLE></DIV>';
                        vRightTable += '<div id=bardiv_'
                            + vID
                            + ' style="position:absolute; top:5px; left:'
                            + Math.ceil(vTaskLeft * (vDayWidth) + 1)
                            + 'px; height: 7px; width:'
                            + Math.ceil((vTaskRight) * (vDayWidth) - 1)
                            + 'px">'
                            + '<div id=taskbar_'
                            + vID
                            + ' title="'
                            + vTaskList[i].getName()
                            + ': '
                            + vDateRowStr
                            + '" class=gtask style="background-color:#000000; height: 7px; width:'
                            + Math.ceil((vTaskRight) * (vDayWidth) - 1)
                            + 'px;  cursor: pointer;opacity:0.9;">'
                            + '<div style="Z-INDEX: -4; float:left; background-color:#666666; height:3px; overflow: hidden; margin-top:1px; '
                            + 'margin-left:1px; margin-right:1px; filter: alpha(opacity=80); opacity:0.8; width:'
                            + vTaskList[i].getCompStr()
                            + '; '
                            + 'cursor: pointer;" onclick=JSGantt.taskLink("'
                            + vTaskList[i].getLink()
                            + '",300,200);>'
                            + '</div>'
                            + '</div>'
                            + '<div style="Z-INDEX: -4; float:left; background-color:#000000; height:4px; overflow: hidden; width:1px;"></div>'
                            + '<div style="Z-INDEX: -4; float:right; background-color:#000000; height:4px; overflow: hidden; width:1px;"></div>'
                            + '<div style="Z-INDEX: -4; float:left; background-color:#000000; height:3px; overflow: hidden; width:1px;"></div>'
                            + '<div style="Z-INDEX: -4; float:right; background-color:#000000; height:3px; overflow: hidden; width:1px;"></div>'
                            + '<div style="Z-INDEX: -4; float:left; background-color:#000000; height:2px; overflow: hidden; width:1px;"></div>'
                            + '<div style="Z-INDEX: -4; float:right; background-color:#000000; height:2px; overflow: hidden; width:1px;"></div>'
                            + '<div style="Z-INDEX: -4; float:left; background-color:#000000; height:1px; overflow: hidden; width:1px;"></div>'
                            + '<div style="Z-INDEX: -4; float:right; background-color:#000000; height:1px; overflow: hidden; width:1px;"></div>';

                        if (g.getCaptionType()) {
                            vCaptionStr = '';
                            switch (g.getCaptionType()) {
                                case 'Caption' :
                                    vCaptionStr = vTaskList[i].getCaption();
                                    break;
                                case 'Resource' :
                                    vCaptionStr = vTaskList[i].getResource();
                                    break;
                                case 'Duration' :
                                    vCaptionStr = vTaskList[i]
                                        .getDuration(vFormat);
                                    break;
                                case 'Complete' :
                                    vCaptionStr = vTaskList[i].getCompStr();
                                    break;
                            }
                            //vRightTable += '<div style="FONT-SIZE:12px; position:absolute; left: 6px; top:1px;">' + vCaptionStr + '</div>';
                            vRightTable += '<div style="FONT-SIZE:12px; position:absolute; top:-3px; width:120px; left:'
                                + (Math
                                .ceil((vTaskRight) * (vDayWidth)
                                - 1) + 6)
                                + 'px">'
                                + vCaptionStr + '</div>';
                        }

                        vRightTable += '</div>';

                    } else {  //不包含分组

                        vDivStr = '<DIV><TABLE style="position:relative; top:0px; width: '
                            + vChartWidth
                            + 'px;" cellSpacing=0 cellPadding=0 border=0>'
                            + '<TR id=childrow_'
                            + vID
                            + ' class=yesdisplay style="HEIGHT: 20px" bgColor=#ffffff onMouseover=g.mouseOver(this,'
                            + vID
                            + ',"right","row") onMouseout=g.mouseOut(this,'
                            + vID
                            + ',"right","row")>'
                            + vItemRowStr
                            + '</TR></TABLE></DIV>';
                        vRightTable += vDivStr;

                        // Draw Task Bar  which has outer DIV with enclosed colored bar div, and opaque completion div
                        if(vTaskList[i].getSequenceList()){
                            var children=vTaskList[i].getSequenceList();
                            for(var z=0;z<children.length;z++){
                                //	console.info("start: "+children[z].getStart()+"\t"+children[z].getEnd());


                                vTaskRight = (Date.parse(children[z].getEnd()) - Date
                                    .parse(children[z].getStart()))
                                    / (24 * 60 * 60 * 1000) + 1 / vColUnit;
                                vTaskLeft = Math.ceil((Date.parse(children[z]
                                    .getStart()) - Date.parse(vMinDate))
                                    / (24 * 60 * 60 * 1000));
                                if (vFormat = 'day') {
                                    var tTime = new Date();
                                    tTime.setTime(Date.parse(children[z].getStart()));
                                    if (tTime.getMinutes() > 29)
                                        vTaskLeft += .5
                                }

                                //	console.info("vDayWidth: "+vTaskLeft)

                                vRightTable += '<div id=bardiv_'
                                    + vID
                                    + ' style="position:absolute; top:4px; left:'
                                    + Math.ceil(vTaskLeft * (vDayWidth) + 1)
                                    + 'px; height:18px; width:'
                                    + Math.ceil((vTaskRight) * (vDayWidth) - 1)
                                    + 'px">' //taskbar划线
                                    + '<div id=taskbar_'
                                    + vID
                                    + ' title="'
                                    + children[z].getName()
                                    + ': '
                                    + vDateRowStr
                                    + '" class=gtask style="background-color:#'
                                    + children[z].getColor()
                                    + '; height: 13px; width:'
                                    + Math.ceil((vTaskRight) * (vDayWidth) - 1)
                                    + 'px; cursor: pointer;opacity:0.9;" '
                                    + 'onclick=JSGantt.taskLink("'
                                    + children[z].getLink()
                                    + '",300,200); >' //完成比例
                                    + '<div class=gcomplete style="Z-INDEX: -4; float:left; background-color:black; height:5px; overflow: auto; margin-top:4px; filter: alpha(opacity=40); opacity:0.4; width:'
                                    + children[z].getCompStr()
                                    + '; overflow:hidden">' + '</div>' + '</div>';

                                if (g.getCaptionType()) {
                                    vCaptionStr = '';
                                    switch (g.getCaptionType()) {
                                        case 'Caption' :
                                            vCaptionStr = vTaskList[i].getCaption();
                                            break;
                                        case 'Resource' :
                                            vCaptionStr = vTaskList[i].getResource();
                                            break;
                                        case 'Duration' :
                                            vCaptionStr = vTaskList[i]
                                                .getDuration(vFormat);
                                            break;
                                        case 'Complete' :
                                            vCaptionStr = vTaskList[i].getCompStr();
                                            break;
                                    }
                                    //vRightTable += '<div style="FONT-SIZE:12px; position:absolute; left: 6px; top:-3px;">' + vCaptionStr + '</div>';
                                    vRightTable += '<div style="FONT-SIZE:12px; position:absolute; top:-3px; width:120px; left:'
                                        + (Math
                                        .ceil((vTaskRight) * (vDayWidth)
                                        - 1) + 6)
                                        + 'px">'
                                        + vCaptionStr + '</div>';
                                }
                                vRightTable += '</div>';



                            }




                        }else{
                            vRightTable += '<div id=bardiv_'
                                + vID
                                + ' style="position:absolute; top:4px; left:'
                                + Math.ceil(vTaskLeft * (vDayWidth) + 1)
                                + 'px; height:18px; width:'
                                + Math.ceil((vTaskRight) * (vDayWidth) - 1)
                                + 'px">' //taskbar划线
                                + '<div id=taskbar_'
                                + vID
                                + ' title="'
                                + vTaskList[i].getName()
                                + ': '
                                + vDateRowStr
                                + '" class=gtask style="background-color:#'
                                + vTaskList[i].getColor()
                                + '; height: 13px; width:'
                                + Math.ceil((vTaskRight) * (vDayWidth) - 1)
                                + 'px; cursor: pointer;opacity:0.9;" '
                                + 'onclick=JSGantt.taskLink("'
                                + vTaskList[i].getLink()
                                + '",300,200); >' //完成比例
                                + '<div class=gcomplete style="Z-INDEX: -4; float:left; background-color:black; height:5px; overflow: auto; margin-top:4px; filter: alpha(opacity=40); opacity:0.4; width:'
                                + vTaskList[i].getCompStr()
                                + '; overflow:hidden">' + '</div>' + '</div>';

                            if (g.getCaptionType()) {
                                vCaptionStr = '';
                                switch (g.getCaptionType()) {
                                    case 'Caption' :
                                        vCaptionStr = vTaskList[i].getCaption();
                                        break;
                                    case 'Resource' :
                                        vCaptionStr = vTaskList[i].getResource();
                                        break;
                                    case 'Duration' :
                                        vCaptionStr = vTaskList[i]
                                            .getDuration(vFormat);
                                        break;
                                    case 'Complete' :
                                        vCaptionStr = vTaskList[i].getCompStr();
                                        break;
                                }
                                //vRightTable += '<div style="FONT-SIZE:12px; position:absolute; left: 6px; top:-3px;">' + vCaptionStr + '</div>';
                                vRightTable += '<div style="FONT-SIZE:12px; position:absolute; top:-3px; width:120px; left:'
                                    + (Math
                                    .ceil((vTaskRight) * (vDayWidth)
                                    - 1) + 6)
                                    + 'px">'
                                    + vCaptionStr + '</div>';
                            }
                            vRightTable += '</div>';

                        }



                    }
                }
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                vRightTable += '</DIV>';

            }

            vMainTable += vRightTable
                + '</DIV></TD></TR></TBODY></TABLE></BODY></HTML>';
            //    document.write(vMainTable);

            vDiv.innerHTML = vMainTable;

        }

    } //this.draw

    this.mouseOver = function(pObj, pID, pPos, pType) {
        if (pPos == 'right')
            vID = 'child_' + pID;
        else
            vID = 'childrow_' + pID;

        pObj.bgColor = "#ffffaa";
        vRowObj = JSGantt.findObj(vID);
        if (vRowObj)
            vRowObj.bgColor = "#ffffaa";
    }

    this.mouseOut = function(pObj, pID, pPos, pType) {
        if (pPos == 'right')
            vID = 'child_' + pID;
        else
            vID = 'childrow_' + pID;

        pObj.bgColor = "#ffffff";
        vRowObj = JSGantt.findObj(vID);
        if (vRowObj) {
            if (pType == "group") {
                pObj.bgColor = "#f3f3f3";
                vRowObj.bgColor = "#f3f3f3";
            } else {
                pObj.bgColor = "#ffffff";
                vRowObj.bgColor = "#ffffff";
            }
        }
    }

} //GanttChart