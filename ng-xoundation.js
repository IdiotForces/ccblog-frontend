
ISDCNgXoundation = angular.module('isdcng.xoundation.trunk', [ ])
	.filter('idx_odd', function() {
		return function (items) {
			var ret = [ ];
			for (var i = 0; i < items.length; i++)
				if (i % 2 === 0)
					ret.push(items[i]);
			return ret;
		};
	})
	.filter('idx_even', function() {
		return function (items) {
			var ret = [ ];
			for (var i = 0; i < items.length; i++)
				if (i % 2 == 1)
					ret.push(items[i]);
			return ret;
		};
	})
	.filter('idx_odd_e', function () {
		return function (items, enabled) {
			if (enabled === undefined) enabled = true;
			var ret = [ ];
			for (var i = 0; i < items.length; i++)
				if (i % 2 === 0 || (!enabled))
					ret.push(items[i]);
			return ret;
		}
	});
