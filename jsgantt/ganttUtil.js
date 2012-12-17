/**
 * Created with JetBrains WebStorm.
 * User: charlie
 * Date: 12-12-6
 * Time: 上午9:33
 * To change this template use File | Settings | File Templates.
 */



JSGantt.isIE = function() { //ie判断标示符

    if (typeof document.all != 'undefined')
        return true;
    else
        return false;
}


// Used to determine the minimum date of all tasks and set lower bound based on format
/**
 * 获取最小时间，如果是minute
 * @param {} pList
 * @param {} pFormat
 * @return {}
 */
JSGantt.getMinDate = function getMinDate(pList, pFormat) {




    var vDate = new Date();

    if(pList[0].getSequenceList()){
        var item=pList[0].getSequenceList()[0];
        //	console.info(item.getStart())
        if(item){
            vDate.setFullYear(item.getStart().getFullYear(), item.getStart()
                .getMonth(), item.getStart().getDate());
        }

    }else{

        vDate.setFullYear(pList[0].getStart().getFullYear(), pList[0].getStart()
            .getMonth(), pList[0].getStart().getDate());
    }


    // Parse all Task End dates to find min
    for (i = 1; i < pList.length; i++) {

        if(pList[i].getSequenceList()){
            var item=pList[i].getSequenceList()[0];
            //	console.info(item.getStart())
            if(item){
                if(Date.parse(item.getStart()) < Date.parse(vDate)){

                    vDate.setFullYear(item.getStart().getFullYear(), item
                        .getStart().getMonth(), item.getStart()
                        .getDate());
                }
            }
        }else{


            if (Date.parse(pList[i].getStart()) < Date.parse(vDate))
                vDate.setFullYear(pList[i].getStart().getFullYear(), pList[i]
                    .getStart().getMonth(), pList[i].getStart()
                    .getDate());
        }
    }

    if (pFormat == 'minute') //如果是分钟视图，则最小时间从0:0开始
    {
        vDate.setHours(0);
        vDate.setMinutes(0);
    }

    else if (pFormat == 'hour') //如果是小时视图，则最小时间从0:0开始
    {
        vDate.setHours(0);
        vDate.setMinutes(0);
    }
    // Adjust min date to specific format boundaries (first of week or first of month)
    else if (pFormat == 'day') //如果是天视图
    {
        vDate.setDate(vDate.getDate() - 1);//最小时间从前一天开始
        while (vDate.getDay() % 7 > 0) //如果不是周末（getDay()==0，则最小时间向前追溯为上周周末)
        {
            //console.info("getDay" + vDate.getDay());
            vDate.setDate(vDate.getDate() - 1);
        }

    }

    else if (pFormat == 'three') //如果是天视图
    {
        vDate.setDate(vDate.getDate() - 1);//最小时间从前一天开始
        while (vDate.getDay() % 7 > 0) //如果不是周末（getDay()==0，则最小时间向前追溯为上周周末)
        {
            //console.info("getDay" + vDate.getDay());
            vDate.setDate(vDate.getDate() - 1);
        }

    }

    else if (pFormat == 'week') //如果是周视图
    {
        vDate.setDate(vDate.getDate() - 7); //最小时间从一周前开始
        while (vDate.getDay() % 7 > 0) //如果不是周末，追朔到上个星期周末（getDay()==0)
        {
            vDate.setDate(vDate.getDate() - 1);
        }

    }

    else if (pFormat == 'month') //如果是月视图
    {
        while (vDate.getDate() > 1) //如果不是周末，追溯到
        {
            vDate.setDate(vDate.getDate() - 1);
        }
    }

    else if (pFormat == 'quarter') //如果是季度视图
    {
        if (vDate.getMonth() == 0 || vDate.getMonth() == 1
            || vDate.getMonth() == 2) // 如果是第1季度，则最小时间从1月1号开始
            vDate.setFullYear(vDate.getFullYear(), 0, 1);
        else if (vDate.getMonth() == 3 || vDate.getMonth() == 4
            || vDate.getMonth() == 5) //如果是第2季度，则最小时间从4月1号开始
            vDate.setFullYear(vDate.getFullYear(), 3, 1);
        else if (vDate.getMonth() == 6 || vDate.getMonth() == 7
            || vDate.getMonth() == 8)//如果是第3季度，则最小时间从7月1号开始
            vDate.setFullYear(vDate.getFullYear(), 6, 1);
        else if (vDate.getMonth() == 9 || vDate.getMonth() == 10
            || vDate.getMonth() == 11)//如果是第4季度，则最小时间从10月1号开始
            vDate.setFullYear(vDate.getFullYear(), 9, 1);

    }

    return (vDate);

}

