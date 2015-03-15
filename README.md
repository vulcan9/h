# H Library (JavaScript-Highlight)


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
	* 브라우져 지원 여부 : all browsers, except IE before version 9
	* 
	* 사용방법 : 별도 문서 (test.html)에 버튼 클릭 기능 구현부분 참고
	* 		var h = new H();
	* 		h.add() ...
	* 
# API 목록
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

# 참고 자료

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
		
# History
	
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
		- 버그수정 : IE 11 이상 브라우저 지원
	
