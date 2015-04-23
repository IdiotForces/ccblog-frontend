ISDCBlogDemoModule = angular.module('isdcng.blogdemo.devtest', [ ]);

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

var articles = [
	{
		article_id: 0,
		author_id: 0,
		title: '苏共亡党亡国二十年祭', title_secondary: '苏共为何亡党亡国，以及我们从中得到的启示。',
		summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
		date: '96-12-08',
		category: ['毛概']
	},

	{
		article_id: 1,
		author_id: 1,
		title: '人脑计算机展望', title_secondary: '如何取得人脑的 root 权限？基础带你一探究竟。',
		summary: 'The early chapters are organized in order of conceptual difficulty, starting',
		date: '96-12-08',
		category: ['基础', '人脑计算机']
	},

	{
		article_id: 2,
		author_id: 1,
		title: '人脑计算机展望2', title_secondary: '如何取得人脑的 root 权限？基础带你一探究竟。',
		summary: 'The early chapters are organized in order of conceptual difficulty, starting',
		date: '96-12-08',
		category: ['基础', '人脑计算机']
	},

	{
		article_id: 3,
		author_id: 1,
		title: '人脑计算机展望3', title_secondary: '如何取得人脑的 root 权限？基础带你一探究竟。',
		summary: 'The early chapters are organized in order of conceptual difficulty, starting',
		date: '96-12-08',
		category: ['基础', '人脑计算机']
	},

	{
		article_id: 4,
		author_id: 1,
		title: '人脑计算机展望4', title_secondary: '如何取得人脑的 root 权限？基础带你一探究竟。',
		summary: 'The early chapters are organized in order of conceptual difficulty, starting',
		date: '96-12-08',
		category: ['基础', '人脑计算机']
	},

	{
		article_id: 5,
		author_id: 1,
		title: '人脑计算机展望5', title_secondary: '如何取得人脑的 root 权限？基础带你一探究竟。',
		summary: 'The early chapters are organized in order of conceptual difficulty, starting',
		date: '96-12-08',
		category: ['基础', '人脑计算机']
	},

	{
		article_id: 6,
		author_id: 1,
		title: '人脑计算机展望6', title_secondary: '如何取得人脑的 root 权限？基础带你一探究竟。',
		summary: 'The early chapters are organized in order of conceptual difficulty, starting',
		date: '96-12-08',
		category: ['基础', '人脑计算机']
	},

	{
		article_id: 7,
		author_id: 1,
		title: '人脑计算机展望', title_secondary: '如何取得人脑的 root 权限？基础带你一探究竟。',
		summary: 'The early chapters are organized in order of conceptual difficulty, starting',
		date: '96-12-08',
		category: ['基础', '人脑计算机']
	},

	{
		article_id: 8,
		author_id: 1,
		title: '人脑计算机展望2', title_secondary: '如何取得人脑的 root 权限？基础带你一探究竟。',
		summary: 'The early chapters are organized in order of conceptual difficulty, starting',
		date: '96-12-08',
		category: ['基础', '人脑计算机']
	},

	{
		article_id: 9,
		author_id: 1,
		title: '人脑计算机展望3', title_secondary: '如何取得人脑的 root 权限？基础带你一探究竟。',
		summary: 'The early chapters are organized in order of conceptual difficulty, starting',
		date: '96-12-08',
		category: ['基础', '人脑计算机']
	},

	{
		article_id: 10,
		author_id: 1,
		title: '人脑计算机展望4', title_secondary: '如何取得人脑的 root 权限？基础带你一探究竟。',
		summary: 'The early chapters are organized in order of conceptual difficulty, starting',
		date: '96-12-08',
		category: ['基础', '人脑计算机']
	},

	{
		article_id: 11,
		author_id: 1,
		title: '人脑计算机展望5', title_secondary: '如何取得人脑的 root 权限？基础带你一探究竟。',
		summary: 'The early chapters are organized in order of conceptual difficulty, starting',
		date: '96-12-08',
		category: ['基础', '人脑计算机']
	},

	{
		article_id: 12,
		author_id: 1,
		title: '人脑计算机展望6', title_secondary: '如何取得人脑的 root 权限？基础带你一探究竟。',
		summary: 'The early chapters are organized in order of conceptual difficulty, starting',
		date: '96-12-08',
		category: ['基础', '人脑计算机']
	},
];

ISDCBlogDemoModule.service('articlesService', function () {

	var total_len = function () { return articles.length; };
	var article_list = function (start, end) {
		if (start === null || start < 0)
			start = 0;
		if (end === null || end >= total_len())
			end = total_len();
		var ret = [ ];

		for (var i = start; i < end; i++)
			ret.push(articles[i]);
		return ret;
	};

	var predefined_article = function (article_id) {
		this.article_id = article_id; };

	predefined_article.prototype = {
		article_id: 0,
		title: '中国花了 20 年时间打基础',
		content: [
			{ pid: 0, content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' }
		],
		author_id: 0,
		author_name: 'Windas',
		comments: [
			// { content: '打基础是大事。' }
		]
	};

	return {
		total_len: total_len,
		article_list: article_list,

		// you cannot return the predefined var directly
		// 	or it would cause an 'infdig'
		article_detail: function (article_id) {
			return new predefined_article(article_id); }
	};
});

ISDCBlogDemoModule.service('usersService', function () {

	var get_userinfo = function (id) {
		return users[id]; };

	return {
		get_userinfo: get_userinfo
	};
});
