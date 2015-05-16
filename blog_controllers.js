/* global hljs */
/* global marked */
/* global isdcng_blog */
/// <reference path="typings/angularjs/angular.d.ts"/>

var ISDCBlogDApp = angular.module('isdcng.blogdemo', [ 'ngSanitize', 'isdcng.blogdemo.rsample', 'isdcng.xoundation.trunk', 'isdcng.semantic.trunk' ]);

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
		return Math.ceil(articlesService.total_len() / pages.get_item_per_page()); };

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

ISDCBlogDApp.service('breadcrumbService', function () {

	var location = [ ['Home', ''], ['Blog', ''], ['Article List', ''] ];

	return {
		get_locations: function ()
			{ return location; },

		set_locations: function (value) {
			location = value; },

		get_nav_article_list: function () {
			return [ ['Home', ''], ['Blog', ''], ['Article List', ''] ]; }
	};
});

ISDCBlogDApp.service('newArticleService', function () {
	
});

ISDCBlogDApp.controller('BlogController', function ($scope, myBlog, breadcrumbService, usersService) {
	
	$scope.myBlog = myBlog;
	$scope.breadcrumbService = breadcrumbService;

	$scope.current_article_id = 0;
	
	$scope.set_current_art_id = function (id) { $scope.current_article_id = id; };

	$scope.breadcrumb_locations = function () { return breadcrumbService.get_locations(); };

	var back_to_list_factory = function (current_ele_id) {
		return function () {
			isdcng_blog.slide_up_disappear(document.getElementById(current_ele_id), function () {
				isdcng_blog.slide_down_appear(document.getElementById('main-article-list'));

				$scope.breadcrumbService.set_locations($scope.breadcrumbService.get_nav_article_list());
				$scope.$apply();
			});
		}
	};

	$scope.back_to_article_list = back_to_list_factory('main-article');
	$scope.new_article_back_to_article_list = back_to_list_factory('page-new-article');
	
	$scope.switch_newessay_to_list = function () {
		isdcng_blog.slide_up_disappear(document.getElementById('page-new-article'), function () {
			isdcng_blog.slide_down_appear(document.getElementById('main-article-list'));
			
			$scope.breadcrumbService.set_locations($scope.breadcrumbService.get_nav_article_list());
			$scope.$apply();
		});
	};
	
	$scope.switch_list_to_newessay = function () {
		isdcng_blog.slide_up_disappear(document.getElementById('main-article-list'), function () {
			isdcng_blog.slide_down_appear(document.getElementById('page-new-article'));
			
			breadcrumbService.set_locations([
				['Home', ''],
				['Blog', function () { $scope.switch_newessay_to_list(); }],
				['Create Article', '']
			]);
			
			$scope.$apply();
		});
	};

//	==============================================================================
//	** AUTHENTICATION CONTROLS **

	$scope.logged_in = function () {
		return usersService.has_loggedin(); };

	$scope.user_name = function () {
		if (usersService.current_user())
			return usersService.current_user().username; };

	// stackoverflow.com/questions/12304291/angularjs-how-to-run-additional-code-after-angularjs-has-rendered-a-template
	$scope.$evalAsync(function () {
		
		usersService.validate_login();
		
		isdcng_blog.slide_show_default(document.getElementById('main-article-list'));
		
	});
	
	$scope.login_modalshow = function () {
		usersService.validate_login().then(function (succeed) {
			if (!succeed) {
				$('#login-modal').modal('show', function () {
					isdcng_blog.slide_initialize_parent(document.getElementsByClassName('slides')[0]);
				});
			}
		});
	};
	
	$scope.logout_onclick = function () {
		usersService.log_out().then(function (message) {
			if (message == 'succeed') {
				
			} else {

			}
		});
	};
	
//	** AUTHENTICATION CONTROLS **
//	==============================================================================

});

ISDCBlogDApp.controller('MainArticleListController', function ($scope, $rootScope, myBlog, pages, articlesService, usersService, utilService, mainArticleListPages) {
	$scope.articlesService = articlesService;
	$scope.usersService = usersService;
	$scope.utilService = utilService;
	$scope.mainArticleListPages = mainArticleListPages;

	$scope.current_page = 1;

	// ARTICLE LIST - one col || tow col?
	$scope.display_mode = "ONE_COLUMN";

	$scope.is_two_column = function () { return $scope.display_mode === "TWO_COLUMN"; };
	$scope.is_one_column = function () { return $scope.display_mode === "ONE_COLUMN"; };

	$scope.switch_numcol = function (val) {
		switch (val) {
			case 1:
				$scope.display_mode = "ONE_COLUMN"; break;
			case 2:
				$scope.display_mode = "TWO_COLUMN"; break;
		}
	};

	$scope.get_current_page = function () { return $scope.current_page; };

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
		articlesService.article_detail(article.article_id);
		$scope.set_current_art_id(article.article_id);

		isdcng_blog.slide_up_disappear(document.getElementById('main-article-list'), function () {
			isdcng_blog.slide_down_appear(document.getElementById('main-article'));

			$scope.breadcrumbService.set_locations([ ['Home', ''], ['Blog', function () { $scope.back_to_article_list(); }],
					['Article List', function () { $scope.back_to_article_list(); }], ['Article - ', ''] ]);

			$scope.$apply();
		});
	};

});

