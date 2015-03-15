
	/*
	 * QUnit Test
	 * API : http://api.qunitjs.com/
	 * COOKBOOK : http://qunitjs.com/cookbook/
	 */

	QUnit.config.autostart = false;
	if(isTest) QUnit.start();
	
	// 화면 로그 출력
	function out(){
		console.log.apply(window.console, arguments);
	}
	
	$(function(){
		
		var h = new H({log:false});
		
		///////////////////////////////
		//
		// 테스트 자동화
		//
		///////////////////////////////
		
		var $container = $('#sampleContainer');
		var selection = window.getSelection();
		
		// 테스트에 사용될 DOM을 본문에 추가
		function getTestTag(tag, id, title){
			var $title = $('<h4>').text(testIDCounter + '. ' + title );
			$container.append($title);
			
			var $div = $('<div>').attr('id', id).append(tag);
			$div.css('margin-left', '50px');
			$container.append($div);
			
			var tagTest = $div.contents();
			return tagTest;
		}

		function addRange(range){
			selection.removeAllRanges();
			selection.addRange(range);
		}
		
		// node의 태그 이름 검사
		QUnit.assert.is = function( node, tag, message ) {
			//ok($($contents[1]).is('mark'), 'child[1] = <mark> 태그' );
			var isOK = $(node).is(tag);
			QUnit.push(isOK, node, tag, message);
		};
		
		// node의 text값 검사
		QUnit.assert.text = function( node, value, message ) {
			//equal($($contents[0]).text(), '테스', 'child[0] = text 노드' );
			var text = $(node).text();
			QUnit.push(text === value, text, value, message);
		};

		//////////////////////////////////////////
		// Highlight 변환 테스트 (wrap)
		//////////////////////////////////////////
		
		var testIDCounter = 0;
		function newTestID(){
			return 'test' + (++testIDCounter);
		}

		module( 'Highlight 변환 테스트 (wrap)' );

		test( '<mark> 태그 Wrap', function(assert){
			var testID = newTestID();
			var tag = 'mark 태그 Wrap 테스트';
			var $tagTest = getTestTag(tag, testID, '<mark> 태그 Wrap');
			ok(true, tag);
			
			var anchorID = h._newAnchorID();
			h._wrap($tagTest[0], anchorID);
			
			var $mark = $('#'+testID).find('mark');
			ok($mark.length == 1, '<mark> 태그 확인' );
			ok(h.isMarkTag($mark[0]), '<mark> 태그 확인' );
			
			// 원래대로==========================
			h.removeAll();
			
			//out($('#'+testID).text());
			assert.text($('#'+testID)[0], tag, '내용 그대로 유지됨' );
		});

		test( '<mark> 태그 원본 유지', function(assert){
			var testID = newTestID();
			var tag = '<mark>원본 mark 태그</mark>';
			var $tagTest = getTestTag(tag, testID, '원본 <mark> 태그 유지');
			ok(true, tag);
			
			// 원래대로==========================
			h.removeAll();
			
			//ok($tagTest.parent().html() == tag, 'mark 태그 그대로 유지됨' );
			
			// $tagTest.parent().html() 값은 xhtml에서
			// "<mark xmlns="http://www.w3.org/1999/xhtml">원본 mark 태그</mark>"
			// 와 같이 NS를 포함한 값으로 나타난다.
			
			var content = $tagTest.parent().contents()[0];
			ok(content.nodeType == Node.ELEMENT_NODE, 'mark 태그 그대로 유지됨' );
			ok($(content).is("mark"), 'mark 태그 그대로 유지됨' );
			ok($(content).text() == "원본 mark 태그", 'mark 태그 그대로 유지됨' );
			
		});

		test( '<mark> 태그 중첩 검사', function(assert){
			var testID = newTestID();
			var tag = "<mark anchor_id='original_id'>외부 mark 태그<br/>내부 MARK 태그 내용<br/>외부 mark 태그</mark>";
			var $tagTest = getTestTag(tag, testID, '<mark> 태그 중첩 검사');
			ok(true, tag);
			
			// 내부 MARK 태그 내용 선택
			var $contents = $tagTest.contents();
			var node = $contents[2];
			var range = document.createRange();
			range.selectNode(node);
			addRange(range);
			
			h.addNode(node);
			
			
			// 필터링된 결과로 외부 mark 태그와 splice 된 결과가 나와야함
			var $mark = $('#'+testID).find('mark');
			
			ok($mark.length == 3, '<mark> 태그 3개로 분리됨' );
			assert.text($mark[0], '외부 mark 태그', '분리된 original mark 태그' );
			assert.text($mark[1], '내부 MARK 태그 내용', '새로 추가된 mark 태그' );
			assert.text($mark[2], '외부 mark 태그', '분리된 original mark 태그' );
			
			// 원래대로==========================
			h.removeAll();
			
			var $testNode = $('#'+testID);
			var resultTag = '외부 mark 태그<br>내부 MARK 태그 내용<br>외부 mark 태그';
			//ok($testNode.html() == resultTag, '내용 그대로 유지됨' );
			
			// $tagTest.parent().html() 값은 xhtml에서
			// "<mark xmlns="http://www.w3.org/1999/xhtml">원본 mark 태그</mark>"
			// 와 같이 NS를 포함한 값으로 나타난다.
			
			var $content = $testNode.contents();
			ok($content[0].nodeType == Node.TEXT_NODE, 'mark 태그 그대로 유지됨' );
			ok($($content[0]).text() == "외부 mark 태그", 'mark 태그 그대로 유지됨' );
			
			ok($content[1].nodeType == Node.ELEMENT_NODE, 'mark 태그 그대로 유지됨' );
			ok($($content[1]).is("br"), 'mark 태그 그대로 유지됨' );
			
			ok($content[2].nodeType == Node.TEXT_NODE, 'mark 태그 그대로 유지됨' );
			ok($($content[2]).text() == "내부 MARK 태그 내용", 'mark 태그 그대로 유지됨' );
			
			ok($content[3].nodeType == Node.ELEMENT_NODE, 'mark 태그 그대로 유지됨' );
			ok($($content[3]).is("br"), 'mark 태그 그대로 유지됨' );
			
			ok($content[4].nodeType == Node.TEXT_NODE, 'mark 태그 그대로 유지됨' );
			ok($($content[4]).text() == "외부 mark 태그", 'mark 태그 그대로 유지됨' );
			
		});

		test( 'Node를 전달하여 추가하기', function(assert){
			var testID = newTestID();
			var tag = '<span>addNode 메서드 테스트</span>';
			var $tagTest = getTestTag(tag, testID, '태그 Wrap');
			ok(true, tag);
			
			// Node를 추가
			h.addNode($tagTest[0]);
			
			//out('-->', $tagTest[0]);
			
			var $mark = $('#'+testID).find('mark');
			ok($mark.length == 1, '<mark> 태그 확인' );
			ok(h.isMarkTag($mark[0]), '<mark> 태그 확인' );
			
			// 원래대로==========================
			h.removeAll();

			var $contents = $container.find('#'+testID);
			if(h.xmlNS){
				var $span = $contents.contents();
				ok($span.is("span"), '내용 그대로 유지됨' );
				ok($span.text() == "addNode 메서드 테스트", '내용 그대로 유지됨' );
			}else{
				ok($contents.html() == tag, '내용 그대로 유지됨' );
			}
		});

		test( '비어있는 다른 태그 Wrap', function(assert){
			var testID = newTestID();
			var tag = '<span></span>';
			var $tagTest = getTestTag(tag, testID, '비어있는 다른 태그 Wrap');
			ok(true, tag);
			
			// Node를 추가
			h.addNode($tagTest[0]);

			var $mark = $('#'+testID).find('mark');
			ok($mark.length == 0, '<mark> 태그 생성 안됨' );
		});

		//////////////////////////////////////////
		// Highlight 역변환 테스트 (unwrap)
		//////////////////////////////////////////
		
		module( 'Highlight 역변환 테스트 (unwrap)' );

		// prev 노드가 있는 경우
		// Node.ELEMENT_NODE
		test( '[prev Node]가 있는 경우 1 - Node.ELEMENT_NODE', function(assert){
			
			//case 1
			//out('\t\t case 1 : validePrev 1-1. <p> <span/> [<mark/>] <span/> </p>');
			
			var testID = newTestID();
			var tag = '<p> <span>[Prev span Node]</span> [mark text 내용] <span>[Next span Node]</span> </p>';
			var $tagTest = getTestTag(tag, testID, 'prev 노드가 있는 경우 (Node.ELEMENT_NODE)');
			ok(true, tag);
			
			// Node를 추가
			var textNode = $tagTest.find('span')[0].nextSibling;
			h.addNode(textNode);
			
			var $mark = $('#'+testID).find('mark');
			ok($mark.length == 1, '<mark> 태그 생성' );
			
			//unwrap
			h.removeNode($mark[0]);
			$mark = $('#'+testID).find('mark');
			ok($mark.length == 0, '<mark> 태그 제거됨' );
		});

		// prev 노드가 있는 경우
		// Node.ELEMENT_NODE
		test( '[prev Node]가 있는 경우 2 - Node.ELEMENT_NODE', function(assert){

			//case 2
			//out('\t\t case 1 : validePrev 1-2. <p> <span/> [<mark/>] </p>');
			
			var testID = newTestID();
			var tag = '<p> <span>[Prev span Node]</span> [mark text 내용] </p>';
			var $tagTest = getTestTag(tag, testID, 'prev 노드가 있는 경우 (Node.ELEMENT_NODE)');
			ok(true, tag);
			
			// Node를 추가
			var textNode = $tagTest.find('span')[0].nextSibling;
			h.addNode(textNode);
			
			var $mark = $('#'+testID).find('mark');
			ok($mark.length == 1, '<mark> 태그 생성' );
			
			//unwrap
			h.removeNode($mark[0]);
			$mark = $('#'+testID).find('mark');
			ok($mark.length == 0, '<mark> 태그 제거됨' );
		});

		// prev 노드가 있는 경우
		// Node.TEXT_NODE
		test( '[prev Node]가 있는 경우 3 - Node.TEXT_NODE', function(assert){
			
			//case 3
			//out('\t\t case 1 : validePrev 1-4. : <p> text [<mark/>] text </p>');
			
			var testID = newTestID();
			var tag = '<p> [Prev Text Node]<br/>[mark text 내용]<br/>[Prev Next Node]</p>';
			var $tagTest = getTestTag(tag, testID, 'prev 노드가 있는 경우 (Node.TEXT_NODE)');
			ok(true, tag);
			
			// text Node를 분리
			$tagTest.find('br').remove();
			
			// Node를 추가
			var textNode = $tagTest.contents()[1];
			h.addNode(textNode);
			
			var $mark = $('#'+testID).find('mark');
			ok($mark.length == 1, '<mark> 태그 생성' );
			
			//unwrap
			h.removeNode($mark[0]);
			$mark = $('#'+testID).find('mark');
			ok($mark.length == 0, '<mark> 태그 제거됨' );
		});

		// prev 노드가 있는 경우
		// Node.TEXT_NODE
		test( '[prev Node]가 있는 경우 4 - Node.TEXT_NODE', function(assert){
			
			//case 4
			//out('\t\t case 1 : validePrev 1-3. : <p> text [<mark/>] </p>');
			
			var testID = newTestID();
			var tag = '<p> [Prev Text Node]<br/>[mark text 내용]</p>';
			var $tagTest = getTestTag(tag, testID, 'prev 노드가 있는 경우 (Node.TEXT_NODE)');
			ok(true, tag);
			
			// text Node를 분리
			$tagTest.find('br').remove();
			
			// Node를 추가
			var textNode = $tagTest.contents()[1];
			h.addNode(textNode);
			
			var $mark = $('#'+testID).find('mark');
			ok($mark.length == 1, '<mark> 태그 생성' );
			
			//unwrap
			h.removeNode($mark[0]);
			$mark = $('#'+testID).find('mark');
			ok($mark.length == 0, '<mark> 태그 제거됨' );
		});

		// next 노드가 있는 경우
		// Node.ELEMENT_NODE
		test( '[next Node]가 있는 경우 1 - Node.ELEMENT_NODE', function(assert){
			
			//case 1
			//out('\t\t case 2 : valideNext 2-1. <p> [<mark/>] <span/> </p>');
			
			var testID = newTestID();
			var tag = '<p> [mark text 내용]<span>[Next span Node]</span></p>';
			var $tagTest = getTestTag(tag, testID, 'next 노드가 있는 경우 (Node.ELEMENT_NODE)');
			ok(true, tag);
			
			// Node를 추가
			var textNode = $tagTest.find('span')[0].previousSibling;
			h.addNode(textNode);
			
			var $mark = $('#'+testID).find('mark');
			ok($mark.length == 1, '<mark> 태그 생성' );
			
			//unwrap
			h.removeNode($mark[0]);
			$mark = $('#'+testID).find('mark');
			ok($mark.length == 0, '<mark> 태그 제거됨' );
		});
		
		// next 노드가 있는 경우
		// Node.TEXT_NODE
		test( '[next Node]가 있는 경우 2 - Node.TEXT_NODE', function(assert){
			
			//case 2
			//out('\t\t case 2 : valideNext 2-2. : <p> [<mark/>] text </p>');
			
			var testID = newTestID();
			var tag = '<p> [mark text 내용]<br/>[Next Text Node]</p>';
			var $tagTest = getTestTag(tag, testID, 'next 노드가 있는 경우 (Node.TEXT_NODE)');
			ok(true, tag);
			
			// text Node를 분리
			$tagTest.find('br').remove();
			
			// Node를 추가
			var textNode = $tagTest.contents()[0];
			h.addNode(textNode);
			
			var $mark = $('#'+testID).find('mark');
			ok($mark.length == 1, '<mark> 태그 생성' );
			
			//unwrap
			h.removeNode($mark[0]);
			$mark = $('#'+testID).find('mark');
			ok($mark.length == 0, '<mark> 태그 제거됨' );
		});
		
		// prev, next 둘다 없는 경우
		test( '[prev, next Node] 둘다 없는 경우', function(assert){
			
			//case
			//out('\t\t case : no sibling : <p> [<mark/>] </p>');
			
			var testID = newTestID();
			var tag = '<p> [mark text 내용] </p>';
			var $tagTest = getTestTag(tag, testID, 'prev, next 둘다 없는 경우');
			ok(true, tag);
			
			// Node를 추가
			var textNode = $tagTest.contents()[0];
			h.addNode(textNode);
			
			var $mark = $('#'+testID).find('mark');
			ok($mark.length == 1, '<mark> 태그 생성' );
			
			//unwrap
			h.removeNode($mark[0]);
			$mark = $('#'+testID).find('mark');
			ok($mark.length == 0, '<mark> 태그 제거됨' );
		});
		
		//////////////////////////////////////////
		// 닫힘 태그가 필요없는 태그들에 대한 검사
		//////////////////////////////////////////

		module( '닫힘 태그가 필요없는 태그들에 대한 검사' );

		// Form 양식 대부분은 Chrome에서 잘 동작하나 IE에서 Error를 발생하므로 예외 처리한다.
		
		QUnit.assert.closeExceptionTag = function( inputTag, title ) {
			
			var testID = newTestID();
			var tag = '<p>[ 텍스트1 ][ ' + inputTag + ' ][ 텍스트2 ]</p>';
			var $tagTest = getTestTag(tag, testID, title);
			ok(true, tag);
			
			// Node를 추가
			var textNode = $tagTest[0];
			h.addNode(textNode);
			
			var $contents = $tagTest.children();
			//out('$tagTest', $contents);
			
			ok($($contents[0]).is('mark'), '[0] --> <mark> 태그' );
			ok($($contents[1]).is('input'), '[1] --> <input> 태그' );
			ok($($contents[2]).is('mark'), '[2] --> <mark> 태그' );
			
			// 저장 테스트
			h.save();
			
			//unwrap
			h.removeAll();
			$mark = $('#'+testID).find('mark');
			ok($mark.length == 0, '<mark> 태그 제거됨' );
			
			//QUnit.push(text === value, text, value, message);
		};

		test( "input type='button'", function(assert){
			if(h.xmlNS){
				var inputTag = "<input type='button' value='button type 테스트'/>";
			}else{
				var inputTag = "<input type='button' value='button type 테스트'>[input Tag Content]</input>";
			}
			
			var title = "Form 양식 예외처리 : input type='button'";
			assert.closeExceptionTag(inputTag, title);
		});

		test( "input type='checkbox'", function(assert){
			if(h.xmlNS){
				var inputTag = "<input type='checkbox' value='checkbox 태그 테스트'/>";
			}else{
				var inputTag = "<input type='checkbox' value='checkbox 태그 테스트'> checkbox</input>";
			}
			
			var title = "Form 양식 예외처리 : input type='checkbox'";
			assert.closeExceptionTag(inputTag, title);
		});

		test( "input type='file'", function(assert){
			var inputTag = "<input type='file' value='File Type 태그 테스트'/>";
			var title = "Form 양식 예외처리 : input type='file'";
			assert.closeExceptionTag(inputTag, title);
		});

		test( "input type='hidden'", function(assert){
			var inputTag = "<input type='hidden' value='hidden 태그 테스트'/>hidden 속성 태그";
			var title = "Form 양식 예외처리 : input type='hidden'";
			assert.closeExceptionTag(inputTag, title);
		});

		test( "input type='password'", function(assert){
			var inputTag = "<input type='password' value='password 테스트'/>";
			var title = "Form 양식 예외처리 : input type='password'";
			assert.closeExceptionTag(inputTag, title);
		});

		test( "input type='radio'", function(assert){
			if(h.xmlNS){
				var inputTag = "<input type='radio' value='radio 버튼 태그 테스트'/>radio label";
			}else{
				var inputTag = "<input type='radio' value='radio 버튼 태그 테스트'> radio label</input>";
			}
			
			var title = "Form 양식 예외처리 : input type='radio'";
			assert.closeExceptionTag(inputTag, title);
		});

		test( "input type='reset'", function(assert){
			var inputTag = "<input type='reset' value='reset 버튼 태그 테스트'/>";
			var title = "Form 양식 예외처리 : input type='reset'";
			assert.closeExceptionTag(inputTag, title);
		});

		test( "input type='submit'", function(assert){
			var inputTag = "<input type='submit' value='submit 버튼 태그 테스트'/>";
			var title = "Form 양식 예외처리 : input type='submit'";
			assert.closeExceptionTag(inputTag, title);
		});

		test( "input type='text'", function(assert){
			var inputTag = "<input type='text' value='text type 태그 테스트'/>";
			var title = "Form 양식 예외처리 : input type='text'";
			assert.closeExceptionTag(inputTag, title);
		});
		
		
		
		
		
		
		
		
		
		
/*
		module( '태그 분할 검사' );

		test( '<br/> 태그 예외 1', function(assert){
			var testID = newTestID();
			var tag = '[텍스트1] [텍스트2]<mark>[텍스트3] [텍스트4]</mark>';
			var $tagTest = getTestTag(tag, testID, '태그 분할 검사');
			ok(true, tag);
			
			var $content = $($tagTest[1]).contents();
			out('tagTest', $content[0]);
			
			var range = document.createRange();
			range.setStart($content[0], 0);
			range.setEnd($content[0], 6);
			addRange(range);
			range.content
//			
//			h._spliceNode();
			// Mark==========================
//			h.add(range);
//			
//			var result = $container.find('#'+testID+' mark').text();
//			equal( result, '트1테스', '테스[트1<br/>테스]트2 --> 트1테스' );
//			
//			var $contents = $container.find('#'+testID).contents();
//			//out('$contents : ', $contents);
//			
//			assert.text($contents[0], '테스', 'child[0] = text 노드' );
//			assert.is($contents[1], 'mark', 'child[1] = <mark> 태그' );
//			assert.is($contents[2], 'br', 'child[2] = <br/> 태그' );
//			assert.is($contents[3], 'mark', 'child[3] = <mark> 태그' );
//			assert.text($contents[4], '트2', 'child[4] = text 노드' );
//			
//			// 원래대로==========================
//			h.removeAll();
//
//			var $contents = $container.find('#'+testID).contents();
//			//out('$contents', $contents);
//			
//			assert.text($contents[0], '테스트1', 'child[0] = 테스트1' );
//			assert.is($contents[1], 'br', 'child[1] = <br/> 태그' );
//			assert.text($contents[2], '테스트2', 'child[2] = 테스트2' );
		});
		*/
		
		
		
		
		
		
		
		
		
		
		//----------------------
		// BR 태그 예외 처리 검사
		//----------------------
		
		module( 'BR 태그 예외 처리' );
		
		test( '<br/> 태그 예외 1', function(assert){
			var testID = newTestID();
			var tag = '테스트1<br/>테스트2';
			var $tagTest = getTestTag(tag, testID, '<br/> 태그 예외 처리 1');
			ok(true, tag);
			//out('tagTest', tagTest);
			
			var range = document.createRange();
			range.setStart($tagTest[0], 2);
			range.setEnd($tagTest[2], 2);
			addRange(range);
			
			// Mark==========================
			h.add();
			
			var result = $container.find('#'+testID+' mark').text();
			equal( result, '트1테스', '테스[트1<br/>테스]트2 --> 트1테스' );
			
			var $contents = $container.find('#'+testID).contents();
			//out('$contents : ', $contents);
			
			assert.text($contents[0], '테스', 'child[0] = text 노드' );
			assert.is($contents[1], 'mark', 'child[1] = <mark> 태그' );
			assert.is($contents[2], 'br', 'child[2] = <br/> 태그' );
			assert.is($contents[3], 'mark', 'child[3] = <mark> 태그' );
			assert.text($contents[4], '트2', 'child[4] = text 노드' );
			
			// 원래대로==========================
			h.removeAll();

			var $contents = $container.find('#'+testID).contents();
			//out('$contents', $contents);
			
			assert.text($contents[0], '테스트1', 'child[0] = 테스트1' );
			assert.is($contents[1], 'br', 'child[1] = <br/> 태그' );
			assert.text($contents[2], '테스트2', 'child[2] = 테스트2' );
		});

		test( '<br/> 태그 예외 2', function(assert){
			var testID = newTestID();
			var tag = '테스트1<br/>테스트2';
			var $tagTest = getTestTag(tag, testID, '<br/> 태그 예외 처리 2');
			ok(true, tag);
			//out('tagTest', tagTest);
			
			var range = document.createRange();
			range.setStart($tagTest[0], 0);
			range.setEnd($tagTest[2], $tagTest[2].length);
			addRange(range);

			// Mark==========================
			h.add(range);
			
			var result = $container.find('#'+testID+' mark').text();
			equal( result, '테스트1테스트2', '[테스트1<br/>테스트2] --> 테스트1테스트2' );
			
			var $contents = $container.find('#'+testID).contents();
			
			assert.is($contents[0], 'mark', 'child[0] = <mark> 태그' );
			assert.is($contents[1], 'br', 'child[1] = <br/> 태그' );
			assert.is($contents[2], 'mark', 'child[2] = <mark> 태그' );
			
			// 원래대로==========================
			h.removeAll();

			var $contents = $container.find('#'+testID).contents();
			//out('$contents : ', $contents);
			
			assert.text($contents[0], '테스트1', 'child[0] = 테스트1' );
			assert.is($contents[1], 'br', 'child[1] = <br/> 태그' );
			assert.text($contents[2], '테스트2', 'child[2] = 테스트2' );
		});

		//////////////////////////////////////////
		// 선택대상에서 제외되는 태그들에 대한 검사
		//////////////////////////////////////////

		module( '선택대상에서 제외되는 태그들에 대한 검사' );

		QUnit.assert.selectExceptionTag = function( inputTag, title ) {
			var testID = newTestID();
			var tag = '<p>[ 텍스트1 ][ ' + inputTag + ' ][ 텍스트2 ]</p>';
			var $tagTest = getTestTag(tag, testID, title);
			ok(true, tag);
			
			// Node를 추가
			var textNode = $tagTest[0];
			h.addNode(textNode);
			
			var $contents = $tagTest.contents();
			//out('$tagTest', $(inputTag)[0].nodeName);
			
			// 3개 생성 : mark <T> mark </T> mark
			var $mark = $tagTest.find('mark');
			ok($mark.length == 2, '<mark> 태그 생성 : <select>의 child는 mark 하지 않음' );
			
			var normalTag = $contents[1];
			var $childMark = $(normalTag).find('mark');
			ok($childMark.length == 0, '<mark> 태그 생성안함' );
			
			var nodeName = $(inputTag)[0].nodeName;
			ok($($contents[0]).is('mark'), '[0] --> <mark> 태그' );
			ok($($contents[1]).is(nodeName), '[1] --> <' + nodeName + '> 태그' );
			ok($($contents[2]).is('mark'), '[2] --> <mark> 태그' );

			// 저장 테스트
			h.save();
			
			//unwrap
			h.removeAll();
			$mark = $('#'+testID).find('mark');
			ok($mark.length == 0, '<mark> 태그 제거됨' );
		};

		//----------------------
		// select 태그 예외 처리
		//----------------------
		
		test( 'select', function(assert){
			var inputTag = ""+
				"<select>"+
					"<option value='' selected='selected'>&lt; All Modules &gt;</option>"+
					"<option value='option1'>BR 태그 예외 처리</option>"+
				"</select>";
				
			var title = '선택대상에서 제외되는 태그들에 대한 검사 : select';
			assert.selectExceptionTag(inputTag, title);
		});

		test( 'option', function(assert){
			var inputTag = "<option value='' selected='selected'>&lt; All Modules &gt;</option>";
				
			var title = '선택대상에서 제외되는 태그들에 대한 검사 : option';
			assert.selectExceptionTag(inputTag, title);
		});

        test( 'textarea', function(assert){
            var inputTag = '<textarea>textarea 태그 테스트</textarea>';
            var title = '선택대상에서 제외되는 태그들에 대한 검사 : textarea';
            assert.selectExceptionTag(inputTag, title);
        });

	    //////////////////////////////////////////
		// 일반 태그들에 대한 검사
		//////////////////////////////////////////

		module( '일반 태그들에 대한 검사' );

		QUnit.assert.normalTag = function( inputTag, title ) {
			
			var testID = newTestID();
			var tag = '<p>[ 텍스트1 ][ ' + inputTag + ' ][ 텍스트2 ]</p>';
			var $tagTest = getTestTag(tag, testID, title);
			ok(true, tag);
			
			// Node를 추가
			var textNode = $tagTest[0];
			h.addNode(textNode);
			
			// 3개 생성 : mark <T> mark </T> mark
			var $mark = $tagTest.find('mark');
			ok($mark.length == 3, '<mark> 태그 생성' );
			
			var nodeName = $(inputTag)[0].nodeName;
			var $normalTag = $tagTest.find(nodeName);
			var $childMark = $normalTag.find('mark');
			ok($childMark.length == 1, '<mark> 태그 생성' );

			var $contents = $($tagTest[0]).children();
			//out('$tagTest', $contents);
			
			//var $tag = $tagTest[0];
			ok($($contents[0]).is('mark'), '[0] --> <mark> 태그' );
			ok($normalTag.is(nodeName), '[1] --> <' + nodeName + '> 태그' );
			ok($($contents[2]).is('mark'), '[2] --> <mark> 태그' );

			// 저장 테스트
			h.save();
			
			//unwrap
			h.removeAll();
			$mark = $('#'+testID).find('mark');
			ok($mark.length == 0, '<mark> 태그 제거됨' );
		};
		
		test( 'button', function(assert){
			var inputTag = "<button value='버튼 태그 테스트'>버튼 태그 테스트</button>";
			var title = '일반 태그들에 대한 검사 : button';
			assert.normalTag(inputTag, title);
		});

		/*;
		test( 'textarea', function(assert){
			var inputTag = '<textarea>textarea 태그 테스트</textarea>';
			var title = '일반 태그들에 대한 검사 : textarea';
			assert.normalTag(inputTag, title);
		}
		*/

		test( 'sup', function(assert){
			var inputTag = '<sup>superscript</sup>';
			var title = '일반 태그들에 대한 검사 : sup';
			assert.normalTag(inputTag, title);
		});

		test( 'quotation', function(assert){
			var inputTag = '<q> quotation 태그 </q>';
			var title = '일반 태그들에 대한 검사 : quotation';
			assert.normalTag(inputTag, title);
		});

		test( 'blockquote', function(assert){
			var inputTag = '<blockquote>For 50 years, WWF has been protecting the future of nature. '+
							'The world leading conservation organization, WWF works in 100 countries '+
							'and is supported by 1.2 million members in the United States and close to '+
							'5 million globally.</blockquote>';
			var title = '일반 태그들에 대한 검사 : blockquote';
			//assert.normalTag(inputTag, title);
			

			var testID = newTestID();
			var tag = '<p>[ 텍스트1 ][ ' + inputTag + ' ][ 텍스트2 ]</p>';
			var $tagTest = getTestTag(tag, testID, title);
			ok(true, tag);
			
			// Node를 추가
			var $parent = $('#'+testID);
			h.addNode($parent[0]);
			
			// 3개 생성 : mark <T> mark </T> mark
			var $mark = $parent.find('mark');
			ok($mark.length == 3, '<mark> 태그 생성' );
			
			var nodeName = $(inputTag)[0].nodeName;
			var $normalTag = $parent.find(nodeName);
			var $childMark = $normalTag.find('mark');
			ok($childMark.length == 1, '<mark> 태그 생성' );
			
			/*
			var $contents = $($parent[0]).children();
			//out('$parent', $contents);
			
			//var $tag = $parent[0];
			ok($($contents[0]).is('mark'), '[0] --> <mark> 태그' );
			ok($normalTag.is(nodeName), '[1] --> <' + nodeName + '> 태그' );
			ok($($contents[2]).is('mark'), '[2] --> <mark> 태그' );
			*/
			
			// 저장 테스트
			h.save();
			
			//unwrap
			h.removeAll();
			$mark = $('#'+testID).find('mark');
			ok($mark.length == 0, '<mark> 태그 제거됨' );
		});

		test( 'comment', function(assert){
			var inputTag = '<!--This is a comment. Comments are not displayed in the browser-->';
			var title = '일반 태그들에 대한 검사 : comment';
			//assert.normalTag(inputTag, title);
			

			var testID = newTestID();
			var tag = '<p>[ 텍스트1 ][ ' + inputTag + ' ][ 텍스트2 ]</p>';
			var $tagTest = getTestTag(tag, testID, title);
			ok(true, tag);
			
			// Node를 추가
			var $parent = $('#'+testID);
			h.addNode($parent[0]);
			
			// 3개 생성 : mark <T> mark </T> mark
			var $mark = $parent.find('mark');
			ok($mark.length == 2, '<mark> 태그 생성' );
			
			var $contents = $($tagTest[0]).children();
			//out('$parent', $contents);
			
			//var $tag = $parent[0];
			ok($($contents[0]).is('mark'), '[0] --> <mark> 태그' );
			ok($($contents[1]).is('mark'), '[2] --> <mark> 태그' );
			
			// 저장 테스트
			h.save();
			
			//unwrap
			h.removeAll();
			$mark = $('#'+testID).find('mark');
			ok($mark.length == 0, '<mark> 태그 제거됨' );
		});
		
		
		
		
		/////////////////////////
		// END
		/////////////////////////
	});
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	