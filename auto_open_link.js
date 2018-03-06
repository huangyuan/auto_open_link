// ==UserScript==
// @name         自动打开网页中的链接(a&img)
// @namespace    auto_open_link
// @version      0.5
// @description  自动打开网页中的链接(a&img)&双击关闭窗口
// @author       huangyuan413026@163.com
// @include      http://*/*
// @include      https://*/*
// @grant        unsafeWindow
// ==/UserScript==

(function() {
    'use strict';

    (function(){
        console.log('加载插件:[auto_open_link]自动打开网页中的链接(a&img)');

        _double_close();

        //定时执行,支持动态内容
        setInterval(function(){
            open_link('a');
            open_link('img');
        },2000);
    })();

    //双击关闭自动打开的窗口(没有toolbar 和 menubar 的窗口)
    function _double_close(){
        if(!window.toolbar.visible && !window.menubar.visible){
            document.body.ondblclick = function (){
                console.log('auto_open_link:双击关闭窗口');
                window.close();
            };
        }
    }

    //在新窗口打开url
    function _open(url){
        if(!url || url.indexOf("//") <= -1) return false;
        var _href = url + (url.indexOf('#') < 0 ? '#' : '');
        console.log('auto_open_link:自动打开了链接' + _href);

        // 弹出窗口的大小
        var w = window.screen.width * 0.75,//width
            h = window.screen.height * 0.8,//height
            l = window.screen.width * 0.1,//left
            t = window.screen.height * 0.1;//top
        window.open(_href,_href.replace(/(http:\/+)|[^a-z0-9]/ig,''),'height='+ h +', width=' + w + ', top= ' + t + ', left=' + l + ', toolbar=no, menubar=no, scrollbars=no, resizable=no,location=n o, status=no');
    }

    //在新窗口打开元素链接(仅支持a和img元素)
    function open_link(tag){

        var _attr = '', _a;

        if(!tag || tag.length <=0) return false;

        _a = document.getElementsByTagName(tag);

        if(!_a || _a.length <= 0) return false;

        tag = (tag || '').toLocaleLowerCase();

        if(tag === 'a'){
            _attr = 'href';
        }
        else if(tag === 'img'){
            _attr='src';
        }
        else{
            console.log('auto_open_link:仅支持a和img元素');
            return false;
        }

        window['auto_open_urls_' + tag] = window['auto_open_urls_' + tag] || 0 ;

        //检测元素数量是否有变化
        //仅对动态添加的新元素添加事件
        if(+window['auto_open_urls_' + tag]  == _a .length ){
            return false;
        }else{
            console.log('auto_open_link:给'+ (_a.length - window['auto_open_urls_' + tag]) + '个' + tag + '元素添加事件');
            window['auto_open_urls_' + tag] = _a.length;
        }

        for(var i = 0 ;i < _a.length; i++){
            //已经添加过事件的不会重复添加
            if(_a[i] && !_a[i].hasAttribute('auto_open_isload') && _a[i][_attr] && _a[i][_attr].indexOf("//") >=0 ){
                _a[i].onmouseover = function(e){
                    //按住ctrl键+鼠标移动时触发
                    if(e.ctrlKey && !e.shiftKey && !e.altKey) {
                        //修复img元素的父元素是a时,会同时打开两个窗口问题
                        if(this.nodeName.toLocaleUpperCase() === 'IMG' && this.parentNode.nodeName.toLocaleUpperCase() === 'A' && this.parentNode['href'] && this.parentNode['href'].indexOf('//') >=0 ){
                            return false;
                        }
                        //添加自定义属性,防止重复打开
                        this.setAttribute('auto_open_isload',true);
                        _open(this[_attr]);
                    }//end if
                };//end function
            }//end if
        }//end for
    }//end open_ele
})();