






function cabcStatus(str,x,y,statusWidth,statusHeight,elementId){
    this.elementId = "cabcStatus";
    this.x = 0;
    this.y = 0;
    this.statusWidth = 0
    this.statusHeight = 0
    this.str = "";
    this.statusObj = null;

    this.makingTag = function(){
        if(!document.getElementById(this.elementId))
            document.body.insertAdjacentHTML("BeforeEnd","<textarea id=\""+ this.elementId +"\" style=\"position:absolute;left:"+ this.x +"px;top:"+ this.y +"px;width:"+ this.statusWidth +"px;height:"+ this.statusHeight +"px;padding:3px;font-size:12px;background:#FFFFFF;color:#303030;border:1px dashed #A0A0A0;\"></textarea>");
        this.statusObj = document.getElementById(this.elementId);
        this.statusObj.style.filter = "alpha(opacity=80)";
        this.statusObj.innerHTML = this.str;
    }
    this.show = function(){
        this.statusObj.innerHTML = this.str;
    }
    this.setText = function(str){
        this.str = str;
    }
    this.showText = function(str){
        this.setText(str);
        this.show();
    }
    this.setPoint = function(x,y){
        this.x = x;
        this.statusObj.style.left = this.x + "px";
        this.y = y;
        this.statusObj.style.top = this.y + "px";
    }
    this.setBound = function(w,h){
        this.statusWidth = w;
        this.statusHeight = h;
        this.statusObj.style.width = this.statusWidth;
        this.statusObj.style.height = this.statusHeight;
    }

    if(elementId)	this.elementId = elementId;
    if(x)	this.x = x;
    if(y)	this.y = y;
    if(statusWidth) this.statusWidth = statusWidth;
    if(statusHeight) this.statusHeight = statusHeight;
    if(str) this.str = str;

    this.floatStrat = function(){
        var el = document.getElementById(this.elementId);
        el.verticalpos="fromtop"; 
        el.flag = true;
        if(!el.startX)	el.startX = 0;
        if(!el.startY)	el.startY = 0;
        el.x = 0;
        el.y = 0;
        this.cabcStatusInterval();
    }
    this.floatEnd = function(){
        document.getElementById(this.elementId).flag = false;
    }
    this.setFloatPoint = function(x,y){
        document.getElementById(this.elementId).startX = x;
        document.getElementById(this.elementId).startY = y;
    }
    this.cabcStatusInterval = function(){
        this.el=document.getElementById?document.getElementById(this.elementId):document.all?document.all[this.elementId]:document.layers[this.elementId];
        this.el.x = this.el.startX;

        if (this.el.verticalpos=="fromtop")
            this.el.y = this.el.startY;
        else{
            this.el.y = document.body.scrollTop + document.body.clientHeight;
            this.el.y -= this.el.startY;
        }

        this.el.stayTopLeft_cabcStatus = function(){
            if (this.verticalpos=="fromtop"){
                var pY = document.body.scrollTop;
                this.y += (pY + this.startY - this.y)/8;
            }
            else{
                var pY = document.body.scrollTop + document.body.clientHeight;
                this.y += (pY - this.startY - this.y)/8;
            }

            if(this.verticalpos=="fromtop"){
                var px = document.body.scrollLeft;
                this.x += (px + this.startX - this.x)/8;
            }
            else{
                var px = document.body.scrollTop + document.body.clientWidth;
                this.x += (px - this.startX - this.x)/8;
            }
            this.style.left=this.x;
            this.style.top=this.y;
            if(this.flag){
                setTimeout("document.getElementById('"+this.id+"').stayTopLeft_cabcStatus()", 10);
            }
        }
        document.getElementById(this.elementId).stayTopLeft_cabcStatus()
    }
    this.makingTag();
}

var verticalpos="fromtop"; 
function JSFX_FloatTopDiv(obj_id){
    var startX = 1,
    startY = 1;
    var ns = (navigator.appName.indexOf("Netscape") != -1);
    var d = document;
    function ml(id){
        var el=d.getElementById?d.getElementById(id):d.all?d.all[id]:d.layers[id];
        if(d.layers)el.style=el;
        el.sP=function(x,y){
            this.style.left=x;
            this.style.top=y;
        };
        el.x = startX;
        if (verticalpos=="fromtop")
            el.y = startY;
        else{
            el.y = ns ? pageYOffset + innerHeight : document.body.scrollTop + document.body.clientHeight;
            el.y -= startY;
        }
        return el;
    }
    window.stayTopLeft=function(){
        if (verticalpos=="fromtop"){
            var pY = ns ? pageYOffset : document.body.scrollTop;
            ftlObj.y += (pY + startY - ftlObj.y)/8;
        }
        else{
            var pY = ns ? pageYOffset + innerHeight : document.body.scrollTop + document.body.clientHeight;
            ftlObj.y += (pY - startY - ftlObj.y)/8;
        }

        if (verticalpos=="fromtop"){
            var px = ns ? pageXOffset : document.body.scrollLeft;
            ftlObj.x += (px + startX - ftlObj.x)/8;
        }
        else{
            var px = ns ? pageXOffset + innerweight : document.body.scrollTop + document.body.clientWidth;
            ftlObj.x += (px - startX - ftlObj.x)/8;
        }

        ftlObj.sP(ftlObj.x, ftlObj.y);
        setTimeout("stayTopLeft()", 10);
    }
    ftlObj = ml(obj_id);
    stayTopLeft();
}
