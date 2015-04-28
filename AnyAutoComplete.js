(function(window,$){
/**
 * @author ggordon
 * @created 28.4.2015
*/
    /**  
	 *   divNode - HTMLInputElement  - textbox node
	 *   options - Object
	 *   =================
	 *   options : {
	 *       dataSource : { //keywords or suggestions
	 *           'Cat 1 Name':[
	 *               'Elem 1',
	 *               'Elem 2'
	 *           ],
	 *           'Cat 2 Name':[
	 *               'Elem 1',
	 *               'Elem 2'
	 *           ]
	 *       }
	 *   }
	 */
	function AnyCompleteSearch(divNode, options) {
		if (divNode == undefined || divNode == null)
			return;
		options = options || {};
		var _self = this;
		_self.$tbox = $(divNode);
		_self.$tbox.addClass('any-complete-search-box');
		_self.dataSource = options.dataSource || {};
		_self.htmlNode = divNode;
		_self.val = function (newVal) {
			if(newVal){
			    _self.$tbox.val(newVal);
			    return;
			}
			return _self.$tbox.val();
		};
		_self.$proposalBox = $('<ul class="list-group any-complete-search-suggestion"></ul>');
		_self.$tbox.after(_self.$proposalBox.hide().css({
		    'z-index':1,
			'position':'absolute',
			'width':_self.$tbox.width()
		})).on('keydown',function(evt){
		    var keyCode = evt.keyCode || evt.which; 
			if (keyCode == 9 && _self.$proposalBox.children().length > 0) { 
                 evt.preventDefault(); 
				 var newString = _self.currentWordFragment($(_self.$proposalBox.children()[0]).text());
			      _self.val(newString);
				  _self.$proposalBox.hide();
				  return false;
              // call custom function here
            }
		});
		_self.cursorIndexPosition = function () {
			return getCaret(_self.htmlNode);//_self.htmlNode.selectionEnd;
		};

		function getCaret(el) {
			if (el.selectionStart) {
				return el.selectionStart;
			} else if (document.selection) {
				el.focus();

				var r = document.selection.createRange();
				if (r == null) {
					return 0;
				}

				var re = el.createTextRange(),
				rc = re.duplicate();
				re.moveToBookmark(r.getBookmark());
				rc.setEndPoint('EndToStart', re);

				var add_newlines = 0;
				for (var i = 0; i < rc.text.length; i++) {
					if (rc.text.substr(i, 2) == '\r\n') {
						add_newlines += 2;
						i++;
					}
				}

				//return rc.text.length + add_newlines;

				//We need to substract the no. of lines
				return rc.text.length - add_newlines;
			}
			return 0;
		}

		_self.currentWordFragment = function (newWord) {
			var chars = (_self.val() || "").split('');
			var pos = _self.cursorIndexPosition()-1;
			if(pos<0)
			   pos =0;
			chars[pos] = '--here--' + chars[pos] + '--here--';
			chars = chars.join('');
			if(newWord)
			    return chars.replace(/\w*--here--.{1}--here-- ?/,newWord);
			chars = chars.match(/\w*--here--.{1}--here--\w*?/);
			if (chars && chars.length > 0) {
				chars = chars[0];
				return chars.replace(/--here--/g, '');
			} else {
				return "";
			}
		}

		_self.lastUsedCategory = null;

		_self.matchingWordList = function () {
			var word = _self.currentWordFragment();
			if (word == "")
				return [];
			var list = [];
			for (var cat in _self.dataSource) {
				for (var i = 0; i < _self.dataSource[cat].length; i++) {
					var priority = 0;
					if (_self.lastUsedCategory == cat)
						priority = 1;
					if (_self.dataSource[cat][i].match(word))
						list.push({
							priority : priority,
							word : _self.dataSource[cat][i]
						});
				}
			}
			list = list.sort(function (a, b) {
					return a.priority > b.priority;
				});
			return list.map(function (el) {
			    if(el.word != "")
				return el.word;
			}).join(' ').replace(/  /g, ' ').split(' ');
		};

		_self.suggesstionList = function () {
			var html = "",
			list = _self.matchingWordList();
			for (var i = 0; i < list.length; i++)
			    if(list[i].length>0)
				html += "<li class='list-group-item'>" + list[i] + "</li>\n"
				return html;
		}

		_self.$tbox.on('keyup', function () {
			_self.$proposalBox.html(_self.suggesstionList());
			
			if(_self.$proposalBox.children().length==0){
			     _self.$proposalBox.hide();
				 return true;
			}
			
			
			_self.$proposalBox.children().each(function(i,el){
			    $(el).on('click',function (evt) {
			         var newString = _self.currentWordFragment($(this).text());
			    	 _self.val(newString);
					 _self.$proposalBox.hide();
			    });
			});
			_self.$proposalBox.show();
		});

		return _self;
	}
	window.AnyAutoComplete = AnyAutoComplete;
})(window,jQuery);