/**
 * Created with JetBrains WebStorm.
 * User: charlie
 * Date: 12-12-7
 * Time: 上午9:40
 * To change this template use File | Settings | File Templates.
 * parse the xml to create TaskItemList,it supports the chrome,ie,firefox,but the
 * mechanism is difference between chrome and others
 */



JSGantt.createTaskItemForChrome = function(task) { //解析xml文件，构建TaskItem
// Manually parse the file as it is loads quicker
    //console.info(pGanttVar)

    var     Task = task.replace(/<\//g, '<');
    var te = Task.split(/<pid>/i)

    if (te.length > 2) {
        var pID = te[1];
    } else {
        var pID = 0;
    }
    pID *= 1;

     te = Task.split(/<pName>/i)
    if (te.length > 2) {
        var pName = te[1];
    } else {
        var pName = "No Task Name";
    }

     te = Task.split(/<pstart>/i)
    if (te.length > 2) {
        var pStart = te[1];
    } else {
        var pStart = "";
    }

     te = Task.split(/<pEnd>/i)
    if (te.length > 2) {
        var pEnd = te[1];
    } else {
        var pEnd = "";
    }

     te = Task.split(/<pColor>/i)
    if (te.length > 2) {
        var pColor = te[1];
    } else {
        var pColor = '0000ff';
    }

     te = Task.split(/<pLink>/i)
    if (te.length > 2) {
        var pLink = te[1];
    } else {
        var pLink = "";
    }

     te = Task.split(/<pMile>/i)
    if (te.length > 2) {
        var pMile = te[1];
    } else {
        var pMile = 0;
    }
    pMile *= 1;

     te = Task.split(/<pRes>/i)
    if (te.length > 2) {
        var pRes = te[1];
    } else {
        var pRes = "";
    }

     te = Task.split(/<pComp>/i)
    if (te.length > 2) {
        var pComp = te[1];
    } else {
        var pComp = 0;
    }
    pComp *= 1;

     te = Task.split(/<pGroup>/i)
    if (te.length > 2) {
        var pGroup = te[1];
    } else {
        var pGroup = 0;
    }
    pGroup *= 1;

     te = Task.split(/<pParent>/i)
    if (te.length > 2) {
        var pParent = te[1];
    } else {
        var pParent = 0;
    }
    pParent *= 1;

     te = Task.split(/<pOpen>/i)
    if (te.length > 2) {
        var pOpen = te[1];
    } else {
        var pOpen = 1;
    }
    pOpen *= 1;

     te = Task.split(/<pDepend>/i)
    if (te.length > 2) {
        var pDepend = te[1];
    } else {
        var pDepend = "";
    }
    //pDepend *= 1;
    if (pDepend.length == 0) {
        pDepend = ''
    } // need this to draw the dependency lines

     te = Task.split(/<pCaption>/i)
    if (te.length > 2) {
        var pCaption = te[1];
    } else {
        var pCaption = "";
    }

    var tmp={};
    tmp.pID=pID;
    tmp.pName=pName;
    tmp.pStart=pStart;
    tmp.pEnd=pEnd;
    tmp.pColor=pColor;
    tmp.pLink=pLink;
    tmp.pMile=pMile;
    tmp.pRes=pRes;
    tmp.pComp=pComp;
    tmp.pGroup=pGroup;
    tmp.pOpen=pOpen;
    tmp.pDepend=pDepend;
    tmp.pCaption=pCaption;
    tmp.pParent=pParent;



    // Finally add the task
    return (new JSGantt.TaskItem(JSON.stringify(tmp)));
}



JSGantt.addTasksForChrome = function(ThisFile, pGanttVar) {
    // Thanks to vodobas at mindlence,com for the initial pointers here.
   var  XMLLoader = new XMLHttpRequest();
    XMLLoader.onreadystatechange = function() {

        if (XMLLoader.readyState == 4) {

            var task = XMLLoader.responseText.split(/<task>/gi);

            var n = task.length; // the number of tasks.
            for (var i = 1; i < n; i++) {
                var ta=task[i];
                var item=JSGantt.createTaskItemForChrome(ta);
                if(ta.indexOf("<children>")!=-1&&ta.indexOf("<child>")!=-1){
                    var arr=ta.split(/<child>/gi);
                    var m=arr.length;
                    var children=[];
                    for(var k=1;k<m;k++){
                        var sub=JSGantt.createTaskItemForChrome(arr[k]);
                        children.push(sub);
                    }
                    item.setSequenceList(children);
                }

                pGanttVar.addTaskItems(item)
            }

        }

    };
    XMLLoader.open("GET", ThisFile, false);
    XMLLoader.send(null);
}




JSGantt.addTasksForOthers = function(pGanttVar) {  //ie，火狐解析

    Task = xmlDoc.getElementsByTagName("task");

    var n = xmlDoc.documentElement.childNodes.length; // the number of tasks. IE gets this right, but mozilla add extra ones (Whitespace)


    for (var i = 0; i < Task.length; i++) {


        var taskItem=	JSGantt.createTaskItemForOthers(Task[i]);

        try {
            var children=[];


            var arr=Task[i].getElementsByTagName("child");

            if(arr.length>0){
                for(var j =0;j<arr.length;j++){
                    var sub=JSGantt.createTaskItemForOthers(arr[j]);


                    children.push(sub);


                }

                taskItem.setSequenceList(children);
            }else{

            }


        } catch (error) {
            //console.info(error)
            chidren = null;
        }


        // Finally add the task
        pGanttVar.addTaskItems(taskItem);
    }
}

JSGantt.createTaskItemForOthers=function(task){


    try {
        pID = task.getElementsByTagName("pID")[0].childNodes[0].nodeValue;
    } catch (error) {
        pID = 0;
    }
    pID *= 1; // make sure that these are numbers rather than strings in order to make jsgantt.js behave as expected.
    //console.info("pid: "+pID)
    if (/**pID != 0**/true) {  //屏蔽掉平行项目上有多个子项目的时间
        try {
            pName = task.getElementsByTagName("pName")[0].childNodes[0].nodeValue;
        } catch (error) {
            pName = "No Task Name";
        } // If there is no corresponding entry in the XML file the set a default.

        try {
            pColor = task.getElementsByTagName("pColor")[0].childNodes[0].nodeValue;
        } catch (error) {
            pColor = "0000ff";
        }

        try {
            pParent = task.getElementsByTagName("pParent")[0].childNodes[0].nodeValue;
        } catch (error) {
            pParent = 0;
        }
        pParent *= 1;
        var pStart,pEnd;
        var arr=task.getElementsByTagName("child")
        if(arr.length==0){

            try {
                pStart = task.getElementsByTagName("pStart")[0].childNodes[0].nodeValue;
                //	console.info("pStart: "+pStart);
            } catch (error) {
                pStart = "";
            }

            try {
                pEnd = task.getElementsByTagName("pEnd")[0].childNodes[0].nodeValue;
            } catch (error) {
                pEnd = "";
            }

        }



        try {
            pLink = task.getElementsByTagName("pLink")[0].childNodes[0].nodeValue;
        } catch (error) {
            pLink = "";
        }

        try {
            pMile = task.getElementsByTagName("pMile")[0].childNodes[0].nodeValue;
        } catch (error) {
            pMile = 0;
        }
        pMile *= 1;

        try {
            pRes = task.getElementsByTagName("pRes")[0].childNodes[0].nodeValue;
        } catch (error) {
            pRes = "";
        }

        try {
            pComp = task.getElementsByTagName("pComp")[0].childNodes[0].nodeValue;
        } catch (error) {
            pComp = 0;
        }
        pComp *= 1;

        try {
            pGroup = task.getElementsByTagName("pGroup")[0].childNodes[0].nodeValue;
        } catch (error) {
            pGroup = 0;
        }
        pGroup *= 1;

        try {
            pOpen = task.getElementsByTagName("pOpen")[0].childNodes[0].nodeValue;
        } catch (error) {
            pOpen = 1;
        }
        pOpen *= 1;

        try {
            pDepend = task.getElementsByTagName("pDepend")[0].childNodes[0].nodeValue;
        } catch (error) {
            pDepend = 0;
        }
        //pDepend *= 1;
        if (pDepend.length == 0) {
            pDepend = ''
        } // need this to draw the dependency lines

        try {
            pCaption = task.getElementsByTagName("pCaption")[0].childNodes[0].nodeValue;
        } catch (error) {
            pCaption = "";
        }

    }

    var tmp={};
    tmp.pID=pID;
    tmp.pName=pName;
    tmp.pStart=pStart;
    tmp.pEnd=pEnd;
    tmp.pColor=pColor;
    tmp.pLink=pLink;
    tmp.pMile=pMile;
    tmp.pRes=pRes;
    tmp.pComp=pComp;
    tmp.pGroup=pGroup;
    tmp.pOpen=pOpen;
    tmp.pDepend=pDepend;
    tmp.pCaption=pCaption;
    tmp.pParent=pParent;

    var json=JSON.stringify(tmp);

    return new JSGantt.TaskItem(json)


}