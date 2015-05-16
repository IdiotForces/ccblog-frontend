/* global ISDCBlogRSampleModule */
/// <reference path="typings/angularjs/angular.d.ts"/>

ISDCBlogRSampleModule = angular.module('isdcng.blogdemo.rsample', [ ]);

ISDCBlogRSampleModule.service('articlesService', function ($http, $q, $rootScope) {

	var count_articles = 0;
	var data_list = [ ];

	var cache_article_details = { };

	var construct_article_list = function (data) {
		var ret = [ ];

		for (var i = 0; i < data.count; i++) {
			var article = data.contents[i];
			var t = { };

			t.article_id = article.article_id;
			t.author_id = article.author_id;
			t.date = '96-12-08';
			t.title = article.title;
			t.summary = article.summary;
			t.title_secondary = article.title_secondary;
			t.author_name = article.author_name;
			t.category = article.tags;
			
			t.liked_by_self = article.liked_by_self;
			t.disliked_by_self = article.disliked_by_self;
			t.count_liker = article.count_liker;
			t.count_disliker = article.count_disliker;

			ret.push(t);
		}

		return ret;
	};

	var update_list = function () {
		$http.get('/articles/list')
			.success(function (data, status, header, config) {
				count_articles = data.count;

				data_list = construct_article_list(data);
			});
	};

	var total_len = function () {
		return count_articles; };

	var article_list = function (start, end) {
		return data_list; };

	var article_detail = function (article_id) {
		if (cache_article_details[article_id] === undefined) {
			cache_article_details[article_id] = { }; }

		$http.get('/articles/' + article_id)
			.success(function (data, status, header, config) {
					cache_article_details[article_id] = data;
				});
	};
	
	var update_like_dislike_factory = function (url_seg) {
		return function (article_id, toggle) {
			var func_success = function (data, status, header, config) {
				cache_article_details[article_id] = data; };
		
			if (toggle) {
				$http.post('/articles/' + article_id + '/' + url_seg)
					.success(func_success);
			} else {
				$http.delete('/articles/' + article_id + '/' + url_seg)
					.success(func_success); }
		};
	}
	
	var like_article = update_like_dislike_factory('like');
	var dislike_article = update_like_dislike_factory('dislike');

	update_list();

	return {
		total_len: total_len,
		article_list: article_list,
		article_detail: article_detail,
		cache_article_details: cache_article_details,
		like_article: like_article,
		dislike_article: dislike_article
	};

});

var users = {
	0: {
		user_id: 0,
		username: 'Windas',
		user_url: 'http://www.scuisdc.com',
		user_avatar: './assets/placeholder.png'
	},

	1: {
		user_id: 1,
		username: 'Dfb',
		user_url: 'http://www.scuisdc.com',
		user_avatar: './assets/placeholder.png'
	}
};

ISDCBlogRSampleModule.service('usersService', function ($http, $q) {

	var in_current_user = undefined;

	var get_userinfo = function (id) {
		return users[id]; };

	var current_user = function () {
		return in_current_user; }

	var current_user_id = function () {
		if (in_current_user == undefined)
			return undefined;
		return parseInt(in_current_user.user_id);
	};

	var has_loggedin = function () {
		return in_current_user !== undefined; };

	var validate_login = function () {
		var d = $q.defer();

		$http.post('/authentication')
			.success(function (data, status, header, config) {
				in_current_user = data;
				d.resolve(true);
			}).error(function (data, status, header, config) {
				d.resolve(false); });

		return d.promise;
	}

	var try_login = function (username, passwd) {
		var d = $q.defer();

		var data = {
			username: username,
			passwd: isdcng_blog.encrypt(passwd)
		};

		$http.post('/authentication', data)
			.success(function (data, status, header, config) {
				in_current_user = data;
				d.resolve('succeed');
			}).error(function (data, status, header, config) {
				if (status == 404) {
					d.resolve('user-not-found');
				} else if (status == 500) {
					d.resolve('server-error');
				} else if (status === 401) {
					d.resolve('auth-failed');
				} else {
					d.resolve('just-failed');
				}
			});

		return d.promise;
	};
	
	var try_register = function (username, passwd, email) {
		var d = $q.defer();
		
		var data = {
			username: username,
			passwd: isdcng_blog.encrypt(passwd),
			email: email,	
		};
		
		$http.post('/authentication/register', data)
			.success(function (data, status, header, config) {
				d.resolve('succeed');
			}).error(function (data, status, header, config) {
				if (status == 500) {
					d.resolve('server-error');
				} else if (status == 400) {
					d.resolve('invalid-request');
				} else {
					d.resolve('just-failed');
				}
			});
		
		return d.promise;	
	};

	var log_out = function () {
		var d = $q.defer();

		$http.post('/authentication/logout')
			.success(function (data, status, header, config) {
				in_current_user = undefined;
				d.resolve('succeed');
			})
			.error(function (data, status, header, config) {
				if (status == 500) {
					d.resolve('server-error');
				} else {
					d.resolve('just-failed');
				}
			});

		return d.promise;
	};

	return {
		get_userinfo: get_userinfo,
		try_login: try_login,
		try_register: try_register,
		current_user: current_user,
		current_user_id: current_user_id,
		validate_login: validate_login,
		has_loggedin: has_loggedin,
		log_out: log_out,
	};
});
