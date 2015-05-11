/* global CryptoJS */
/// <reference path="typings/jquery/jquery.d.ts"/>

$('.ui.accordion').accordion();

var isdcng_blog = { };

isdcng_blog.amap = function (func, maybe_array) {
	var objs = [].concat(maybe_array); // can be used to construct array at any time
	for (var i = 0; i < objs.length; i++)
		func(objs[i]);
};

isdcng_blog.add_class = function (element, classes) {
	this.amap(function (cls) { element.classList.add(cls); }, classes); };

isdcng_blog.remove_class = function (element, classes) {
	this.amap(function (cls) { element.classList.remove(cls); }, classes); };

isdcng_blog.has_class = function (element, klass) {
	return element.classList.contains(klass); };

isdcng_blog.get_element_height = function (element) {
	var style = window.getComputedStyle(element);

	if (style.display != 'none' &&
			style.maxHeight.replace('px', '').replace('%', '') != '0') {
		return element.offsetHeight;
	} else {
		element.style.position = 'absolute';
		element.style.visibility = 'hidden';
		element.style.display = 'block';

		var ret = element.offsetHeight;

		element.style.display = style.display;
		element.style.position = style.position;
		element.style.visibility = style.visibility;

		return ret;
	}
};

isdcng_blog.get_element_width = function (element) {
	var style = window.getComputedStyle(element);

	if (style.display != 'none' &&
			style.maxWidth.replace('px', '').replace('%', '') != '0') {
		return element.offsetWidth;
	} else {
		element.style.position = 'absolute';
		element.style.visibility = 'hidden';
		element.style.display = 'block';

		var ret = element.offsetWidth;

		element.style.display = style.display;
		element.style.position = style.position;
		element.style.visibility = style.visibility;

		return ret;
	}
};

isdcng_blog.settings = {
	max_height: 23333,

	max_height_with_px: function () {
		return this.max_height + 'px'; }
};

isdcng_blog.slide_hide_default = function (element) {
	this.add_class(element, ['y-hidden', 'y-overflow-hidden', 'y-hidden-transition']);
	element.style.display = 'none';
};

isdcng_blog.slide_show_default = function (element) {
	this.add_class(element, ['y-hidden-transition']);
	element.style.maxHeight = isdcng_blog.settings.max_height_with_px();
};

isdcng_blog.slide_up_disappear = function (element, callback) {
	var that = this;

	this.add_class(element, 'y-hidden-transition');
	element.style.maxHeight = this.get_element_height(element) + 'px';
	console.log('slide disappear, element height', element.style.maxHeight);
	setTimeout(function () {
		that.add_class(element, ['y-overflow-hidden', 'y-hidden']);
	}, 10);
	setTimeout(function () {
		element.style.display = 'none';
		element.style.maxHeight = isdcng_blog.settings.max_height_with_px();
		if (callback) callback();
	}, 1100);
};

isdcng_blog.slide_down_appear = function (element, callback) {
	var that = this;

	this.remove_class(element, 'y-hidden');
	element.style.display = 'block';
	element.style.maxHeight = 'none';
	var height_org = element.offsetHeight;

	element.style.maxHeight = '0px';
	setTimeout(function () {
		element.style.maxHeight = height_org+'px';
	}, 100);
	setTimeout(function () {
		that.remove_class(element, 'y-overflow-hidden');
		element.style.maxHeight = isdcng_blog.settings.max_height_with_px();
		if (callback) callback();
	}, 1100);
};

// stackoverflow.com/questions/22119673/find-the-closest-ancestor-element-that-has-a-specific-class
isdcng_blog.find_ans_with_cls = function (element, klass) {
	while ((element = element.parentElement) && !element.classList.contains(klass));
	return element;
};

