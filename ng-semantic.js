ISDCNgSemantic = angular.module('isdcng.semantic.trunk', [ ]);

function define_directive_semantic(name_directive, class_semantic, callback) {
	if (typeof class_semantic == 'string')
		class_semantic = new Array(class_semantic);

	ISDCNgSemantic.directive(name_directive, function () {

		return {
			link: function (scope, element) {
				class_semantic.forEach(function (classname, idx, array) {
					element.addClass(classname);
				});
				if (callback) callback(element);
			},
		};

	});
}

function define_div_directive_semantic(name_directive, class_semantic, callback) {
	if (typeof class_semantic == 'string')
		class_semantic = new Array(class_semantic);

	ISDCNgSemantic.directive(name_directive, function () {
		return {
			template: '<div ng-transclude></div>',
			transclude: true,
			replace: true,
			link: function (scope, element) {
				class_semantic.forEach(function (classname, idx, array) {
					element.addClass(classname);
				});
				if (callback) callback(element);
			},
		};
	});
}

define_directive_semantic('suiMenu', 'menu');

define_div_directive_semantic('suiSegment', 'segment');

define_div_directive_semantic('field', 'field');

define_directive_semantic('suiHeader', 'header');

define_directive_semantic('menuItem', 'item');

ISDCNgSemantic.item_template_func = function (element, attrs) {
	if ('isLink' in attrs) return '<a ng-transclude></a>';
	else return '<div ng-transclude></div>'; }

ISDCNgSemantic.directive('menuItem', function ($compile) {
	return {
		template: ISDCNgSemantic.item_template_func,
		transclude: true,
		replace: true,
		link: function (scope, element, attrs) {
			element.addClass('item'); },
	};
});

ISDCNgSemantic.directive('icon', function () {
	return {
		template: '<i class="icon"></i>',
		replace: true }; });

ISDCNgSemantic.directive('modalSmall', function () {
	return {
		template: '<div class="ui small modal" ng-transclude></div>',
		transclude: true,
		replace: true,

		link: function(scope, element) {
			$(element).modal({onShow: function () { $('.ui.checkbox').checkbox();}}); }
	};
});

ISDCNgSemantic.directive('suiCheckboxInput', function() {
	return {
		template: '<input type="checkbox" />',
		transclude: true,
		replace: true,
	};
});

define_directive_semantic('iconClose', 'close');

define_directive_semantic('iconWeibo', 'weibo');

define_directive_semantic('iconTwitter', 'twitter');

define_directive_semantic('iconDropdown', 'dropdown');

define_directive_semantic('iconUpChevron', ['up', 'chevron']);

define_directive_semantic('iconDownChevron', ['down', 'chevron']);

define_directive_semantic('breadcrumb', ['ui', 'breadcrumb']);

define_directive_semantic('sui-sec', 'section');

define_directive_semantic('sui-small', 'small');

define_directive_semantic('active', 'active');

define_directive_semantic('suiActions', 'actions', function (element)
												{ element.css('display', 'block'); });
define_directive_semantic('suiContent', 'content');

ISDCNgSemantic.directive('elementNoLeftRadius', function () {
	return {
		link: function(scope, element) {
			$(element).css('border-top-left-radius', '0');
			$(element).css('border-bottom-left-radius', '0'); }
	};
});

ISDCNgSemantic.directive('elementNoLeftBorder', function () {
	return {
		link: function(scope, element) {
			$(element).css('border-left', 'none'); }
	};
});

ISDCNgSemantic.directive('eraseBorder', function() {
	return {
		link: function (scope, element) {
			if ($(element).hasClass('compact') && $(element).hasClass('button')) {
				$(element).addClass('erase-border-for-compact-button'); }
		}
	};
});

ISDCNgSemantic.directive('hideByDefault', function () {
	return {
		link: function (scope, element) {
			// why must I use the index?
			isdcng_blog.slide_hide_default(element[0]); }
	};
});