// Used to determine the minimum date of all tasks and set lower bound based on format

JSGantt.getMaxDate = function(pList, pFormat) {
    var vDate = new Date();


    if(pList[0].getSequenceList()){
        var item=pList[0].getSequenceList()[pList[0].getSequenceList().length-1];
        //	console.info(item.getStart())
        if(item){
            vDate.setFullYear(item.getEnd().getFullYear(), item.getEnd()
                .getMonth(), item.getEnd().getDate());
        }

    }else{
        vDate.setFullYear(pList[0].getEnd().getFullYear(), pList[0].getEnd()
            .getMonth(), pList[0].getEnd().getDate());
    }





    // Parse all Task End dates to find max
    for (i = 1; i < pList.length; i++) {


        if(pList[i].getSequenceList()){
            var item=pList[i].getSequenceList()[pList[i].getSequenceList().length-1];
            //console.info(item.getEnd())
            if(item){
                if(Date.parse(item.getEnd()) > Date.parse(vDate)){

                    vDate.setFullYear(item.getEnd().getFullYear(), item
                        .getEnd().getMonth(), item.getEnd()
                        .getDate());
                }
            }
        }else{


            if (Date.parse(pList[i].getEnd()) > Date.parse(vDate))
                vDate.setFullYear(pList[i].getStart().getFullYear(), pList[i]
                    .getEnd().getMonth(), pList[i].getEnd()
                    .getDate());
        }


    }

    if (pFormat == 'minute') {
        vDate.setHours(vDate.getHours() + 1);
        vDate.setMinutes(59);
    }

    if (pFormat == 'hour') {
        vDate.setHours(vDate.getHours() + 2);
    }

    // Adjust max date to specific format boundaries (end of week or end of month)
    if (pFormat == 'day') {
        vDate.setDate(vDate.getDate() + 1);

        while (vDate.getDay() % 6 > 0) {
            vDate.setDate(vDate.getDate() + 1);
        }

    }

    // Adjust max date to specific format boundaries (end of week or end of month)
    if (pFormat == 'three') {
        vDate.setDate(vDate.getDate() + 1);

        while (vDate.getDay() % 6 > 0) {
            vDate.setDate(vDate.getDate() + 1);
        }

    }

    if (pFormat == 'week') {
        //For weeks, what is the last logical boundary?
        vDate.setDate(vDate.getDate() + 11);

        while (vDate.getDay() % 6 > 0) {
            vDate.setDate(vDate.getDate() + 1);
        }

    }

    // Set to last day of current Month
    if (pFormat == 'month') {
        while (vDate.getDay() > 1) {
            vDate.setDate(vDate.getDate() + 1);
        }

        vDate.setDate(vDate.getDate() - 1);
    }

    // Set to last day of current Quarter
    if (pFormat == 'quarter') {
        if (vDate.getMonth() == 0 || vDate.getMonth() == 1
            || vDate.getMonth() == 2)
            vDate.setFullYear(vDate.getFullYear(), 2, 31);
        else if (vDate.getMonth() == 3 || vDate.getMonth() == 4
            || vDate.getMonth() == 5)
            vDate.setFullYear(vDate.getFullYear(), 5, 30);
        else if (vDate.getMonth() == 6 || vDate.getMonth() == 7
            || vDate.getMonth() == 8)
            vDate.setFullYear(vDate.getFullYear(), 8, 30);
        else if (vDate.getMonth() == 9 || vDate.getMonth() == 10
            || vDate.getMonth() == 11)
            vDate.setFullYear(vDate.getFullYear(), 11, 31);

    }

    return (vDate);

}



