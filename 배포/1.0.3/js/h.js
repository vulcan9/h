



/*/////////////////////////////////////////////////////////////////

	* 
	* 이름 : JavaScript-Highlight (H 라이브러리)
	* Version : 1.0.3 (2015.03.15)
	* (c) Dong-il Park(vulcanProject : http://vulcan9.tistory.com)
	* 
	* Dependancy : 
	* 		- Jquery (jquery.1.10.2.js)
	* 
	* 용도 : HTML 문서 텍스트 하이라이팅 
	* 		(마우스 드래그한 선택 영역 데이터를 저장/복귀/표시)
	* 
	* 브라우져 지원 여부 : all browsers, except IE before version 10
	* 
	* 사용방법 : 별도 문서 (test.html)에 버튼 클릭 기능 구현부분 참고
	* 		var h = new H();
	* 		h.add() ...
	* 
	* API 목록
	* 
	* [properties]
	* log : Boolean - consol창에 log 출력 여부
	* onMouseOver : Fuunction - mark 태그에 마우스가 Over 됬을때 콜백
	* onMouseOut : Fuunction - mark 태그에 마우스가 Out 됬을때 콜백
	* onClick : Fuunction - mark 태그에 마우스가 Click 됬을때 콜백
	* style : Object - mark 태그의 style 정의 객체
	* className : String - mark 태그에 class를 지정
	* 
	* [Function]
	* initialize : function(initObj) - initObj객체에 초기 설정값 지정
	* add : function(dataObj) - 사용자 데이터(dataObj)와 함께 현재 선택 영역을 mark 표시에 추가
	* addNode : function(node, dataObj) - 사용자 데이터(dataObj)와 함께 node를 mark 표시
	* remove : function(anchorID) - anchorID를 가진 mark 표시 제거
	* removeNode : function(markNode) - mark 표시 직접 제거
	* removeAll : function() - mark 표시 모두 제거
	* save : function() - 현재 mark표시 목록을 JSON String으로 반환
	* restore : function(saveData) - JSON String 데이터를 파싱하여 mark 표시 드로잉
	* getMarkTags : function(anchorID) - mark 태그 목록을 반환 (anchorID가 없으면 전체 목록을 반환)
	* isMarkTag : function(node) - node가 mark 표시에 사용되는 태그인지 감별
	* getText : function(anchorID) - anchorID로 지정된 mark 표시 구간의 text를 반환
	* 

	// 참고 자료

		* 레퍼런스 : 
			- http://www.w3.org/TR/DOM-Level-2-Traversal-Range/ranges.html
			- http://help.dottoro.com/ljtjxblx.php
		
		* highlight 라이브러리 (사용안함)
		Highlight text using jQuery and the HTML5 mark tag
			- http://freestyle-developments.co.uk/blog/?p=165
		rangy
			- https://code.google.com/p/rangy/	
			- http://rangy.googlecode.com/svn/trunk/demos/commands.html
		
		* xpath (사용안함)
			- javascript-xpath-0.1.12.js
			- wgxpath.js
			- xpath.js
			- html-xpath.js
		
		* minimize
			- http://lisperator.net/uglifyjs/
			- http://lisperator.net/uglifyjs/#demo
		
	// History
	
	Version : 1.0.0 (2014.03.10)
		- 첫 배포
	Version : 1.0.1 (2014.03.27)
		- restory 후 add 할때 anchorID를 counter에 의존함으로써 중복된 아이디가 발생함
		  이를 _getUID 함수를 사용하여 unique하게 바꿈
		- nodeName을 직접 비교하지 않고 toUpperCase 를 적용하여 비교함
	
	Version : 1.0.2 (2014.04.02)
		- 버그수정 : anchorID를 추가 제거하는 과정에서 mark태그에 있는 복수 id에 대하여 중복 검사하도록 수정
		  (mark 태그 remove 후에도 찌꺼기 남았었음)
		  
	Version : 1.0.3 (2015.03.15)
		- 버그수정 : IE 11 브라우저 지원
		  
/////////////////////////////////////////////////////////////////*/




