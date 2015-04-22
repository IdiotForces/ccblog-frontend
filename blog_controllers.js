var ISDCBlogDApp = angular.module('isdcng.blogdemo', [ 'isdcng.blogdemo.devtest', 'isdcng.xoundation.trunk', 'isdcng.semantic.trunk' ]);

ISDCBlogDApp.provider('myBlog', function () {
	this.display_name = 'ISDCBlog';

	this.set_display_name = function (value) {
		this.display_name = value; };

	this.$get = function () {
		var display_name = this.display_name;
		return {
			get_display_name: function () { return display_name; }
		};
	};
});

ISDCBlogDApp.provider('pages', function () {
	this.item_per_page = 8;

	this.set_item_per_page = function (value) {
		this.item_per_page = value; };

	this.$get = function () {
		var item_per_page = this.item_per_page;
		return {
			get_item_per_page: function () { return item_per_page; }
		};
	};
});

ISDCBlogDApp.service('mainArticleListPages', function (articlesService, pages) {

	var get_total_pages = function () {
		return Math.ceil(articlesService.total_len() / pages.get_item_per_page()); }

	return {
		get_total_pages: get_total_pages
	};
});

ISDCBlogDApp.service('utilService', function () {
	var rep_range = function (n) { return new Array(n); };

	return { rep_range: rep_range };
});

ISDCBlogDApp.config(function (myBlogProvider) {
	myBlogProvider.set_display_name("示例博客"); });

ISDCBlogDApp.controller('BlogController', function ($scope, myBlog) {
	$scope.myBlog = myBlog;
});

ISDCBlogDApp.controller('MainArticleListController', function ($scope, $rootScope, myBlog, pages, articlesService, usersService, utilService, mainArticleListPages) {
	$scope.articlesService = articlesService;
	$scope.usersService = usersService;
	$scope.utilService = utilService;
	$scope.mainArticleListPages = mainArticleListPages;

	$scope.current_page = 1;

	$scope.get_current_page = function () {
		return $scope.current_page; };

	$scope.prev_page = function () {
		if ($scope.current_page != 1)
			$scope.nav_page($scope.current_page - 1); };

	$scope.next_page = function () {
		if($scope.current_page != mainArticleListPages.get_total_pages())
			$scope.nav_page($scope.current_page + 1); };

	$scope.nav_page = function (pn) {
		$scope.current_page = pn; };

	$scope.article_list_page = function (pn) {
		return articlesService.article_list((pn-1)*pages.get_item_per_page(), pn*pages.get_item_per_page()); };

	$scope.jump_to_article = function (article) {
		isdcng_blog.slide_up_disappear(document.getElementById('main-article-list'), function () {
			isdcng_blog.slide_down_appear(document.getElementById('main-article'));
		});
	};

});

ISDCBlogDApp.controller('MainArticleController', function ($scope) {

	$scope.back_to_article_list = function () {
		isdcng_blog.slide_up_disappear(document.getElementById('main-article'), function () {
			isdcng_blog.slide_down_appear(document.getElementById('main-article-list'));
		});
	};

});