JSGantt.createSelector=function(vFormatArr,vFormat,vGanttVar){


    var vLeftTable= '<TR><TD border=1 colspan=5 align=left style="BORDER-TOP: #efefef 1px solid; FONT-SIZE: 11px; BORDER-LEFT: #efefef 1px solid; height=18px">&nbsp;&nbsp; '

    if (vFormatArr.join().indexOf("minute") != -1) {
        if (vFormat == 'minute')
            vLeftTable += '<INPUT TYPE=RADIO NAME="radFormat" VALUE="minute" checked>Minute';
        else
            vLeftTable += '<INPUT TYPE=RADIO NAME="radFormat" onclick=JSGantt.changeFormat("minute",'
                + vGanttVar + '); VALUE="minute">Minute';
    }

    if (vFormatArr.join().indexOf("hour") != -1) {
        if (vFormat == 'hour')
            vLeftTable += '<INPUT TYPE=RADIO NAME="radFormat" VALUE="hour" checked>Hour';
        else
            vLeftTable += '<INPUT TYPE=RADIO NAME="radFormat" onclick=JSGantt.changeFormat("hour",'
                + vGanttVar + '); VALUE="hour">Hour';
    }

    if (vFormatArr.join().indexOf("day") != -1) {
        if (vFormat == 'day')
            vLeftTable += '<INPUT TYPE=RADIO NAME="radFormat" VALUE="day" checked>Day';
        else
            vLeftTable += '<INPUT TYPE=RADIO NAME="radFormat" onclick=JSGantt.changeFormat("day",'
                + vGanttVar + '); VALUE="day">Day';
    }

    if (vFormatArr.join().indexOf("three") != -1) {
        if (vFormat == 'three')
            vLeftTable += '<INPUT TYPE=RADIO NAME="radFormat" VALUE="three" checked>Three';
        else
            vLeftTable += '<INPUT TYPE=RADIO NAME="radFormat" onclick=JSGantt.changeFormat("three",'
                + vGanttVar + ') VALUE="month">Three';
    }
    if (vFormatArr.join().indexOf("week") != -1) {
    if (vFormatArr.join().indexOf("week") != -1) {
        if (vFormat == 'week')
            vLeftTable += '<INPUT TYPE=RADIO NAME="radFormat" VALUE="week" checked>Week';
        else
            vLeftTable += '<INPUT TYPE=RADIO NAME="radFormat" onclick=JSGantt.changeFormat("week",'
                + vGanttVar + ') VALUE="week">Week';
    }

    if (vFormatArr.join().indexOf("month") != -1) {
        if (vFormat == 'month')
            vLeftTable += '<INPUT TYPE=RADIO NAME="radFormat" VALUE="month" checked>Month';
        else
            vLeftTable += '<INPUT TYPE=RADIO NAME="radFormat" onclick=JSGantt.changeFormat("month",'
                + vGanttVar + ') VALUE="month">Month';
    }

    if (vFormatArr.join().indexOf("quarter") != -1) {
        if (vFormat == 'quarter')
            vLeftTable += '<INPUT TYPE=RADIO NAME="radFormat" VALUE="quarter" checked>Quarter';
        else
            vLeftTable += '<INPUT TYPE=RADIO NAME="radFormat" onclick=JSGantt.changeFormat("quarter",'
                + vGanttVar + ') VALUE="quarter">Quarter';
    }

    //            vLeftTable += '<INPUT TYPE=RADIO NAME="other" VALUE="other" style="display:none"> .';

      vLeftTable += '</TD></TR>';
        return vLeftTable;
   // return "";
}
}