// iterate elements children with func (element)
// support an optional filter (element) -> boolean
isdcng_blog.iter_children = function (element, func, filter) {
	if (filter === undefined) filter = function () {
		return true; };
	var ele_current = element.firstElementChild;
	while (ele_current) {
		if (filter(ele_current) === true) func(ele_current);
		ele_current = ele_current.nextElementSibling;
	}
};

// slide right to next '.slide-page'
isdcng_blog.slide_to_next = function (element) {
	var ele_thispage = this.find_ans_with_cls(element, 'slide-page');
	var ele_wrapper = ele_thispage.parentElement;
	var ele_nextpage = ele_thispage.nextElementSibling;

	var org_width = this.get_element_width(ele_thispage);
	this.iter_children(ele_wrapper, function (page) {
		var org_left = parseInt(page.ownerDocument.defaultView.getComputedStyle(page, null).getPropertyValue('left').replace('px', ''));
		page.style.left = (org_left - org_width) + 'px';
		page.classList.remove('slide-active');
	});
	
	ele_nextpage.classList.add('slide-active');

	// '.slide-wrapper' height
	ele_wrapper.style.height = ele_nextpage.offsetHeight + 'px';
	// '.slides' height
	ele_wrapper.parentElement.style.height = ele_nextpage.offsetHeight + 'px';
};

// slide left to previous '.slide-page'
isdcng_blog.slide_to_prev = function (element) {
	var ele_thispage = this.find_ans_with_cls(element, 'slide-page');
	var ele_wrapper = ele_thispage.parentElement;

	var org_width = this.get_element_width(ele_thispage);

	var ele_prevpage;

	this.iter_children(ele_wrapper, function (page) {
		var org_left = parseInt(page.ownerDocument.defaultView.getComputedStyle(page, null).getPropertyValue('left').replace('px', ''));
		page.style.left = (org_left + org_width) + 'px';

		page.classList.remove('slide-active');

		if (page.nextElementSibling == ele_thispage) {
			ele_prevpage = page; }
	});

	ele_prevpage.classList.add('slide-active');

	// '.slide-wrapper' height
	ele_wrapper.style.height = ele_prevpage.offsetHeight + 'px';
	// '.slides' height
	ele_wrapper.parentElement.style.height = ele_prevpage.offsetHeight + 'px';
};

// set '.slides' pages width as parent width
// deatils: set '.slide-wrapper' width with parent width
// 			then set pages width, and set wrapper width back.
isdcng_blog.slide_initialize_parent = function (element) {
	var slide_root = element;
	element = element.getElementsByClassName('slide-wrapper')[0];

	element.style.width = '100%';
	element.style.height = 'auto';

	this.iter_children(element, function (child) {
		child.style.width = element.offsetWidth + 'px';
	});
	
	// an annoying bug, with the 'px'
	element.style.height = element.firstElementChild.offsetHeight + 'px';
	slide_root.style.height = element.style.height;

	element.firstElementChild.classList.add('slide-active');
	element.style.width = '23333px';
};

isdcng_blog.slide_update_height = function (slide) {
	var slide_root = slide;
	var slide_wrapper = slide_root.getElementsByClassName('slide-wrapper')[0];
	var slide_current = slide_wrapper.getElementsByClassName('slide-active')[0];
	
//	slide_root.style.height = 'auto';
//	slide_wrapper.style.height = 'auto';
	
	slide_wrapper.style.height = slide_current.offsetHeight + 'px';
	slide_root.style.height = slide_wrapper.style.height;
};

isdcng_blog.para_toggle_combox = function (paragraph) {
	var box_element = paragraph.parentElement.getElementsByClassName('article-paragraph-comment-container-wrapper')[0];

	if (this.has_class(box_element, 'combox-shown')) {
		this.remove_class(box_element, 'combox-shown');
		this.slide_up_disappear(box_element);
	} else {
		this.add_class(box_element, 'combox-shown');
		this.slide_down_appear(box_element);
	}
};

isdcng_blog.encrypt = function (src) {
	return CryptoJS.SHA3(src.toString()).toString(); };