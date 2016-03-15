(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['./zepto.min'], factory);
    } else if (typeof exports === 'object') {
        // Node, CommonJS之类的
        module.exports = factory(require('./zepto.min'));
    } else {
        // 浏览器全局变量(root 即 window)
        root.returnExports = factory(root.zepto.min);
    }
}(this, function ($) {
    var div, 
        dialogBox,
        dialogTitle,
        dialogContent,
        dialogBtnBox,
        popup;

    //    方法
    function Dialog(options){
        var defaults = {
            clickClass:"",//点击class
            dialogClass:"ui-dialog",//默认弹出框class
            width:"auto",//默认宽度,若是数字无需加单位
            height:"auto",//默认高度,若是数字无需加单位
            timeout: 2000,//默认延时
            title:"",//弹出框标题
            content:"",//弹出框内容
            cancel:false,//是否有取消按钮 true/false
            sure:false,//是否有确定按钮 true/false
            cancelText:"取消",//默认按钮文字
            sureText:"确定",//默认按钮文字
            closeIcon:false,//是否有关闭icon true/false
            closeIconBg:"",//icon的背景
            popup:false//是否需要遮罩 true/false
        };
        for (var prop in options) {
            if (options.hasOwnProperty(prop)) {
                defaults[prop] = options[prop];
            }
        }
        this.settings = defaults; 
        this.init();  
    };
    //单列模式添加弹出框div容器
    var createBox=function(){
        div=document.createElement("div");
        return div;
    };
    var getSingle=function(fn){
        var result;
        return function(){
            return result || (result=fn.apply(this.arguments));
        }
    };
    var createSingleBox=getSingle(createBox);
        
    Dialog.prototype={
        constructor:Dialog,
        init:function(){
            this.bindEvent();
        },
        //事件绑定
        bindEvent:function(){
            var that=this;
            document.addEventListener("click",function(){
                if(event.target.className==that.settings.clickClass){
                    that.create(that.closeIcon,that.disappear,that.popup);
                }
            },false);
            if(this.settings.closeIcon==true||this.settings.cancel==true||this.settings.sure==true){
                this.close();
            }
        },
        //dialog Dom生成
        create:function(callback,callback2,callback3){
            dialogBox=createSingleBox();
            if(this.settings.title!=""){
                dialogTitle='<div class="ui-dialog-title">'+this.settings.title+'</div>';  
            }else{
                dialogTitle="";
            }
            if(this.settings.content!=""){
                dialogContent='<p class="ui-dialog-content">'+this.settings.content+'</p>';
            }else{
                dialogContent="";    
            }
            if(this.settings.cancel==true&&this.settings.sure==true){
                dialogBtnBox='<div class="ui-dialog-btn"><input type="button" value="'+this.settings.cancelText+'"><input type="button" value="'+this.settings.sureText+'"></div>';
            }else if(this.settings.sure==true&&this.settings.cancel!=true){
                dialogBtnBox='<div class="ui-dialog-btn"><input type="button" value="'+this.settings.sureText+'"></div>';
            }else if(this.settings.sure!=true&&this.settings.cancel==true){
                dialogBtnBox='<div class="ui-dialog-btn"><input type="button" value="'+this.settings.cancelText+'"></div>';    
            }else{
                dialogBtnBox="";
            }
            if(this.settings.title!=""||this.settings.content!=""){
                dialogBox.innerHTML=dialogTitle+dialogContent+dialogBtnBox;
            }
            if (typeof callback === 'function'&&this.settings.closeIcon==true){
                callback.call(this);
            }
            div.className=this.settings.dialogClass;
            if(this.settings.height>=0){
                div.style.height=this.settings.height+"px";
            }else{
                div.style.height=this.settings.height;
            }
            if(this.settings.width>=0){
                div.style.width=this.settings.width+"px";
            }else{
                div.style.width=this.settings.width;
            }
            document.body.appendChild(div);
            //在弹框添加进dom中再执行遮罩生成
            if(typeof callback3 === 'function'&&this.settings.popup==true){
                callback3.call(this);  
            }
            //在弹框添加进dom中再执行自动隐藏
            if (typeof callback2 === 'function'&&this.settings.closeIcon!=true&&this.settings.cancel!=true&&this.settings.sure!=true){
                callback2.call(this);
            }
        },
        //关闭icon生成
        closeIcon:function(){
            var icon=document.createElement("span");
            icon.className="ui-dialog-close";
            if(this.settings.closeIconBg!=""){
                icon.style.background=this.settings.closeIconBg;
            }else{
                icon.innerText="×";   
            }
            dialogBox.appendChild(icon);
        },
        //弹框自动关闭、遮罩移除
        disappear:function(){
            var that=this;
            setTimeout(function(){
                dialogBox.remove();
                if(that.settings.popup==true){
                    popup.remove();
                }
            }, this.settings.timeout);      
        },
        //点击关闭弹框、遮罩移除
        close:function(){
            var that=this;
            document.addEventListener("click",function(){
                if(event.target.className=="ui-dialog-close"||event.target.parentNode.className=="ui-dialog-btn"){
                    dialogBox.remove();
                    if(that.settings.popup==true){
                        popup.remove();
                    }
                }
            },false)    
        },
        //弹框遮罩生成
        popup:function(){
            popup=document.createElement("div");
            popup.className="ui-popup";
            document.body.insertBefore(popup,div);
        }
    }
    //暴露公共方法
    return Dialog;
}));