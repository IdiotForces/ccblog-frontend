$('.ui.accordion').accordion();

var isdcng_blog = { };

isdcng_blog.amap = function (func, maybe_array) {
	var objs = [].concat(maybe_array); // can be used to construct array at any time
	for (var i = 0; i < objs.length; i++)
		func(objs[i]);
}

isdcng_blog.add_class = function (element, classes) {
	this.amap(function (cls) { element.classList.add(cls); }, classes); };

isdcng_blog.remove_class = function (element, classes) {
	this.amap(function (cls) { element.classList.remove(cls); }, classes); };

isdcng_blog.get_element_height = function (element) {
	var style = window.getComputedStyle(element);

	if (style.display != 'none' &&
			style['maxHeight'].replace('px', '').replace('%', '') != '0')
		return element.offsetHeight;
	else {
		element.style.position = 'absolute';
		element.style.visibility = 'hidden';
		element.style.display = 'block';

		var ret = element.offsetHeight;

		element.style.display = style.display;
		element.style.position = style.position;
		element.style.visibility = style.visibility;

		return ret;
	}
}

isdcng_blog.slide_hide_default = function (element) {
	this.add_class(element, ['y-hidden', 'y-overflow-hidden', 'y-hidden-transition']);
	element.style.display = 'none';
};

isdcng_blog.slide_up_disappear = function (element, callback) {
	var that = this;

	this.add_class(element, 'y-hidden-transition');
	element.style.maxHeight = this.get_element_height(element) + 'px';
	setTimeout(function () {
		that.add_class(element, ['y-overflow-hidden', 'y-hidden']);
	}, 100);
	setTimeout(function () {
		element.style.display = 'none';
		element.style.maxHeight = 'none';
		if (callback) callback();
	}, 1000);
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
		element.style.maxHeight = 'none';
		if (callback) callback();
	}, 1000);
};