ISDCBlogDApp.controller('MainArticleController', function ($scope, articlesService, $http, $sanitize) {

	$scope.articlesService = articlesService;

	$scope.current_article = function () {
		return articlesService.cache_article_details[$scope.current_article_id]; };

	$scope.like_onclick = function () {
		if (!$scope.current_article().liked_by_self) {
			articlesService.like_article($scope.current_article_id, true);
		} else {
			articlesService.like_article($scope.current_article_id, false); }
	};
	
	$scope.dislike_onclick = function () {
		if (!$scope.current_article().disliked_by_self) {
			articlesService.dislike_article($scope.current_article_id, true);
		} else {
			articlesService.dislike_article($scope.current_article_id, false); }
	};

	// TODO: Post Article
	$scope.post_comment = function () {
		var data = {
			content: document.getElementById('comment-field').value };

		$http.post('/articles/' + $scope.current_article_id + "/comment", data)
			.success(function (data, status, headers, config) {
				articlesService.article_detail($scope.current_article().article_id);

				document.getElementById('comment-field').value = '';
			})
			.error(function (data, status, headers, config) {
				if (status == 404) {

				} else if (status == 500) {

				} else if (status == 401) {
					
				}
			});
	};
});

ISDCBlogDApp.controller('NewArticleController', function ($scope, $http) {
	
	$scope.tags = [ ];
	
	$scope.add_tag = function () {
		$scope.tags.push($('#page-new-article-tag-input').val());	
		document.getElementById('page-new-article-tag-input').value = '';
	};
	
	$scope.generate_n_split = function (text) {
		// TODO: this is a setting option to be customized
		marked.setOptions({
			gfm: true, tables: true, breaks: false,
			smartLists: true, smartypants: true,
			highlight: function (code) {
				return hljs.highlightAuto(code).value; }
		});
		
		document.getElementById('page-new-article-preview-content-t').innerHTML =
			marked(text);
		
		$('#page-new-article-preview-paragraphs').empty();
		var last_child = $('<div></div>').addClass('page-new-article-preview-paragraph');
		$('#page-new-article-preview-paragraphs').append(last_child);
		
		var len = $('#page-new-article-preview-content-t > *').length;
		$('#page-new-article-preview-content-t > *').each(function (index, element) {
			last_child.append(element);
			
			var tag = element.nodeName;
			// TODO: this is a setting option to be customized, an 'in' syntax
			if (index < (len - 1) && (tag == 'P' || tag == 'UL' || tag == 'PRE')) {
				var new_element = $('<div></div>').addClass('page-new-article-preview-paragraph');
				$('#page-new-article-preview-paragraphs').append(new_element);
				last_child = new_element;
			}
		});
	}
	
	$scope.showPreview = function () {
		
		$scope.generate_n_split(document.getElementById('page-new-article-content').value);
		
		// show preview modal and refersh its layout
		$('#page-new-article-preview-modal').modal('show', function () {
			$('#page-new-article-preview-modal').modal('refresh'); });
	};
	
	$scope.post_article_onclick = function () {
		
		if ($('#new-article-form').form('validate form')) {
			
			$scope.generate_n_split(document.getElementById('page-new-article-content').value);
			
			var data = {
				title : document.getElementById('text-title').value,
				title_secondary : document.getElementById('text-second-title').value,
				paragraphs : [ ],
				tags : $scope.tags
			};
			$('#page-new-article-preview-paragraphs > .page-new-article-preview-paragraph').each(function (index, element) {
				data.paragraphs.push(element.innerHTML); });
			
			console.log(data);
			
			$http.post("/articles", data).success(function (data, status, header, config) {
				
			}).error(function (data, status, header, config) {
				if (status == 401) {
					
				} else if (status == 500) {
					
				} else {
					
				}
			});
		}
	};
	
	$scope.$evalAsync(function () {
		$('#page-new-article-preview-modal').modal();
		
		$('#new-article-form').form({
			username: {
				identifier: 'title',
				rules: [ {
						type : 'length[8]',
						prompt : 'Title must be at least 8 chars.'
					} ]
			},
			password : {
				identifier: 'secondary-title',
				rules: [ {
						type : 'length[6]',
						prompt : 'Secondary title must bt at least 6 chars.'
					} ]
			}
		});
		
	});
	
});

