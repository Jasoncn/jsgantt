/**
 * Created with JetBrains WebStorm.
 * User: charlie
 * Date: 12-12-6
 * Time: 上午11:57
 * To change this template use File | Settings | File Templates.
 */





/**任务
 * 0=false，1=true
 * @param {} pID   task ID名称
 * @param {} pName  task名称
 * @param {} pStart    起时间
 * @param {} pEnd      截止时间
 * @param {} pColor    颜色
 * @param {} pLink		上面的链接
 * @param {} pMile 是否是里程碑
 * @param {} pRes   资源名称
 * @param {} pComp  完成比例，例如40%
 * @param {} pGroup 是否存在父节点
 * @param {} pParent 父节点id
 * @param {} pOpen		初始化时是否展开
 * @param {} pDepend
 * @param {} pCaption
 */
    JSGantt.TaskItem = function(jsonObj) {

    //    pID, pName, pStart, pEnd, pColor, pLink, pMile,
     //       pRes, pComp, pGroup, pParent, pOpen, pDepend, pCaption
        jsonObj= eval("data="+jsonObj)


     if(!jsonObj){
         return;
     }












        var vID, vName ,vColor,vLink,vMile,vRes, vComp, vParent, vGroup,vOpen,vDepend ,vCaption , vDuration, vCritical, vSequenceList=[];
        var vStart;// = new Date();
        var vEnd ;//  = new Date();

        var vLevel = 0;
        var vNumKid = 0;
        var vVisible  = 1;
        var x1, y1, x2, y2;

      if(jsonObj.pDuration!=undefined){
             vDuration = jsonObj.pDuration;
       }

        if(jsonObj.pSequenceList!=undefined){

            var arr=pSequenceList;
            for(var i=0;i<arr.length;i++){
                vSequenceList.push(new   JSGantt.TaskItem(arr[i]) );
            }


        }


      if(jsonObj.pCritical!=undefined){
             vCritical = jsonObj.pCritical;
       }
     if(jsonObj.pID!=undefined){
          vID = jsonObj.pID;
     }

     if(jsonObj.pName!=undefined){
             vName = jsonObj.pName;
      }

       // console.info(jsonObj.pStart)
       if(jsonObj.pStart!=undefined){

           vStart= jsonObj.pStart;
       }else{

       }

        if(jsonObj.pEnd!=undefined){
             vEnd = jsonObj.pEnd;
        }else{

        }
        if(jsonObj.pColor!=undefined){
             vColor = jsonObj.pColor;
        }
        if(jsonObj.pLink!=undefined){
             vLink = jsonObj.pLink;
        }
        if(jsonObj.pMile!=undefined){
             vMile = jsonObj.pMile;
        }
        if(jsonObj.pRes!=undefined){
             vRes = jsonObj.pRes;
        }
        if(jsonObj.pComp!=undefined){
             vComp = jsonObj.pComp;
        }
        if(jsonObj.pGroup!=undefined){
             vGroup = jsonObj.pGroup;
        }
        if(jsonObj.pParent!=undefined){
             vParent = jsonObj.pParent;


        }
        if(jsonObj.pOpen!=undefined){
             vOpen = jsonObj.pOpen;
        }
        if(jsonObj.pDepend!=undefined){
             vDepend = jsonObj.pDepend;
        }
        if(jsonObj.pCaption!=undefined){
             vCaption = jsonObj.pCaption;
        }


    if (vGroup != 1) {
        if(jsonObj.pStart&&jsonObj.pEnd){

            //console.info("TaskItem\npStart"+pStart+"\tpEnd"+pEnd)
            vStart = JSGantt.parseDateStr(jsonObj.pStart, g.getDateInputFormat());
            vEnd = JSGantt.parseDateStr(jsonObj.pEnd, g.getDateInputFormat());
        }
    }

    /**
     * 字段，用于debug
     * @type {*}
     */

    //this.pStart=pStart;
    //this.pEnd=pEnd;
    //this.pComp=pComp;
   // this.pColor=pColor;

    this.getID = function() {
        return vID
    };
    this.getName = function() {
        return vName
    };
    this.getStart = function() {
        return vStart
    };
    this.getEnd = function() {
        return vEnd
    };
    this.getColor = function() {
        return vColor
    };
    this.getLink = function() {
        return vLink
    };
    this.getMile = function() {
        return vMile
    };

    this.getCritical = function() {
            return vCritical
        };
    this.getDepend = function() {
        if (vDepend)
            return vDepend;
        else
            return null
    };
    this.getCaption = function() {
        if (vCaption)
            return vCaption;
        else
            return '';
    };

    this.getSequenceList = function() {
        if (vSequenceList)
            return vSequenceList;
        else
            return null;
    };

    this.setSequenceList = function(pSequenceList) {
        if (pSequenceList){
            vSequenceList  =pSequenceList;
        }

    };

    this.getResource = function() {
        if (vRes)
            return vRes;
        else
            return '&nbsp';
    };
    this.getCompVal = function() {
        if (vComp)
            return vComp;
        else
            return 0;
    };
    this.getCompStr = function() {
        if (vComp)
            return vComp + '%';
        else
            return '';
    };

    this.getDuration = function(vFormat) { //判断选择的区间 TaskItem 方法（minute/hour/week/month)
        var vDuration;
        if (vMile)
            vDuration = '-';
        else if (vFormat == 'hour') {
            tmpPer = Math.ceil((this.getEnd() - this.getStart())
                / (60 * 60 * 1000));
            if (tmpPer == 1)
                vDuration = '1 Hour';
            else
                vDuration = tmpPer + ' Hours';
        }

        else if (vFormat == 'minute') {
            tmpPer = Math.ceil((this.getEnd() - this.getStart()) / (60 * 1000));
            if (tmpPer == 1)
                vDuration = '1 Minute';
            else
                vDuration = tmpPer + ' Minutes';
        }

        else { //if(vFormat == 'day') {
            tmpPer = Math.ceil((this.getEnd() - this.getStart())
                / (24 * 60 * 60 * 1000) + 1);
            if (tmpPer == 1)
                vDuration = '1 Day';
            else
                vDuration = tmpPer + ' Days';
        }

        //else if(vFormat == 'week') {
        //   tmpPer =  ((this.getEnd() - this.getStart()) /  (24 * 60 * 60 * 1000) + 1)/7;
        //   if(tmpPer == 1)  vDuration = '1 Week';
        //   else             vDuration = tmpPer + ' Weeks';
        //}

        //else if(vFormat == 'month') {
        //   tmpPer =  ((this.getEnd() - this.getStart()) /  (24 * 60 * 60 * 1000) + 1)/30;
        //   if(tmpPer == 1) vDuration = '1 Month';
        //   else            vDuration = tmpPer + ' Months';
        //}

        //else if(vFormat == 'quater') {
        //   tmpPer =  ((this.getEnd() - this.getStart()) /  (24 * 60 * 60 * 1000) + 1)/120;
        //   if(tmpPer == 1) vDuration = '1 Qtr';
        //   else            vDuration = tmpPer + ' Qtrs';
        //}
        return (vDuration)
    };

    this.getParent = function() {

        return vParent
    };
    this.getGroup = function() {
        return vGroup
    };
    this.getOpen = function() {
        return vOpen
    };
    this.getLevel = function() {
        return vLevel
    };
    this.getNumKids = function() {
        return vNumKid
    };
    this.getStartX = function() {
        return x1
    };
    this.getStartY = function() {
        return y1
    };
    this.getEndX = function() {
        return x2
    };
    this.getEndY = function() {
        return y2
    };
    this.getVisible = function() {
        return vVisible
    };
    this.setDepend = function(pDepend) {
        vDepend = pDepend;
    };
    this.setStart = function(pStart) {
        vStart = pStart;
        this.fStart=pStart;

    };
    this.setEnd = function(pEnd) {
        vEnd = pEnd;
        this.fEnd=pEnd;
    };
    this.setLevel = function(pLevel) {
        vLevel = pLevel;
    };
    this.setNumKid = function(pNumKid) {
        vNumKid = pNumKid;
    };
    this.setCompVal = function(pCompVal) {
        vComp = pCompVal;
    };
    this.setStartX = function(pX) {
        x1 = pX;
    };
    this.setStartY = function(pY) {
        y1 = pY;
    };
    this.setEndX = function(pX) {
        x2 = pX;
    };
    this.setEndY = function(pY) {
        y2 = pY;
    };
    this.setOpen = function(pOpen) {
        vOpen = pOpen;
    };
    this.setVisible = function(pVisible) {
        vVisible = pVisible;
    };

}



