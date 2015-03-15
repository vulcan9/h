!function(e){function t(){}void 0===e&&console.log("# H 라이브러리는 JQuery 라이브러리가 필요합니다."),void 0!==window.H&&(console.log("# 전역변수에 이미 'H' 속성이 정의되어 있습니다."),console.log("# 본 라이브러리는 'H' 속성을 재정의 합니다."))
var n,r=function(e,r){n=r||window.document,this.initialize(),this._init(e),this.log&&(t=this._out,t("# 로그를 출력하지 않으려면 log 속성을 false로 설정하세요."),t("* NS : ",this.namespace," - ",this.xmlNS),t("# H 라이브러리 (html, xHtml)테스트 통과 브라우저 : Chrome 33.0.1750, FF27.0.1, IE 10.0.13"))}
r.prototype={_out:function(){console.log.apply(window.console,arguments)},_init:function(e){for(var t in e)t in this&&(this[t]=e[t])},initialize:function(){this.checkSupport(),this.log=!1,this.xmlNS=e("html").attr("xmlns"),this.namespace=this._getNamespace(this.xmlNS),this.onMouseOver=null,this.onMouseOut=null,this.onClick=null,this._ANCHOR_CLASSNAME_START="dongil-highlight-anchor-start",this._ANCHOR_CLASSNAME_END="dongil-highlight-anchor-end",this._ANCHOR_ID="anchor_id",this._anchorIDCounter=0,this._MARK_TAG="mark",this.style={"background-color":"green"},this.className=null,this._customDatas={},this._canNormalize=this._normalizeTest()},_getNamespace:function(e){return"http://www.w3.org/1999/xhtml"===e?"xhtml":null},checkSupport:function(){return this._getSelection()?n.createRange?void 0:(alert("not support Broswer : createRange"),void 0):(alert("not support Broswer : getSelection"),void 0)},_getSelection:function(){return window.getSelection()},_getSelectRange:function(e){e=e||0
var t=this._getSelection(),n=t.getRangeAt(e)
return n},_addCustomData:function(e,t){this._customDatas[e]=t},_removeCustomData:function(e){return void 0==e?(this._customDatas={},void 0):(delete this._customDatas[e],void 0)},_refreshCustomData:function(){for(var e in this._customDatas){var t=this.getMarkTags(e)
t.length<1&&this._removeCustomData(e)}},_getCustomData:function(e){return void 0==e?this._customDatas:this._customDatas[e]},_newAnchorID:function(){++this._anchorIDCounter
var e=this._ANCHOR_ID+"_"+this._anchorIDCounter
return e},_addAnchorID:function(t,n){var r=this._getAnchorID(t),i=r.indexOf(n)
if(!(i>-1)){r.unshift(n)
var o=r.join()
e(t).attr(this._ANCHOR_ID,o)}},_removeAnchorID:function(t,n){var r=this._getAnchorID(t),i=r.indexOf(n)
if(!(0>i)){r.splice(i,1)
var o=r.join()
e(t).attr(this._ANCHOR_ID,o)}},_getAnchorID:function(t,n){var r=e(t).attr(this._ANCHOR_ID),i=r?r.split(","):[]
return n?i[0]:i},_hasAnchorID:function(e,t){var n=this._getAnchorID(e)
return-1!==n.indexOf(t)},_cleanAnchorID:function(t){e(t).removeAttr(this._ANCHOR_ID)},add:function(e){var n=this._getSelection()
if(t("\n# add (rangeCount) : ",n.rangeCount),n.rangeCount<1)return t("# 선택된 객체 없음 - ",n.isCollapsed),void 0
var r=this._newAnchorID()
this._addCustomData(r,e)
var i=this._getSelectRange()
this._addAnchorNode(r,i)
var o=i.commonAncestorContainer
this._divideAnchorRange(r,o),this._normalizeAnchorRange()},addNode:function(e,t){var r=n.createRange()
r.selectNodeContents(e)
var i=this._getSelection()
i.removeAllRanges(),i.addRange(r),this.add(t)},getText:function(e){var t=this.getMarkTags(e)
return t.text()},_addAnchorNode:function(n,r){t("# 위치 파악을 위한 태그 추가")
var i=this._getSelection(),o=i.anchorNode,a=i.anchorOffset,s=i.focusNode,h=i.focusOffset,c=r.endContainer==s&&r.endOffset==h
if(c){var _=this._insertAnchor(s,h)
e(_).addClass(this._ANCHOR_CLASSNAME_END)
var d=this._insertAnchorByRange(r)
e(d).addClass(this._ANCHOR_CLASSNAME_START)}else{var _=this._insertAnchor(o,a)
e(_).addClass(this._ANCHOR_CLASSNAME_END)
var d=this._insertAnchorByRange(r)
e(d).addClass(this._ANCHOR_CLASSNAME_START)}this._addAnchorID(_,n),this._addAnchorID(d,n)},_insertAnchorByRange:function(e){var t=this._createAnchorNode()
return e.insertNode(t),t},_insertAnchor:function(e,t){var n=this._getSelection()
n.collapse(e,t)
var r=this._getSelectRange(),i=this._createAnchorNode()
return r.insertNode(i),i},_createAnchorNode:function(){var t=n.createElement("span")
return e(t).css({display:"none"}),t},_divideAnchorRange:function(n,r){t("# 영역(태그) 분할 (root) : ",r)
var i=this,o="."+this._ANCHOR_CLASSNAME_START+", ."+this._ANCHOR_CLASSNAME_END,a=e(r).find(o).filter(function(){var e=i._getAnchorID(this,!0)
return e==n})
if(2!==a.length)throw"anchor 개수가 맞지 않습니다."
var s=a[0],h=a[1]
this._domSearch(r,s,h)},_domSearch:function(e,n,r){function i(t){if(t){var o=this._isSelectExceptionTag(t)
if(t==r)return s.push(t),a=!0,void 0
if(t==n?s.push(t):o||s.push(t),o);else{var h=t.firstChild
if(h)return i.apply(this,[h]),void 0}var c=t.nextSibling
if(c)return i.apply(this,[c]),void 0
for(var _=t.parentNode;_&&!_.nextSibling;)_=_.parentNode
_!=e.parentNode&&_&&i.apply(this,[_.nextSibling])}}var o=this._getAnchorID(n,!0)
t("\n# DOM 탐색 : [",this._ANCHOR_ID,"] ",o)
var a=!1,s=[]
if(i.apply(this,[n]),!a)throw"마지막 Anchor Node를 찾지 못함"
for(var h=s.length,c=0;h>c;++c){var _=s[c]
if(0!=c){if(c==h-1){this._replaceEndNode(_)
break}this._replaceMiddleNode(_,o)}else this._replaceStartNode(_)}},_isSelectExceptionTag:function(n){return e(n).is("select")||e(n).is("option")?!0:""==e(n).text().trim()?(t("node : ",n),t("node parentNode : ",n.parentNode),!0):!1},_replaceStartNode:function(t){e(t).remove()},_replaceEndNode:function(t){e(t).remove()},_replaceMiddleNode:function(e,t){this._wrap(e,t)},_wrap:function(r,i){if(r.nodeType===Node.ELEMENT_NODE)this.isMarkTag(r)?t("	 >ELEMENT(Mark Tag중첩) : ",r):t("	 >ELEMENT : ",r)
else if(r.nodeType===Node.TEXT_NODE){if(!this._isEmptyTag(r)){t("	 >TEXT(wrap) : ",e(r).text())
var o=n.createRange()
o.selectNodeContents(r)
var a=this._createMarkNode(i)
o.surroundContents(a),this._addMarkEvent(a)
var s=a.parentNode
this.isMarkTag(s)&&(t("	 >TEXT(중첩 splice) : ",e(r).text()),this._spliceNode(a))}}else t("	 >기타 요소 (nodeType:",r.nodeType,") :",e(r).text())},_createMarkNode:function(t){var n=e("<"+this._MARK_TAG+">")
return this._addAnchorID(n[0],t),this.style&&n.css(this.style),this.className&&n.addClass(this.className),n[0]},_spliceNode:function(t){for(var n,r=t.parentNode,i=e(r).contents(),o=0,a=i.length,s=this._getAnchorID(r),h=s.join();a>o;){var c=i[o]
if(e(c).is("."+this._ANCHOR_CLASSNAME_START)||e(c).is("."+this._ANCHOR_CLASSNAME_END))++o
else if(this._isSelectExceptionTag(c)||this._isCloseExceptionTag(c))e(r).before(c),++o
else{if(this.isMarkTag(c))e(r).before(c),n=c
else{var _=e(r).clone().empty()
_.append(c),e(r).before(_),n=_[0]}this._addMarkEvent(n),this._addAnchorID(n,h),++o}}e(r).remove()},_addMarkEvent:function(t){this._removeMarkEvent(t),t&&(e(t).on("mouseover",e.proxy(this._onMouseOver_mark,this)),e(t).on("mouseout",e.proxy(this._onMouseOut_mark,this)),e(t).on("click",e.proxy(this._onClick_mark,this)))},_removeMarkEvent:function(t){t&&(e(t).off("mouseover",e.proxy(this._onMouseOver_mark,this)),e(t).off("mouseout",e.proxy(this._onMouseOut_mark,this)),e(t).off("click",e.proxy(this._onClick_mark,this)))},_onMouseOver_mark:function(e){var t=e.target,n=this._getAnchorID(t,!0)
this.onMouseOver&&this.onMouseOver.apply(this,[n,t])},_onMouseOut_mark:function(e){var t=e.target,n=this._getAnchorID(t,!0)
this.onMouseOut&&this.onMouseOut.apply(this,[n,t])},_onClick_mark:function(e){var t=e.target,n=this._getAnchorID(t,!0)
this.onClick&&this.onClick.apply(this,[n,t])},getMarkTags:function(t){var n=e(this._MARK_TAG).filter("["+this._ANCHOR_ID+"]")
if(void 0==t)return n
var r=this,i=n.filter(function(){return r._hasAnchorID(this,t)})
return i},isMarkTag:function(t){var n=e(t)
return n.is(this._MARK_TAG)&&null!=this._getAnchorID(t,!0)?!0:!1},_isEmptyTag:function(t){if(t.nodeType==Node.TEXT_NODE)return 0==t.length
var n=e(t).contents()
return 0==n.length||n[0].nodeType==Node.TEXT_NODE&&0==n[0].length},_normalizeAnchorRange:function(){for(var n=this.getMarkTags(),r=n.length;--r>=0;){var i=n[r]
this._isEmptyTag(i)?(t("	* 보정 (empty): ",i),e(i).remove()):this._normalize(i.parentNode)}this._refreshCustomData()},_isCloseExceptionTag:function(t){return e(t).is("br")||e(t).is("input")?!0:!1},_getPrevNode:function(t,n){for(var r,i=t.previousSibling;i;){if(this._isCloseExceptionTag(i)){r=i
break}if(!n&&i.nodeType==Node.ELEMENT_NODE)break
var o=e(i).text()
if(""!=o){r=i
break}i=i.previousSibling}return r},_getNextNode:function(t,n){for(var r,i=t.nextSibling;i;){if(this._isCloseExceptionTag(i)){r=i
break}if(!n&&i.nodeType==Node.ELEMENT_NODE)break
var o=e(i).text()
if(""!=o){r=i
break}i=i.nextSibling}return r},save:function(){t("\n# save\n")
var e=this._getCustomData(),n=this._getMarkData(),r={custom:e,ranges:n}
try{var i=JSON.stringify(r,null,"	")}catch(o){var a="데이터 처리중 에러발생 : "+o
return alert(a),void 0}return t(i),this.restore(r),i},_getMarkData:function(){for(var e=this.getMarkTags(),t=[],r=e.length,i=0;r>i;++i){var o=e[i],a=this._getAnchorID(o),s=this._unwrap(o),h=this._getSelection()
h.removeAllRanges()
var c=n.createRange()
c.selectNodeContents(s),h.addRange(c)
var _=s.parentNode
this._normalize(_)
var d=c.startContainer,l=c.endContainer,u=c.startOffset,v=c.endOffset,f={anchorID:a.join(),startContainer:this._dom2xpath(d),startOffset:u,endContainer:this._dom2xpath(l),endOffset:v}
t.push(f)}return t},_unwrap:function(n){t("\n- unwrap")
var r=e(n).contents()
this._normalize(n.parentNode)
var i=this._getPrevNode(n,!0),o=this._getNextNode(n,!0)
this._removeMarkEvent(n),i?i.nodeType==Node.ELEMENT_NODE?(t("		 case 1 : validePrev 1-1. <p> <span/> [<mark/>] <span/> </p>"),t("		 case 1 : validePrev 1-2. <p> <span/> [<mark/>] </p>"),e(i).after(r),e(n).remove()):(t("		 case 1 : validePrev 1-3. : <p> text [<mark/>] </p>"),t("		 case 1 : validePrev 1-4. : <p> text [<mark/>] text </p>"),e(i).after(r),e(n).remove()):o?o.nodeType==Node.ELEMENT_NODE?(t("		 case 2 : valideNext 2-1. <p> [<mark/>] <span/> </p>"),e(o).before(r),e(n).remove()):(t("		 case 2 : valideNext 2-2. : <p> [<mark/>] text </p>"),e(o).before(r),e(n).remove()):(t("		 case 3 : no sibling : <p> [<mark/>] </p>"),e(r[0]).unwrap())
var a=r[0]
return a},remove:function(e){t("\n# remove : ",e,"\n"),e&&(this._removeCustomData(e),this._removeExecute(e))},removeNode:function(e,t){if(e&&this.isMarkTag(e)){if(!t){var n=this._getAnchorID(e,!0)
return this.remove(n),void 0}var r=this._getAnchorID(e)
if(!(r.length<1))for(var i in r){var n=r[i]
this.remove(n)}}},_removeExecute:function(e){for(var t=e?!1:!0,n=this.getMarkTags(e),r=n.length,i=0;r>i;++i){var o=n[i]
if(!t){var a=this._getAnchorID(o)
if(a.length>1){this._removeAnchorID(o,e)
continue}}var s=this._unwrap(o),h=s.parentNode
this._normalize(h)}this._refreshCustomData()},removeAll:function(){this._removeCustomData(),this._removeExecute()},restore:function(e){t("\n# restore\n")
var r=this.getMarkTags()
if(r.length>0&&this.removeAll(),e){if("string"==typeof e)try{e=JSON.parse(e)}catch(i){var o="데이터 파싱중 에러발생 : "+i
return alert(o),void 0}var a=e.custom||{},s=e.ranges
if(s){var h=this._getSelection()
h.removeAllRanges()
for(var c=s.length;--c>=0;){var _=s[c],d=_.anchorID,l=this._xpath2dom(_.startContainer),u=this._xpath2dom(_.endContainer)
h.removeAllRanges()
var v=n.createRange()
v.setStart(l,+_.startOffset),v.setEnd(u,+_.endOffset),h.addRange(v)
var f=this._createMarkNode(d)
v.surroundContents(f),this._addMarkEvent(f)}for(var g in a){var p=a[g]
this._addCustomData(g,p)}h.removeAllRanges()}}},_dom2xpath:function(e,t){if(t=t||"",!e)return t
switch(e.nodeType){case 3:case 4:var n=this._getSiblingIndex(e),r="/text()["+n+"]"
return this._dom2xpath(e.parentNode,r)
case 1:var i=e.nodeName,n=this._getSiblingIndex(e),r="/"+i+"["+n+"]"+t
return this._dom2xpath(e.parentNode,r)
case 9:return t
default:return""}},_getSiblingIndex:function(e){for(var t=e.nodeName,n=e.nodeType,r=0,i=e;i;)i.nodeName==t&&i.nodeType==n&&r++,i=i.previousSibling
return r},_xpath2dom:function(r){r=r.toLowerCase(),t("* 파싱 : ",r)
var i=r.split("/")
i.shift()
for(var o="",a=i.length,s=n,h=0;a>h;++h){var c=i[h],_=/\w+[\(\)]*?(?=\[)/,d=_.exec(c)[0],l=/\d+?(?=\])/,u=l.exec(c)[0]-1
"text()"==d?(t("selector:",o),s=e(o).contents().filter(function(){return"#text"==this.nodeName}).get(u)):(o&&(o+=">"),o+=d+":eq("+u+")",h==a-1&&(s=e(o)[0]))}return s},_normalizeTest:function(){var t='<div id="test1">테스트1<br/>테스트2</div>',r=e(t).appendTo(n.body),i=r.contents(),o=i[0],a=i[2]
e(o).after(a),r[0].normalize()
var s="테스트1테스트2"===r.text()
return r.remove(),s},_normalize:function(e){var t=navigator.appName
if("Microsoft Internet Explorer"!=t&&this._canNormalize)e.normalize()
else for(var n,r=e.firstChild;r;){if(r.nodeType==Node.TEXT_NODE)for(;(n=r.nextSibling)&&n.nodeType==Node.TEXT_NODE;)r.appendData(n.data),e.removeChild(n)
else this._normalize(r)
r=r.nextSibling}}},window.H=r}($)