ISDCBlogDApp.controller('PreviewModalController', function ($scope) {
	
});

ISDCBlogDApp.controller('LoginModalController', function ($scope, usersService) {
	
	$scope.modal_status = 'login';

	$scope.login_onclick = function () {
		if ($('#login-modal-login-form').form('validate form')) {
			var username = document.getElementById('login-modal-login-name').value;
			usersService.try_login(username, document.getElementById('login-modal-login-passwd').value)
				.then(function (message) {
					console.log(message);
					if (message == 'succeed') {
						$scope.set_login_message('Login succeed.', 'message');
						setTimeout(function () {
							document.getElementById('login-modal-login-name').value =
								document.getElementById('login-modal-login-passwd').value = 
									'';
							$('#login-modal').modal('hide');
							$scope.clear_login_message();
						}, 1000);
					} else {
						var msg = 'Login failed';
						if (message === 'user-not-found') {
							msg = 'No user called \'' + username + '\'.';
							document.getElementById('login-modal-login-name').focus();
						} else if (message === 'server-error') {
							msg = 'Login failed due to unknown server fault.';
						} else if (message === 'auth-failed') {
							msg = 'Invalid password.';
							document.getElementById('login-modal-login-passwd').focus();
						}
						$scope.set_login_message(msg, 'error');
					}
				});
		} else {
			isdcng_blog.slide_update_height(document.getElementsByClassName('slides')[0]);
			$scope.set_login_message('Invalid information.', 'error');
		}
	};
	
	$scope.register_onclick = function () {
		if ($('#login-modal-reg-form').form('validate form')) {
			usersService.try_register(document.getElementById('login-modal-reg-username').value, 
				document.getElementById('login-modal-reg-passwd').value, document.getElementById('login-modal-reg-email').value)
				.then(function (message) {
					console.log(message);
					if (message == 'succeed') {
						$scope.set_login_message('Register succeed.', 'message');
						setTimeout(function () {
							isdcng_blog.slide_to_prev(document.getElementById('login-modal-reg-username'));
							$scope.modal_status = 'login'; $scope.$apply();
						}, 1000);
					} else {
						var msg = 'Register failed.';
						if (message === 'server-error') {
							msg = 'Register failed due to unknown server fault.';
						} else if (message === 'invalid-request') {
							msg = 'Invalid information.';
						}
						$scope.set_login_message(msg, 'error');
					}
				});
		} else {
			isdcng_blog.slide_update_height(document.getElementsByClassName('slides')[0]);
			$scope.set_login_message('Invalid information.', 'error');
		}
	};
	
	$scope.switch_to_register_page = function () {
		isdcng_blog.slide_to_next(document.getElementById('login-modal-reg-switch'));
		$scope.modal_status = 'register';
	};
	
	$scope.login_message = '';
	
	$scope.set_login_message = function (message, msg_type) {
		var msg_ele = document.getElementById('login-modal-message');
		var new_color = '#000000';
		
		if (msg_type == 'message') {
			new_color = '#00EE00';
		} else if (msg_type == 'error') {
			new_color = '#EE0000';
		}
		
		$scope.login_message = message.toString();
		msg_ele.style.color = new_color;
		
		setTimeout(function () {
			msg_ele.style.color = '#000000';
		}, 500);
	};
	
	$scope.clear_login_message = function () {
		$scope.login_message = ''; };
		
	$scope.$evalAsync(function () {
		
		$('#login-modal').modal({
			onShow: function () { $('.ui.checkbox').checkbox(); },
			selector: {
				// github.com/Semantic-Org/Semantic-UI/issues/432
				close: '.close.icon, #login-modal-cancel'
			}
		});
		
		$('#login-modal-login-form').form({
			username: {
				identifier: 'username',
				rules: [ {
						type : 'length[3]',
						prompt : 'Username must be at least 3 chars.'
					} ]
			},
			password : {
				identifier: 'passwd',
				rules: [ {
						type : 'length[6]',
						prompt : 'Password must bt at least 6 chars.'
					} ]
			}
		});
		
		$('#login-modal-reg-form').form({
			username: {
				identifier: 'username',
				rules: [ {
					type : 'length[3]',
					prompt : 'Username must be at least 3 chars.'
				} ]
			},
			password : {
				identifier: 'passwd',
				rules: [ {
					type : 'length[6]',
					prompt : 'Password must be at least 6 chars.'
				} ]
			},
			email : {
				identifier: 'email',
				rules: [ {
					type : 'email',
					prompt : 'Invalid email.'
				} ]
			}
		});
	});
		
});