var ISDChatterApp = angular.module('isdcng.chatter', [ ]);

// stackoverflow.com/questions/14430655/recursion-in-angular-directives
ISDChatterApp.service('RecursionHelper', function($compile) {
	return {
		compile: function (element, that) {
			var contents = element.contents().remove();
			var compiled_contents;
			var link = that.link;
			if (angular.isFunction(link)) link = { post: link };
			return {
				pre: (link && link.pre) ? link.pre : null,
				post: function (scope, element) {
					if (!compiled_contents) compiled_contents = $compile(contents);
					compiled_contents(scope, function (clone) { element.append(clone); });
					if (link && link.post) { link.post.apply(null, arguments); }
				}	};
		}
	};
});

ISDChatterApp.directive("chatterPanel", function (RecursionHelper) {
	return {
		restrict: "E",
		scope: { databuf: '=', rootid: '=', eventhandler: '=', nodeid: '=' },
		templateUrl: 'chatter-item.html',
		compile: function (element) {
			return RecursionHelper.compile(element, this); },
		controller: function ($scope, $http) {
			$scope.fetch_detail = function (post, $event) {
				$scope.eventhandler(post.id, function () {
					$($event.currentTarget).parent().chaccordion_toggle(); });
				$event.stopPropagation();
			};
			$scope.remove = function (post) {
				$http.delete('/chatter/node/' + $scope.nodeid + '/chat?id=' + post.id).success(function (data, status, header, config) {
					$scope.databuf[post.parent_id].children.splice($scope.databuf[post.parent_id].children.indexOf(post), 1); });
			};
			
			$scope.toggle_reply = function ($event) {
				var tooltip_box = $($event.currentTarget).parents('.ch-accordion-wrapper').first().find('.ch-tooltip-box').first();
				tooltip_box.chtooltip_toggle();
				tooltip_box.find('.ch-postopic-title').focus();
				$event.stopPropagation();
			};
			
			$scope.reply_cancel = function ($event) {
				$($event.currentTarget).parents('.ch-tooltip-box').first().chtooltip_toggle();
			};
			
			$scope.post_message = function ($event, post) {
				var tooltip_box = $($event.currentTarget).parent().parent();
				
				var data = {
					title: tooltip_box.find('.ch-postopic-title').val(),
					content: tooltip_box.find('.ch-postopic-content').val(),
					parent_id: post.id
				};
				
				$http.post('/chatter/node/' + $scope.nodeid + '/chat', data).success(function (data, status, header, config) {
					tooltip_box.find('.ch-postopic-title').val('');
					tooltip_box.find('.ch-postopic-content').val('');
					$scope.reply_cancel($event);
				});
			};
		},
		link: function (scope, elem, attr) {
			$(elem).parent().parent().parent().children('.ch-accordion-content-wrapper').each(function (index, elem_inner) {
				isdcng_blog.slide_hide_default(elem_inner); });
		}
	};
});

ISDChatterApp.controller('ISDCNgChatterRootController', function ($scope, $http) {
	
	$scope.data = { };
	
	$scope.nodes = [ ];
	
	$scope.current_nodeid = undefined;
	
	$scope.fetch_message_detail = function (msgid, callback) {
		$http.get('/chatter/node/' + $scope.current_nodeid + '/chat?id=' + msgid).success(function (data, status, header, config) {
			if (msgid in $scope.data) {
				isdcng_blog.update_obj($scope.data[msgid], data);
			} else $scope.data[msgid] = data;
			
			data.children.forEach(function (element, index, array) {
				if (element.id in $scope.data)
					isdcng_blog.update_obj($scope.data[element.id], element);
				else $scope.data[element.id] = element;
			});
			callback();
		});
	};
	
	$scope.switch_to_node = function (node_id) {
		$http.get('/chatter/node/' + node_id + '/chat').success(function (data, status, header, config) {
			$scope.data[node_id] = data;
			$scope.current_nodeid = data.id;
			
			data.children.forEach(function (element, index, array) {
				if (element.id in $scope.data)
					isdcng_blog.update_obj($scope.data[element.id], element);
				else $scope.data[element.id] = element;
			});
			
			tick(node_id);
		});
	};
	
	$scope.post_topic = function () {
		var data = {
			title: $('#ch-postopic-title').val(),
			content: $('#ch-postopic-content').val(),
			parent_id: $scope.current_nodeid
		};
		
		$http.post('/chatter/node/' + $scope.current_nodeid + '/chat', data).success(function (data, status, header, config) {
			$('#ch-postopic-title').val('');
			$('#ch-postopic-content').val('');
			$('#chpanel-newtopic-accordion').chaccordion_toggle();
		});
	};
	
	var tick = function (node_id) {
		$http.get('/chatter/node/' + node_id + '/fetch').success(function (data, status, header, config) {
			data.forEach(function (element, index, array) {
				if (element.id in $scope.data)
					isdcng_blog.update_obj($scope.data[element.id], element);
				else {
					$scope.data[element.id] = element;
					if (element.parent_id in $scope.data && 'children' in $scope.data[element.parent_id]) {
						$scope.data[element.parent_id].children.unshift(element);
					}
				}
			});
			
			setTimeout(function () { tick(node_id); } , 0);
		});	
	};
	
	$http.get('/chatter/node').success(function (data, status, header, config) {
		$scope.nodes = data;
		
		$scope.switch_to_node($scope.nodes[0].id);
	});
	
});

//(function ($) {

// stackoverflow.com/questions/1318076/jquery-hasattr-checking-to-see-if-there-is-an-attribute-on-an-element
$.fn.ch_hasAttr = function (name) {
	var attr = $(this).attr(name);
	
	return (typeof attr != typeof undefined && attr !== false);
};

// stackoverflow.com/questions/13159180/set-attribute-without-value
$.fn.ch_addAttr = function (name) {
	if (!$(this).ch_hasAttr(name))
		$(this).attr(name, '');
};

$.fn.chaccordion_toggle = function () {
	
	if ($(this).hasClass('ch-expanded')) {
		$(this).children('.ch-accordion-content-wrapper').each(function (index, elem) {
			isdcng_blog.slide_up_disappear(elem); });
		$(this).removeClass('ch-expanded');
	} else {
		$(this).children('.ch-accordion-content-wrapper').each(function (index, elem) {
			isdcng_blog.slide_down_appear(elem); });
		$(this).addClass('ch-expanded');
	}
};

$('.ch-accordion-wrapper > .ch-accordion-content-wrapper').each(function (index, elem) {
	isdcng_blog.slide_hide_default(elem); });

$(document).on('click', '.ch-accordion-wrapper > .ch-accordion-header-wrapper', function () {
	$(this).parent().chaccordion_toggle();
});

$.fn.chtooltip_toggle = function () {
	if ($(this).hasClass('ch-actived')) {
		$(this).removeClass('ch-actived');	
	} else {
		$(this).addClass('ch-actived');
	}
};

$(document).on('click', '.remove-onclick', function (event) { event.stopPropagation(); });

//})(jQuery);