(function($){
	
	if($ === undefined){
		console.log("# H 라이브러리는 JQuery 라이브러리가 필요합니다.");
	}
	
	if(window.H !== undefined){
		console.log("# 전역변수에 이미 'H' 속성이 정의되어 있습니다.");
		console.log("# 본 라이브러리는 'H' 속성을 재정의 합니다.");
	}
	
	// Closure 전역변수
	var document;
	
	// Closure 전역함수
	function out(){
		// 동적으로 재정의됨
	}

	////////////////////////////////////////////
	//
	// H 라이브러리 정의
	//
	////////////////////////////////////////////
	
	var H = function(initObj, documentContext){
		
		// document (iframe의 경우 contentDocument를 지정한다.)
		document = documentContext || window.document;
		
		this.initialize();
		
		// 사용자 초기화 설정
		this._init(initObj);
		
		// 로그 출력 (코드에서 this를 생략하고 함수를 호출하기 위함)
		if(this.log){
			out = this._out;
			
			// 화면 로그 출력
			out("# 로그를 출력하지 않으려면 log 속성을 false로 설정하세요.");
			out("* NS : ", this.namespace, " - ", this.xmlNS);
			
			out("# H 라이브러리 (html, xHtml)테스트 통과 브라우저 : Chrome 33.0.1750, FF27.0.1, IE 10.0.13");
		}
	};

	H.prototype = {
			
			// 콘솔 출력
			_out: function(){
				console.log.apply(window.console, arguments);
			},
			
			_init: function(initObj){
				for(var prop in initObj){
					if(prop in this){
						this[prop] = initObj[prop];
					}
				}
			},
			
			initialize : function(){
				//out("H 생성");
				
				this.checkSupport();
				//this._selection = this._getSelection();
				
				// 로그 출력
				this.log = false;

				// 디버그 모드
				//this.debug = false;

				this.xmlNS = $("html").attr("xmlns");
				this.namespace = this._getNamespace(this.xmlNS);

				//------------------
				// 이벤트 콜백함수 변수 지정
				//------------------
				
				this.onMouseOver = null;
				this.onMouseOut = null;
				this.onClick = null;
				
				//------------------
				// 기타 변수 지정
				//------------------
				
				// 임시 선택 위치 표시를 위한 태그에 적용될 클래스 이름
				this._ANCHOR_CLASSNAME_START = "dongil-highlight-anchor-start";
				this._ANCHOR_CLASSNAME_END = "dongil-highlight-anchor-end";

				// mark 표시될 태그 식별자
				this._ANCHOR_ID = "anchor_id";
				//this._anchorIDCounter = 0;
				
				// mark 표시에 사용될 태그 이름
				this._MARK_TAG = "mark";
				
				// mark 롤오버시 자신의 객체만 색상 적용할지 여부 (사용안함)
				//this._splitView = false;
				
				// mark 결과에 대해 근접한 mark 태그끼리는 합칠것인지 옵션 (사용안함)
				//this._useMergedTag = true;
				
				// mark css style 적용
				// mark 태그에 적용될 style 객체 설정
				this.style = {
					"background-color":"green"
				};
				
				// mark 태그에 적용될 css 클래스이름
				this.className = null;
				
				//------------------
				// 런타임 변수 지정
				//------------------

				// 사용자 데이터 저장
				this._customDatas = {};
				
				// normalize 메서드 사용 가능성 여부 (브라우져 버그 이슈때문임)
				this._canNormalize = this._normalizeTest();
			},
			
			_getNamespace: function(xmlNS){
				if(xmlNS === 'http://www.w3.org/1999/xhtml'){
					return 'xhtml';
				}
				return null;
			},
			
			//------------------------------
			// Selection
			//------------------------------
			
			// 브라우져 지원 여부 (IE > 9)
			checkSupport: function(){
				if (!this._getSelection()){
					alert("not support Broswer : getSelection");
					return;
				}
				
				if(!document.createRange){
					alert("not support Broswer : createRange");
					return;
	            }
			},
			
			_getSelection: function(){
				// all browsers, except IE before version 9
				return window.getSelection();
			},
			
			// 선택된 영역 정보
			_getSelectRange: function(idx){
				idx = idx || 0;
				// all browsers, except IE before version 9
				var selection = this._getSelection();
                var selectRange = selection.getRangeAt(idx);
				return selectRange;
			},
			
			/*
			// 선택된 텍스트 (태그 제외)
			getSelectText: function(idx){
				var selectRange = this._getSelectRange(idx);
				var text = (selectRange)? selectRange.toString() : "";
				return text;
			},
			*/
			
			// ------------------------------
			// Custom 데이터 관리
			// ------------------------------

			// dataObj 는 mark에 대하여 저장할 임의의 사용자 데이터임
			// 예) dataObj = {description:"링크", page:"1"}
			
			_addCustomData: function(anchorID, dataObj){
				this._customDatas[anchorID] = dataObj;
			},

			_removeCustomData: function(anchorID){
				if(anchorID == undefined){
					this._customDatas = {};
					return;
				}
				delete this._customDatas[anchorID];
			},

			// 사용자 데이터 업데이트 (불필요한 _customDatas 정리)
			_refreshCustomData: function(){
				for(var anchorID in this._customDatas)
				{
					var $mark = this.getMarkTags(anchorID);
					if($mark.length < 1){
						this._removeCustomData(anchorID);
					}
				}
			},

			_getCustomData: function(anchorID){
				if(anchorID == undefined){
					return this._customDatas;
				}
				return this._customDatas[anchorID];
			},

			//-----------------------------
			// AnchorID 관리
			//-----------------------------
			
			_getUID: function (){
				var uid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
				var uid = uid.replace(/[xy]/g, function(c){
					var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
					return v.toString(16);
				});
				
				return uid;
			},
			
			_newAnchorID: function(){
				//++this._anchorIDCounter;
				//var anchorID = this._ANCHOR_ID + "_" + this._anchorIDCounter;
				var anchorID = this._getUID();
				return anchorID;
			},

			_addAnchorID: function(markTag, anchorID){
				/*
				var IDs = this._getAnchorID(markTag);
				var index = IDs.indexOf(anchorID);
				if(index > -1) return;
				
				IDs.unshift(anchorID);
				var IDString = IDs.join();
				$(markTag).attr(this._ANCHOR_ID, IDString);
				*/
				
				// ID 목록 - 복수 id 중복 검사
				var IDs = this._getAnchorID(markTag);
				var ar = anchorID.split(",");
				
				var id;
				for(var i=0; i<ar.length; ++i){
					id = ar[i];
					
					var index = IDs.indexOf(id);
					if(index > -1){
						// 지우고 다시 추가
						IDs.splice(index, 1);
					}
					IDs.unshift(id);
				}

				var IDString = IDs.join();
				$(markTag).attr(this._ANCHOR_ID, IDString);
			},
			
			_removeAnchorID: function(markTag, anchorID){
				/*
				var IDs = this._getAnchorID(markTag);
				var index = IDs.indexOf(anchorID);
				if(index < 0) return;
				
				IDs.splice(index, 1);
				var IDString = IDs.join();
				$(markTag).attr(this._ANCHOR_ID, IDString);
				*/

				// ID 목록 - 복수 id 중복 검사
				var IDs = this._getAnchorID(markTag);
				var ar = anchorID.split(",");

				var id;
				for(var i=0; i<ar.length; ++i){
					id = ar[i];
					
					var index = IDs.indexOf(id);
					if(index < 0) continue;
					IDs.splice(index, 1);
				}

				var IDString = IDs.join();
				$(markTag).attr(this._ANCHOR_ID, IDString);
			},
			
			// forOne : 아이디 그룹중 대표 아이디 하나만 리턴할때 (true)
			_getAnchorID: function(markTag, forOne){

				var IDString = $(markTag).attr(this._ANCHOR_ID);
				var IDs = (IDString)? IDString.split(","):[];
				
				if(forOne){
					// 아이디 리스트중 우선순위에 있는 아이디를 리턴
					return IDs[0];
				}else{
					// 아이디 리스트를 리턴
					return IDs;
				}
			},
			
			// 해당 anchorID 그룹에 속하는지 여부
			_hasAnchorID: function(markTag, anchorID){
				var IDs = this._getAnchorID(markTag);
				return (IDs.indexOf(anchorID) !== -1);
			},
			
			// AnchorID 모두 제거
			_cleanAnchorID: function(markTag){
				$(markTag).removeAttr(this._ANCHOR_ID);
			},
			
			////////////////////////////////////////////
			//
			// ADD
			//
			////////////////////////////////////////////
			
			/*
			// 선택 영역을 추가하여 화면에 표시하는 절차는 다음과 같다.
			
			1. 선택된 영역(selection range)의 데이터를 읽어들인다.
			2. range의 값을 기초로 좌 상단에서 우 하단 방향으로 (DOM 구조에서도) 순서를 정한뒤
			   순서에 따라 start 앵커와 end 앵커를 임시로 삽입한다.
			3. start, end 앵커 사이의 DOM 구조를 순환하면서 각 NODE 사이사이에 mark 태그를 삽입위치를 검색한다.
			   이때 mark 태그를 바로 삽입하지 않고(DOM을 바로 갱신됨) 순환 검색이 완료된 후 
			   앵커 태그를 삭제와 mark 태그를 하나씩 적용한다.
			4. mark 태그 생성 순서와 역순으로 순환하면서 보정작업을 한다.(merge, normalize)
			*/
			
			// 중복 선택 가능하도록 하는 방법
			// anchorID 중복 허용하고(배열 문자열로 관리) 대표 아이디를 설정하여 실행 우선순위를 결정
			// 대표 아이디는 anchorID 그룹중 맨 첫번째 요소로 정함

			add : function(dataObj){
				var selection = this._getSelection();
				out("\n# add (rangeCount) : ", selection.rangeCount);
				if(selection.rangeCount < 1){
					out("# 선택된 객체 없음 - ", selection.isCollapsed);
					return;
				}
				
				// 앵커 start-end 짝을 구별하기 위함
				// 같은 mark tag 그룹인지 구별하기 위함
				var anchorID = this._newAnchorID();

				// 사용자 데이터 저장
				this._addCustomData(anchorID, dataObj);
				
				//***********************************

				// 주의 : 아래 로직이 실행되면서 range가 계속 변함
				// 따라서 rootContainer를 조사하는 시점에 주의해야함

                // 앵커 노드 삽입
                var range = this._getSelectRange();
                //out('commonAncestorContainer : ', range.commonAncestorContainer);
				this._addAnchorNode(anchorID, range);
				
				// 선택 영역 (태그 기준으로) 분할
				// commonAncestorContainer : Range 전체를 포함하고있는 가장 근접한 DOM node
				// commonAncestorContainer 범위 내에서만 DOM 탐색되도록 제한
				var rootContainer = range.commonAncestorContainer;
                //out('rootContainer : ', rootContainer);
				this._divideAnchorRange(anchorID, rootContainer);

				//***********************************
				
				// 앵커 Merge
				this._normalizeAnchorRange();

				// 선택 제거 (FF에서는 선택상태가 남아있다.)
				selection.removeAllRanges();
			},
			
			// node를 mark 리스트에 추가
			addNode:function(node, dataObj){
				// 선택
				var range = document.createRange();
				range.selectNodeContents(node);
				
				var selection = this._getSelection();
				selection.removeAllRanges();
				selection.addRange(range);
				
				// 추가
				this.add(dataObj);
			},

			// mark 표시된 내용을 리턴
			getText: function(anchorID){
				var mark = this.getMarkTags(anchorID);
				return mark.text();
			},
			
			//-----------------------------
			// Anchor Node (선택 분기점) 남기기
			//-----------------------------

            _addAnchorNode: function(anchorID, range){
                out("# 위치 파악을 위한 태그 추가");
                var selection = this._getSelection();

                var anchorNode = selection.anchorNode;
                var anchorOffset = selection.anchorOffset;
                var focusNode = selection.focusNode;
                var focusOffset = selection.focusOffset;

                // anchor의 위치가 순차적으로 되어야함
                // DOM 방향에 역순으로 드래그 선택한 경우 DOM 순환시 문제 생김
                // 참고 : http://help.dottoro.com/ljnaoorf.php

                // 왼쪽에서 오른쪽으로 드래그하여 선택된 상황(true)인지를 파악
                //var leftToRight = (range.endContainer == focusNode) && (range.endOffset == focusOffset);

                // http://stackoverflow.com/questions/9180405/detect-direction-of-user-selection-with-javascript
                var position = selection.anchorNode.compareDocumentPosition(focusNode);
                // position == 0 if nodes are the same
                var leftToRight = true;
                if (!position && anchorOffset > focusOffset || position === Node.DOCUMENT_POSITION_PRECEDING){
                    leftToRight = false;
                }
                //out('leftToRight : ', leftToRight);

                /*
                if(range.startContainer == range.endContainer){
                    if(range.startOffset == range.endOffset){
                        // selection type : Caret
                        //return;
                    }
                }
                */

                //out('selection : ', selection);
                //out('s/e : ', anchorNode, focusNode);
                //out('range : ', range);
                //out('s/e : ', range.startContainer, range.endContainer);

                var startContainer = range.startContainer;
                var startOffset = range.startOffset;
                var startAnchor = _createAnchorNode();

                var endContainer = range.endContainer;
                var endOffset = range.endOffset;
                var endAnchor = _createAnchorNode();

                if(leftToRight)
                {
                    selection.collapse(endContainer, endOffset);
                    var endRange = this._getSelectRange();
                    $(endAnchor).addClass(this._ANCHOR_CLASSNAME_END);
                    endRange.insertNode(endAnchor);

                    selection.collapse(startContainer, startOffset);
                    var startRange = this._getSelectRange();
                    $(startAnchor).addClass(this._ANCHOR_CLASSNAME_START);
                    startRange.insertNode(startAnchor);
                }
                else
                {
                    // 역순 드래그 선택
                    selection.collapse(endContainer, endOffset);
                    var startRange = this._getSelectRange();
                    $(startAnchor).addClass(this._ANCHOR_CLASSNAME_END);
                    startRange.insertNode(startAnchor);

                    selection.collapse(startContainer, startOffset);
                    var endRange = this._getSelectRange();
                    $(endAnchor).addClass(this._ANCHOR_CLASSNAME_START);
                    endRange.insertNode(endAnchor);
                }

                // 선택 영역 다시 활성화
                var rangeObj = document.createRange();
                rangeObj.setStartAfter(startAnchor.nextSibling);
                rangeObj.setEndBefore(endAnchor.previousSibling);
                selection.removeAllRanges();
                selection.addRange(rangeObj);

                this._addAnchorID(endAnchor, anchorID);
                this._addAnchorID(startAnchor, anchorID);

                function _createAnchorNode(){
                    var anchor = document.createElement("span");
                    $(anchor).css({display:"none"});
                    return anchor;
                }
            },

            /* 버그 패치 전
            _addAnchorNode: function(anchorID, range){
                out("# 위치 파악을 위한 태그 추가");

                var selection = this._getSelection();

                var anchorNode = selection.anchorNode;
                var anchorOffset = selection.anchorOffset;
                var focusNode = selection.focusNode;
                var focusOffset = selection.focusOffset;

                // anchor의 위치가 순차적으로 되어야함
                // DOM 방향에 역순으로 드래그 선택한 경우 DOM 순환시 문제 생김
                // 참고 : http://help.dottoro.com/ljnaoorf.php

                // 왼쪽에서 오른쪽으로 드래그하여 선택된 상황(true)인지를 파악
                var leftToRight = (range.endContainer == focusNode) && (range.endOffset == focusOffset);

				if(leftToRight)
				{
					var endAnchor = this._insertAnchor(focusNode, focusOffset);
					$(endAnchor).addClass(this._ANCHOR_CLASSNAME_END);
					
					var startAnchor = this._insertAnchorByRange(range);
					//var startAnchor = this._insertAnchor(anchorNode, anchorOffset);
					$(startAnchor).addClass(this._ANCHOR_CLASSNAME_START);
				}
				else
				{
					// 역순 드래그 선택
					var endAnchor = this._insertAnchor(anchorNode, anchorOffset);
					$(endAnchor).addClass(this._ANCHOR_CLASSNAME_END);

					var startAnchor = this._insertAnchorByRange(range);
					//var startAnchor = this._insertAnchor(focusNode, focusOffset);
					$(startAnchor).addClass(this._ANCHOR_CLASSNAME_START);
				}
				
				this._addAnchorID(endAnchor, anchorID);
				this._addAnchorID(startAnchor, anchorID);
			},

			_insertAnchorByRange:function(range){
				// 현재 range 선택 상태임
				var anchor = this._createAnchorNode();
				range.insertNode(anchor);
				return anchor;
			},
			
			_insertAnchor:function(node, offset){
				var selection = this._getSelection();
				selection.collapse(node, offset);
                var range = this._getSelectRange();
				
				var anchor = this._createAnchorNode();
				range.insertNode(anchor);
				return anchor;
			},
			
			_createAnchorNode: function(){
				var anchor = document.createElement("span");
				$(anchor).css({display:"none"});
				return anchor;
			},
			*/

			//-----------------------------
			// Anchor Node를 기준으로 태그 분할하여 영역 감싸기
			//-----------------------------
			
			_divideAnchorRange: function(anchorID, root){
				out("# 영역(태그) 분할 (root) : ", root);
				
				// anchorNode 찾기
				var self = this;
				var selector = "." + this._ANCHOR_CLASSNAME_START + ", ." + this._ANCHOR_CLASSNAME_END;
				var $anchor = $(root).find(selector).filter(function(){
					var id = self._getAnchorID(this, true);
					return (id == anchorID);
				});
				
				//out("$anchor", anchorID, $anchor);
				if($anchor.length !== 2){
					throw "anchor 개수가 맞지 않습니다.";
				}
				
				// 주의 : [0],[1] 순서가 (top-bottom, left-right) 맞는지 주의
				var startNode = $anchor[0];
				var endNode = $anchor[1];
				this._domSearch(root, startNode, endNode);
			},

			//-----------------------------
			// DOM 순환
			//-----------------------------
			
			// root Node부터 순차적으로 탐색
			_domSearch: function(root, startNode, endNode){

				// anchorID 부여
				var anchorID = this._getAnchorID(startNode, true);
				out("\n# DOM 탐색 : [", this._ANCHOR_ID, "] ", anchorID);
				
				var success = false;
				
				// DOM 구조가 바뀌므로 임시로 저장한 후 나중에 적용
				var nodelist = [];
				explore.apply(this, [startNode]);
				
				if(!success){
					throw "마지막 Anchor Node를 찾지 못함";
				}
				
				// 탐색 결과 목록을 처리
				var len = nodelist.length;
				for(var i=0; i<len; ++i)
				{
					var node = nodelist[i];
					if(i == 0){
						this._replaceStartNode(node);
						continue;
					}
					if(i == len-1){
						this._replaceEndNode(node);
						break;
					}
					
					this._replaceMiddleNode(node, anchorID);
				}
				
				function explore(node){
					if(!node) return;
					
					var selectException = this._isSelectExceptionTag(node);
					
					if(node == endNode){
						// 마지막 종료
						nodelist.push(node);
						success = true;
						return;
					}
					
					if(node == startNode){
						// 처음  시작
						nodelist.push(node);
					}else{
						// 중간
						if(selectException){
							// 예외처리할 태그는 Mark 처리대상에서 제외
						}else{
							nodelist.push(node);
						}
					}
					
					// 순환
					if(selectException){
						// 하위 노드는 검색하지 않음
					}else{
						// node.firstChild를 참조할 경우 비어있는 "" 노드가 포함된다.
						// 따라서 주변 노드를 탐색할때에는 jquery API를 이용한다.
						var child = node.firstChild;
						if(child){explore.apply(this, [child]);return;}
					}
					
					var next = node.nextSibling;
					if(next){explore.apply(this, [next]);return;}
					
					var parent = node.parentNode;
					while(parent){
						if(parent.nextSibling) break;
						parent = parent.parentNode;
					}
					if(parent == root.parentNode) return;
					if(parent){explore.apply(this, [parent.nextSibling]);}
				}
			},

			/**************************************************
			
			BUG FIXED : 2014.03.06
			
			아래 예외 처리한 태그들은 하위 요소를 mark 처리할 필요가 없는 태그들입니다.
			직접 드래그 선택후 처음 mark 할때에는 이상없으나 저장된 데이터를 restore 하는 과정에서 
			코드에 의해 선택하는 로직 실행중 잘못된 range로 인식하는 오류를 발생시키므로
			예외 처리합니다.
			
			선택상태로 표시하지 않아도 상관없는 태그들입니다.
			이 오류는 IE에서 save, restore과정에서 발생합니다.
			
			**************************************************/
			
			_isSelectExceptionTag: function(node){
                var $node = $(node);
				//  || $(node).is("textarea")
				if(
                    $node.is("meta") || $node.is("title")
                    || $node.is("style") || $node.is("script")
                    || $node.is("select") || $node.is("option")
                    || $node.is("input") || $node.is("textarea") || $node.is("iframe")
                    || $node.is("object") || $node.is("embed") || $node.is("audio") || $node.is("video")
                ){
					return true;
				}

                if(
                    $node.is("link") || $node.is("meta") || $node.is("base")
                    || $node.is("embed") || $node.is("param")
                    || $node.is("area") || $node.is("hr") || $node.is("keygen")
                    || $node.is("col") || $node.is("source") || $node.is("img")
                    || $node.is("command")
                ){
                    return true;
                }

                /*
                BUG FIXED : 2014.03.07
                // 리스트 항목에는 text노드가 있으면 안된는 곳이 있다.
                // 이곳에 node가 존재하면 에러를 발생한다.
                // 강제로 텍스트가 입력된 곳이면 어쩔수 없지만 대부분 trim으로 해결이 된다.
                // 예 : <td></td>이곳<td></td>
                // 예 : <li></li>이곳<li></li> 등등
                */
				
				
				// Null Node
				// this._isEmptyTag 메서드가 좀더 세밀하게 조사함 (여기에는 맞지 않음)
				
				if($(node).text().trim() == ""){
					out("node : ", node);
					out("node parentNode : ", node.parentNode);
					return true;
				}
				
				return false;
			},
			
			////////////////////////////////////////////
			//
			// Mark 태그 적용
			//
			////////////////////////////////////////////
			
			// start Anchor 노드 처리
			_replaceStartNode: function(node){
				//out("* START NODE : ", node);
				// 임시로 설치한 start anchor 노드 제거
				$(node).remove();
			},

			// end Anchor 노드 처리
			_replaceEndNode: function(node){
				//out("* END NODE : ", node);
				// 임시로 설치한 end anchor 노드 제거
				$(node).remove();
			},

			// start Anchor 노드 처리
			_replaceMiddleNode: function(node, anchorID){
				// Highlight 감싸기
				this._wrap(node, anchorID);
			},
			
			// node 주위를 Highlight(_MARK_TAG)태그로 감싸기
			_wrap: function(node, anchorID){
				if(node.nodeType === Node.ELEMENT_NODE){
					
					if(this.isMarkTag(node)){
						out("\t >ELEMENT(Mark Tag중첩) : ", node);
					}else{
						out("\t >ELEMENT : ", node);
					}
					
				}else if(node.nodeType === Node.TEXT_NODE){
					
					if(!this._isEmptyTag(node)){
						
						out("\t >TEXT(wrap) : ", $(node).text());
						
						var range = document.createRange();
			            range.selectNodeContents(node);
			            
			            // mark Tag 적용
						var markTag = this._createMarkNode(anchorID);
						range.surroundContents(markTag);
						
						this._addMarkEvent(markTag);
						
						//**********************************
						
						// 필터링 : mark 태그 중첩된 상태를 모두 splice한다.
						
						// 중첩된 상태 발생 원인 : 
						//  - 선택 영역이 서로 겹치는 경우
						//  - mark 태그를 포함하여 선택한 경우
						//  - mark 태그 내부에서 선택하는 경우
						
						var parentNode = markTag.parentNode;
						if(this.isMarkTag(parentNode)){
							
							out("\t >TEXT(중첩 splice) : ", $(node).text());
							this._spliceNode(markTag);
						}

						//**********************************
						
					}
					
				}else{
					out("\t >기타 요소 (nodeType:", node.nodeType, ") :", $(node).text());
				}
			},
			
			// _MARK_TAG 노드 생성
			_createMarkNode: function(anchorID){
				//var markTag = document.createElement(this._MARK_TAG);
				var $mark = $("<" + this._MARK_TAG + ">");
				this._addAnchorID($mark[0], anchorID);
				
				// 스타일 적용
				if(this.style) $mark.css(this.style);
				if(this.className) $mark.addClass(this.className);
				
				return $mark[0];
			},

			/*
			mark 태그 중첩된 상태를 모두 splice한다.
			(중첩된 mark 태그가 발생되지 않도록 텍스트 or mark 태그를 분할 적용한다)
			중첩 CASE : 겹쳐 선택하거나 mark 태그 내부 또는 mark 태그를 포함하여 선택한 경우임
			중첩된 상태 정보를 _ANCHOR_ID 를 통해 정리한다.
			
			// 주의 : clone 하여 다시 마킹하므로 이전에 참조했던 mark 태그 참조가 달라진다.
			// 이전 참조했던 mark 태그의 내용은 비어있게 된다.(remove 되므로)
			*/
			
			_spliceNode: function(markTag){
				var parentNode = markTag.parentNode;
				var $contents = $(parentNode).contents();
				var i = 0;
				var len = $contents.length;
				
				var old_IDs = this._getAnchorID(parentNode);
				var old_IDString = old_IDs.join();
				var newNode;
				while(i < len)
				{
					var node = $contents[i];
					
					if($(node).is("."+this._ANCHOR_CLASSNAME_START) || $(node).is("."+this._ANCHOR_CLASSNAME_END)){
						++i;
						continue;
					}
					// 그냥 이동
					if(this._isSelectExceptionTag(node) || this._isCloseExceptionTag(node)){
						$(parentNode).before(node);
						++i;
						continue;
					}
					
					if(this.isMarkTag(node)){
						// mark 그대로 이동
						$(parentNode).before(node);
						newNode = node;

					}else{
						// wrap 하여 이동
						var $cloneMarkTag = $(parentNode).clone().empty();
						$cloneMarkTag.append(node);
						$(parentNode).before($cloneMarkTag);

						newNode = $cloneMarkTag[0];
					}

					this._addMarkEvent(newNode);
					
					// anchorID 수정
					//this._cleanAnchorID($cloneMarkTag[0]);
					this._addAnchorID(newNode, old_IDString);
					
					++i;
				}
				$(parentNode).remove();
			},

			//-----------------------------
			// mark Node의 기능 추가
			//-----------------------------
			
			_addMarkEvent: function(mark){
				this._removeMarkEvent(mark);
				
				if(!mark) return;
				$(mark).on("mouseover", $.proxy(this._onMouseOver_mark, this));
				$(mark).on("mouseout", $.proxy(this._onMouseOut_mark, this));
				$(mark).on("click", $.proxy(this._onClick_mark, this));
			},
			
			_removeMarkEvent: function(mark){
				if(!mark) return;
				$(mark).off("mouseover", $.proxy(this._onMouseOver_mark, this));
				$(mark).off("mouseout", $.proxy(this._onMouseOut_mark, this));
				$(mark).off("click", $.proxy(this._onClick_mark, this));
			},

			_onMouseOver_mark: function (e){
				var mark = e.target;
				var anchorID = this._getAnchorID(mark, true);
				
				// 이벤트 콜백
				if(this.onMouseOver) this.onMouseOver.apply(this, [anchorID, mark]);
				
				/*
				// 현재 선택 하이라이트만 표시
				var $mark = (this._splitView) ? $(mark) : this.getMarkTags(anchorID);
				$mark.css({"background-color":"yellow"});
				*/
			},
			
			_onMouseOut_mark: function (e){
				var mark = e.target;
				var anchorID = this._getAnchorID(mark, true);
				
				// 이벤트 콜백
				if(this.onMouseOut) this.onMouseOut.apply(this, [anchorID, mark]);
				
				/*
				var $mark = (this._splitView) ? $(mark) : this.getMarkTags(anchorID);
				//$mark.removeAttr("style");
				$mark.css({"background-color":"green"});
				*/
			},
			
			_onClick_mark: function (e){
				var mark = e.target;
				var anchorID = this._getAnchorID(mark, true);
				
				// 이벤트 콜백
				if(this.onClick) this.onClick.apply(this, [anchorID, mark]);
				
				/*
				var $mark = (this._splitView) ? $(mark) : this.getMarkTags(anchorID);
				out("* anchorID : ", anchorID, " : ", mark);
				//this.remove(anchorID);
				*/
			},
			
			////////////////////////////////////////////
			// Mark 태그 Normalize (보정)
			////////////////////////////////////////////
			
			//-----------------------------
			// 분할된 영역을 검사하여 불필요한 태그 통합, 제거
			//-----------------------------
			
			// mark 태그 목록을 반환 (anchorID가 없으면 전체 목록을 반환)
			getMarkTags: function(anchorID){
				
				var $mark = $(this._MARK_TAG).filter("[" + this._ANCHOR_ID + "]");
				if(anchorID == undefined){
					return $mark;
				}
				
				var self = this;
				var $filterMark = $mark.filter(function(){
					//var IDs = self._getAnchorID(this);
					return self._hasAnchorID(this, anchorID);
				});
				
				return $filterMark;
			},

			// 해당 노드가 생성된 mark 태그인지를 판별
			isMarkTag: function(node){
				var $node = $(node);
				if($node.is(this._MARK_TAG) && this._getAnchorID(node, true) != null){
					return true;
				}
				return false;
			},
			
			// 비어있는 Tag 인지 조사
			_isEmptyTag: function(node){
				if(node.nodeType == Node.TEXT_NODE){
					return (node.length == 0);
				}
				var $content = $(node).contents();
				return ($content.length == 0 || $content[0].nodeType == Node.TEXT_NODE && $content[0].length == 0);
			},
			
			_normalizeAnchorRange: function(){
				
				var $mark = this.getMarkTags();
				//out("$mark", $mark);

				// markTag를 순환하면서 다음을 실행한다.
				// markTag가 수정되는 경우 anchorID 변경에 주의한다.
				var i = $mark.length;
				while(--i >= 0){
					var node = $mark[i];
					//var $node = $(node);
					//out(i, " : ", node);

					//var $content = $node.contents();
					
					// 보정 1. : 비어있는 _MARK_TAG 태그는 삭제한다.
					//if(!$node.text().trim()){
					if(this._isEmptyTag(node)){
						out("\t* 보정 (empty): ", node);
						$(node).remove();
						continue;
					}
					
					/*
					// 보정 2. : childNode에 _MARK_TAG를 가지고 있는 경우
					// (_MARK_TAG를 포함한 영역을 드래그하여 더 넓은 영역을 마킹하는 경우)
					
					이경우 mark 태그를 mark로 다시 감싸는게 아니라 
					기존 mark 태그를 유지한채 쪼개서 감싸게된다
						예)[텍스트]<mark>[mark내용]</mark>[텍스트2]
						--> [텍스<mark>트]</mark>[mark내용]<mark>[텍</mark>스트2]
					
					
					// 보정 3. : parentNode가 _MARK_TAG 태그이면 합친다.
					// (이미 마킹된 영역의 일부를 드래그하여 다시 마킹하는 경우)
					
					// 생성 과정에서 이미 필터링 되었음
					var parentNode = node.parentNode;
					if(this.isMarkTag(parentNode)){
						out("\t* 보정 (unwrap): ", parentNode[this._ANCHOR_ID]);
						// parentNode의 anchorID를 자동 승계함
						$($node.contents()[0]).unwrap();
						//$(node).remove();
						continue;
					}
					
					
					// 보정 4. : previousSibling이 같은 _MARK_TAG 태그이면 합친다.
						//merge하면 anchor_id에 대한 영역 구분이 되지 않기 때문에
						//같은 level의 mark 태그끼리의 merge는 하지 않는다.
					
					if(this._useMergedTag)
					{
						// 주의 : allowElementNode = true 옵션으로 하면 <br>태그가 잘못 인식됨
						this._normalize(node.parentNode);
						var validePrev = this._getPrevNode(node, false);
						
						if(validePrev && this.isMarkTag(validePrev)){
							out("\t* 보정 (merge): ", node.parentNode);
							// prev Node의 anchorID를 자동 승계함
							$(validePrev).append($node.contents());
							$(node).remove();
							continue;
						}
					}
					*/
					
					this._normalize(node.parentNode);
				}
				
				// 사용자 데이터 갱신
				this._refreshCustomData();
			},
			
			/*
			_mergePrev: function(node){
				this._normalize(node.parentNode);
				var prev = this._getPrevNode(node, true);
				if(this.isMarkTag(prev) == false){
					return;
				}
				
				// merge
				var textNode = $(node).contents();
				$(prev).append(textNode);
				
				// anchor_id 추가
			},
			*/
			
			/**************************************************
			BUG FIXED : 2014.03.05
			
			주로  닫힘 태그 사용하지 않아도 되는 태그들을 걸러냄
			이런 태그들은 역 변환시 merge 오류를 낼 수 있음
			(예시에서 []표시는 선택 처음 및 끝지점을 임시로 표시)
			
			오류 예시 : 테스[트1 <br> 테스]트2 <-->  테스트1 테스 <br> 트2
			오류 예시 : 테스[트1 <input~> 테스]트2 <-->  테스 <input~> 트1 테스트2
			
			일단 2개의 태그만 등록함 : br, input
			
			**************************************************/
			
			_isCloseExceptionTag: function(node){
                var $node = $(node);
				if(
                    $node.is("br") || $node.is("hr") || $node.is("link") || $node.is("area")
                    || $node.is("base") || $node.is("meta") || $node.is("param") || $node.is("col")
                    || $node.is("source") || $node.is("embed") || $node.is("command")
                    || $node.is("input") || $node.is("keygen")
                ){
					return true;
				}
                return false;
			},
			
			_getPrevNode: function(textNode, allowElementNode){
				//this._normalize(textNode.parentNode);
				var validePrev;
				var prev = textNode.previousSibling;
				while(prev)
				{
					// 예외 : 역 변환시 merge 오류 해결
					if(this._isCloseExceptionTag(prev)){
						validePrev = prev;
						break;
					}
					if(!allowElementNode){
						if(prev.nodeType == Node.ELEMENT_NODE){break;}
					}
					var text = $(prev).text();
					if(text != ""){
						//out("prev text : ", text);
						validePrev = prev;
						break;
					}
					prev = prev.previousSibling;
				}
				return validePrev;
			},

			_getNextNode: function(textNode, allowElementNode){
				//this._normalize(textNode.parentNode);
				var valideNext;
				var next = textNode.nextSibling;
				while(next)
				{
					// 예외처리 : 역 변환시 merge 오류 해결
					if(this._isCloseExceptionTag(next)){
						valideNext = next;
						break;
					}
					if(!allowElementNode){
						if(next.nodeType == Node.ELEMENT_NODE){break;}
					}
					var text = $(next).text();
					if(text != ""){
						//out("next text : ", text);
						valideNext = next;
						break;
					}
					next = next.nextSibling;
				}
				return valideNext;
			},
			
			////////////////////////////////////////////
			//
			// SAVE
			//
			////////////////////////////////////////////
			
			save : function(){
				out("\n# save\n");
				
				// 전체 데이터를 형성한다.
				var data = this._getCustomData();

				// 원본 상태로 되돌린 후 선택 range 데이터를 얻는다.
				var rangeArray = this._getMarkData();
				
				var saveData = {
						// 사용자가 전달한 데이터
						custom : data,
						// 선택 영역 리스트 데이터
						ranges : rangeArray
				};
				
				try{
					// JSON 데이터 반환
					var jsonString = JSON.stringify(saveData, null, "\t");
					//out("* JSON : \n", jsonString);
				}catch(error){
					var msg = "데이터 처리중 에러발생 : " + error;
					alert(msg);
					return;
				}
				
				out(jsonString);
				
				// 원본 상태에서 선택 상태로 되돌린다.
				this.restore(saveData);
				
				return jsonString;
			},
			
			////////////////////////////////////////////
			// Get Data
			////////////////////////////////////////////

			/*
			// 주의 : 아래 방법은 parentNode와 겹치는 부분이 없도록 보정작업을 거친경우 일때를 가정함 
			
			1. mark 태그를 좌상단으로부터 순차적으로 unwrap하면서 selection range 정보를 저장한다.
			2. 데이터 저장을 완료한다. (mark 태그가 모두 사라진 상태임)
			3. 저장된 데이터를 기반으로 mark 태그를 다시 restore 한다.
			4.선택 영역이 변경되지 않았는지 확인한다.
			*/
			
			_getMarkData: function(){
				
				var $markList = this.getMarkTags();
				var rangeArray = [];
				
				// DOM 맨앞에서 순차적으로 실행
				var len = $markList.length;
				for(var i=0; i<len; ++i)
				{
					var mark = $markList[i];
					var IDs = this._getAnchorID(mark);
					//out(i, " : ", mark);

					//----------------
					// unwrap
					//----------------
					
					var content = this._unwrap(mark);
					
					//----------------
					// range 설정
					//----------------
					
					var selection = this._getSelection();
					selection.removeAllRanges();
					
					// range 설정
					var range = document.createRange();
					range.selectNodeContents(content);
					selection.addRange(range);

					// 주의 : normalize를 실행하면 위 validePrev는 mark 컨텐츠와 합쳐진 값으로 node가 갱신된다.
					// text 노드에서 text노드를 분리해서 사용할 수 없으므로 가장 나중에 실행한다
					// (valideNext는 그대로 유지됨)

					var parent = content.parentNode;
					this._normalize(parent);
					
					var startContainer = range.startContainer;
					var endContainer = range.endContainer;
					var startOffset = range.startOffset;
					var endOffset = range.endOffset;
					
					/*************************************
					
					// 보정 IE 10
					var start = 0;
					var end = content.length;
					var prev = this._getPrevNode(content, false);
					if(prev && prev.nodeType == Node.TEXT_NODE){
						start += prev.length;
						end += prev.length;
						out("prev : ", start, "~", end, prev.data);
					}
					
					startContainer = range.endContainer;
					startOffset = start;
					endOffset = end;
					
					//*************************************/
					
					//----------------
					// range 저장 데이터 생성
					//----------------
					
					var rangeObj = {
							anchorID : IDs.join(),
							startContainer : this._dom2xpath(startContainer),
							startOffset : startOffset,
							endContainer : this._dom2xpath(endContainer),
							endOffset : endOffset
						};
					
					//out("range : ", rangeObj);
					rangeArray.push(rangeObj);

				}
				
				return rangeArray;
			},

			_unwrap: function (mark){
				out("\n- unwrap");
				
				var $content = $(mark).contents();
				
				this._normalize(mark.parentNode);
				var validePrev = this._getPrevNode(mark, true);//node.previousSibling;
				var valideNext = this._getNextNode(mark, true);//node.nextSibling;
				
				//out("\t*validePrev : ", this.isMarkTag(validePrev)?"<MARK>":validePrev);
				//out("\t*node : ", $($content[0]).text());
				//out("\t*valideNext : ", this.isMarkTag(valideNext)?"<MARK>":valideNext);
				
				// mark 노드 이벤트 제거
				this._removeMarkEvent(mark);
				
				if(validePrev)
				{
					if(validePrev.nodeType == Node.ELEMENT_NODE){
						out("\t\t case 1 : validePrev 1-1. <p> <span/> [<mark/>] <span/> </p>");
						out("\t\t case 1 : validePrev 1-2. <p> <span/> [<mark/>] </p>");
						$(validePrev).after($content);
						$(mark).remove();
					}else{
						out("\t\t case 1 : validePrev 1-3. : <p> text [<mark/>] </p>");
						out("\t\t case 1 : validePrev 1-4. : <p> text [<mark/>] text </p>");
						$(validePrev).after($content);
						$(mark).remove();
					}					
				}
				else if (valideNext)
				{
					if(valideNext.nodeType == Node.ELEMENT_NODE){
						out("\t\t case 2 : valideNext 2-1. <p> [<mark/>] <span/> </p>");
						$(valideNext).before($content);
						$(mark).remove();
					}else{
						out("\t\t case 2 : valideNext 2-2. : <p> [<mark/>] text </p>");
						$(valideNext).before($content);
						$(mark).remove();
					}
				}
				else
				{
					out("\t\t case 3 : no sibling : <p> [<mark/>] </p>");
					
					// append()는 <p> [<mark/>] <br> [<mark/>] </p> 의 경우
					// <p> <br> mark mark </p> 의 결과를 낳는다. (뒤에 붙이므로)
					//$(mark.parentNode).append($content);
					
					// html()는 다른 Node와 함께 사용되고 있는 경우 다른 노드가 제거되어 버림
					// <p> <br> [<mark/>] <br> </p> 의 경우
					//$(mark.parentNode).html($content);
					
					$($content[0]).unwrap();
				}
				
				var content = $content[0];
				return content;
			},

			////////////////////////////////////////////
			//
			// REMOVE
			//
			////////////////////////////////////////////

			remove : function(anchorID){
				out("\n# remove : ", anchorID, "\n");
				if(!anchorID) return;
				
				// 사용자 데이터 지우기
				this._removeCustomData(anchorID);
				this._removeExecute(anchorID);
			},
			
			// removeGroup : anchorID에 기록된 모든 node를 지움 (true)
			removeNode:function(markNode, removeGroup){
				if(!markNode) return;
				if(!this.isMarkTag(markNode)) return;
				
				if(!removeGroup){
					// 대표 node만 지움
					var anchorID = this._getAnchorID(markNode, true);
					this.remove(anchorID);
					return;
				}
				
				// 모든 node를 지움
				var IDs = this._getAnchorID(markNode);
				if(IDs.length < 1) return;
				
				for(var i in IDs){
					var anchorID = IDs[i];
					this.remove(anchorID);
				}
			},
			
			// anchorID==undefined 인 경우 모두 지우기임
			_removeExecute : function(anchorID){
				var isRemoveAll = anchorID? false:true;
				
				// 선택영역 Mark 표시 지우기
				var $markList = this.getMarkTags(anchorID);
				
				// DOM 맨앞에서 순차적으로 실행
				var len = $markList.length;
				for(var i=0; i<len; ++i)
				{
					var mark = $markList[i];
					//out(i, " : ", mark);

					if(!isRemoveAll){
						var IDs = this._getAnchorID(mark);
						if(IDs.length > 1){
							// 아이디만 제거
							this._removeAnchorID(mark, anchorID);
							continue;
						}
					}
					
					//----------------
					// unwrap
					//----------------
					
					var content = this._unwrap(mark);
					var parent = content.parentNode;
					//out("content : ", content);
					//out("parentNode : ", parent);
					
					// 주의 : normalize를 실행하면 위 validePrev는 mark 컨텐츠와 합쳐진 값으로 node가 갱신된다.
					// text 노드에서 text노드를 분리해서 사용할 수 없으므로 가장 나중에 실행한다
					// (valideNext는 그대로 유지됨)
					this._normalize(parent);
				}

				// 사용자 데이터 갱신
				this._refreshCustomData();
			},
			
			removeAll: function(){
				// 사용자 데이터 지우기
				this._removeCustomData();
				this._removeExecute();
			},
			
			////////////////////////////////////////////
			//
			// RESTORE
			//
			////////////////////////////////////////////
			
			/*
			// 데이터를 파싱하여 선택 영역을 화면에 표시하는 절차는 다음과 같다.
			
			1. 데이터를 파싱하여 같은 아이디로 된 range에 대하여 뒤에서 부터 순차적으로 순환한다.
			2. 데이터에 따라 selection range를 적용한뒤 선택영역을 Mark 표시한다.
			   이때 데이터는 이미 text node로 쪼개져있는 상태이므로 add 과정을 생략하고 바료 mark 태그를 적용한다.
			   
			// 주의 : anchor_id 순이 아닌 DOM 정렬의 역순으로 mark 표시를 실행해야함
			// (앞에서 부터 하면 mark 태그에 의해 DOM 구조가 변경되어 selection range 데이터와 맞지 않게 되므로)
			*/
			
			restore : function(saveData){
				out("\n# restore\n");

				var $markList = this.getMarkTags();
				if($markList.length > 0){
					//alert("페이지를 초기화(removeAll) 한 후 실행하세요.");
					this.removeAll();
				}
				
				if(!saveData) return;
				
				if(typeof saveData == "string"){
					try{
						// JSON 데이터 처리
						saveData = JSON.parse(saveData);
					}catch(error){
						var msg = "데이터 파싱중 에러발생 : " + error;
						alert(msg);
						return;
					}
				}
				
				/*
				var saveData = {
						// 사용자가 전달한 데이터
						custom : data,
						// 선택 영역 리스트 데이터
						ranges : rangeArray
				};
				*/
				
				var custom = saveData.custom || {};
				var rangeArray = saveData.ranges;
				if(!rangeArray) return;
				
				var selection = this._getSelection();
				selection.removeAllRanges();
				
				// 같은 아이디로 된 range에 대하여 뒤에서 부터 순차적으로 표시
				var cnt = rangeArray.length;
				while(--cnt >= 0)
				{
					var obj = rangeArray[cnt];
					var IDString = obj.anchorID;
					//var IDs = IDString.split(",");
					//out(IDString, ":", obj);
					
					// Selection
					var startContainer = this._xpath2dom(obj.startContainer);
					var endContainer = this._xpath2dom(obj.endContainer);
					//out("startContainer : ", obj.startOffset, " : ", obj.startContainer, startContainer);
					//out("endContainer : ", obj.endOffset, " : ", obj.endContainer, endContainer);

					selection.removeAllRanges();
					var range = document.createRange();
					range.setStart(startContainer, Number(obj.startOffset));
					range.setEnd(endContainer, Number(obj.endOffset));
					selection.addRange(range);
					
					// 선택영역 Mark 표시
					var markTag = this._createMarkNode(IDString);
					range.surroundContents(markTag);
					
					this._addMarkEvent(markTag);
					
					//out("-------------------------", "처리 종료");
				}
				
				// 사용자 데이터 일괄 저장
				for(var anchorID in custom){
					var dataObj = custom[anchorID];
					this._addCustomData(anchorID, dataObj);
				}

				// 선택 제거 (FF에서는 선택상태가 남아있다.)
				selection.removeAllRanges();
			},

			////////////////////////////////////////////
			//
			// XPath
			//
			////////////////////////////////////////////
			
			/*********************************************
			
			* 
			* [ XPath 브라우져 사용 제약 ]
			* evaluate 메서드 : IE 지원 안됨
			* 레퍼런스 : http://help.dottoro.com/ljruhkuj.php
			*           http://www.w3.org/TR/xpath/#location-paths
			*           https://developer.mozilla.org/ko/docs/Introduction_to_using_XPath_in_JavaScript
			* 시그니쳐 : object.evaluate (xpathExpression, contextNode, namespaceResolver, resultType, result);
			* 
			* [ 라이브러리 이용 ]
			* DOM 경로 --> XPath 경로 얻기 (IE호환 XPath 라이브러리 사용)
			* http://coderepos.org/share/wiki/JavaScript-XPath
			* https://code.google.com/p/wicked-good-xpath/
			* 
			* [ 참고 ]
			* http://nchc.dl.sourceforge.net/project/js-xpath/js-xpath/1.0.0/xpath.js
			* http://sourceforge.net/projects/js-xpath/
			* 
			
			//*********************************************/
			
			/*
			// DOM --> XPath
			
			// XHTML을 지원하도록 NameSpace 추가하여 아래 재 정의함
			// bug : IE 10에서 range 데이터 반환시 text선택 영역이 아닌 태그로 리턴되는 현상이 있음
			
			_makeXPath : function  (node, currentPath) {
				currentPath = currentPath || '';
				if(!node) return currentPath;
				
				var xpathExpression, contextNode, namespaceResolver, resultType, result;
				//var type = 7;
				
				switch (node.nodeType) {
					case 3:
					case 4: {
						
						xpathExpression = 'preceding-sibling::text()';
						contextNode = node;
						namespaceResolver = this._resolver;
						resultType = XPathResult.ORDERED_NODE_SNAPSHOT_TYPE;
						result = null;
						
						var nodesSnapshot = document.evaluate(xpathExpression, contextNode, namespaceResolver, resultType, result);
						var length = nodesSnapshot.snapshotLength + 1;
						
						var path = '/text()[' + length + ']';
						return this._makeXPath(node.parentNode, path);
					}
					case 1: {
						
						var nodeName = node.nodeName;
						if(this.namespace) nodeName = this.namespace + ":" + nodeName;
						
						xpathExpression = 'preceding-sibling::' + nodeName;
						contextNode = node;
						namespaceResolver = this._resolver;
						resultType = XPathResult.ORDERED_NODE_SNAPSHOT_TYPE;
						result = null;
						
						var nodesSnapshot = document.evaluate(xpathExpression, contextNode, namespaceResolver, resultType, result);
						var length = nodesSnapshot.snapshotLength + 1;
						
						var path = '/' + nodeName + '[' + length + ']' + currentPath;
						return this._makeXPath(node.parentNode, path);
					}
					case 9:
						return currentPath;
					default:
						return '';
				}
			},
			
			// NS 리턴
			_resolver: function (prefix){
				var ns = {
					'xhtml' : 'http://www.w3.org/1999/xhtml'
				};
				return ns[prefix] || null;
			},
			
			// XPath --> DOM
			_resolveXPath: function(xpath){
				var type = XPathResult.FIRST_ORDERED_NODE_TYPE;
				//var type = 9;
				var obj = document.evaluate(xpath, document, this._resolver, type, null);
				var node = obj.singleNodeValue;
				return node;
			},
			*/

			/*********************************************
			
			// 2014.03.09
			// 위에서 사용한 XPath 라이브러리는 xhtml에서 사용할때 IE지원이 되지 않으므로
			// XPath 기능을 제약적으로 구현하여 사용하기로 한다. (XPath 라이브러리 사용안함)
			// 이 코드는 xhtml NS를 따로 구별할 필요가 없다
			
			/*********************************************/

			// DOM --> XPath
			_dom2xpath : function (node, currentPath){
				currentPath = currentPath || '';
				
				if(!node){
					return currentPath;
				}
				
				switch (node.nodeType) {
					case 3:
					case 4: {
						
						var index = this._getSiblingIndex(node);
						var path = '/text()[' + index + ']';
						return this._dom2xpath(node.parentNode, path);
					}
					case 1: {
						
						var nodeName = node.nodeName.toUpperCase();
						
						// xhtml NS를 추가하는 경우
						// 현재 XPath를 직접 정의하여 사용하므로 NS 설정은 필요없음
						//if(this.namespace) nodeName = this.namespace + ":" + nodeName;
						
						var index = this._getSiblingIndex(node);
						var path = '/' + nodeName + '[' + index + ']' + currentPath;
						return this._dom2xpath(node.parentNode, path);
					}
					case 9:
						return currentPath;
					default:
						return '';
				}
			},
			
			_getSiblingIndex: function (node){
				var nodeName = node.nodeName;
				var nodeType = node.nodeType;
				//out("nodeName : ", nodeName, nodeType, node);
				
				var count = 0;
				var prev = node;
				while(prev){
					// xHtml 에서는 nodeType까지 체크할것
					if(prev.nodeName == nodeName && prev.nodeType == nodeType){
						count++;
					}
					prev = prev.previousSibling;
				}
				return count;
			},
			
			
			_xpath2dom : function (xpath){
				xpath = xpath.toLowerCase();
				out("* 파싱 : ", xpath);
				
				var ar = xpath.split("/");
				ar.shift();
				
				// selector 형식 작성
				// /HTML[1]/BODY[1]/DIV[3]/DIV[2]/H4[2]/text()[2] 의 경우 아래 selector로 접근 가능함
				// $("html:eq(0) > body:eq(0) > div:eq(2) > div:eq(1) > h4:eq(1)").contents()[1]
				
				var selector = "";
				var len = ar.length;
				var lastTag = document;
				
				for(var i=0; i<len; ++i){
					var infoString = ar[i];
					
					// 태그
					var tag_pattern = /\w+[\(\)]*?(?=\[)/;
					var tag = tag_pattern.exec(infoString)[0];
					
					// index
					
					var num_pattern = /\d+?(?=\])/;
					var index = num_pattern.exec(infoString)[0] - 1;
					
					//out(infoString, "-->", tag, "[", index, "]");
					
					if(tag == "text()"){
						// TEXT_NODE
						out("selector:", selector);
						//lastTag = $(selector)[0].childNodes[index];
						
						lastTag = $(selector).contents().filter(function(){
							//out(this.nodeName, tag, this.tagName);
							return this.nodeName.toLowerCase() == "#text";
						}).get(index);
						
					}else{
						// ELEMENT_NODE
						if(selector) selector += ">";
						selector += tag + ":eq(" + index + ")";
						
						if(i == len-1){
							lastTag = $(selector)[0];
						}
					}
					
				}
				
				return lastTag;
			},
			
			/*
			// 테스트 샘플 노드 만들기
			var $div = $('<div>').attr('id', "xpath");
			$div.css('margin-left', '50px');
			$("div:eq(0)").before($div);
			$div.text("테스트1<br>테스트2");
			var tagTest = $div.contents();
			*/

			////////////////////////////////////////////
			//
			// normalize
			//
			////////////////////////////////////////////
			
			//*************************************************************************
			// BUG : (IE11 Versions: 11.0.3)
			// normalize IE 이슈 : IE에서 정상작동하지 않아 save data에서 DOM 위치값이 달라짐
			// http://connect.microsoft.com/IE/feedback/details/809424/node-normalize-removes-text-if-dashes-are-present
			
			// I can see the problem both with trying with the simple script provided here, 
			// and with a more complex script that adds highlighting to the contents of a 
			// html page, and then, when the highlighting is removed and 
			// document.body.normalize() is called, some parts of the element disappear 
			// - this happens often if the text was enclosed with the non-Ascii 
			// quote characters: “ and ” or 숫자
			
			// normalize 참고 : http://stackoverflow.com/questions/2023255/node-normalize-crashes-in-ie6
			
			// Fixed : 2014.03.04
			// 텍스트 노드를 추가, 삭제, 이동한 후 normalize 하는 과정에서 IE와 Chrome 브라우져간 실행 결과가 달라
			// 생성되는 데이터를 서로 호환할 수 없는 문제가 발생하였다.
			// _normalizeTest 메서드에 사용한 예처럼 Node 중간에 숫자 또는 특수문자등의 문자열로 
			// 끝나는 경우 normalize가 정상적으로 이루어지지 않고 문자가 삭제되는 현상이 발견되었다.(IE 11)
			// 따라서 이런 증상이 있는 브라우져에서는 normalize를 별도로 구현하여 사용한다.
			
			//*************************************************************************

			_normalizeTest: function(){
				var tag = '<div id="test1">테스트1<br/>테스트2</div>';
				var $parent = $(tag).appendTo(document.body);
				var $contents = $parent.contents();
				var first = $contents[0];
				var second = $contents[2];
				
				$(first).after(second);
				$parent[0].normalize();
				
				//out($parent.text() === "테스트1테스트2");
				// IE에서 한글이 생략되고 "12"만 출력되는 경우가 있다. (IE11 Versions: 11.0.3)
				var canNormalize = ($parent.text() === "테스트1테스트2");
				
				$parent.remove();
				return canNormalize;
			},
			
			_normalize: function (node) {
				
				/*
				if(this._canNormalize){
					// Chrome에서 먹히는 코드
					node.normalize();
					return;
				}
				*/
				
				/***********************************
				// BUG : 2012.03.09
				
				* Normalize 는 Xpath의 결과에도 영향을 미친다.
				현재 IE 10, IE 11에는 normalize 함수를 지원하지만 동작 결과가 다른 브라우져와 달라
				XPath의 결과로 restroe 시 selection에 실패하게되는 현상이 있다.
				따라서 문제가 생기는 IE 계열 브라우저는 로직을 직접 구현한다.
				
				* Chrome 및 FF에서는 직접 구현된 코드가 오히려 똑같은 문제를 발생시키므로
				기존 normalize 함수를 그대로 사용한다.
				
				/***********************************/
				
				var browser = navigator.appName;
				//var b_version = navigator.appVersion;
				//var version = parseFloat(b_version);
				
				if(browser == "Microsoft Internet Explorer" || !this._canNormalize)
				{
					// IE 10, 11 에서 먹히는 코드
				    var child = node.firstChild;
				    var nextChild;
				    while (child) {
				        if (child.nodeType == Node.TEXT_NODE) {
				            while ((nextChild = child.nextSibling) && nextChild.nodeType == Node.TEXT_NODE) {
				                child.appendData(nextChild.data);
				                node.removeChild(nextChild);
				            }
				        } else {
				            this._normalize(child);
				        }
				        child = child.nextSibling;
				    }
				}else{
					// Chrome, FireFox 에서 먹히는 코드
					node.normalize();
				}
			}
			
			////////////////////////////////////////////
			// END
			////////////////////////////////////////////
			
	};
	
	window.H = H;
	
})($);

























