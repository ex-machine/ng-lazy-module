(function (angular) {
	'use strict';
	var moduleOrig = angular.module;

	angular.module = function () {
		var moduleInstance = moduleOrig.apply(this, arguments);

		moduleInstance.config(['$provide', '$animateProvider', '$filterProvider', '$controllerProvider', '$compileProvider', function ($provide, $animateProvider, $filterProvider, $controllerProvider, $compileProvider) {
			moduleInstance.lazy = moduleInstance.lazy || {
				provider: $provide.provider,
				factory: $provide.factory,
				service: $provide.service,
				value: $provide.value,
				constant: $provide.constant,
				decorator: $provide.decorator,
				animation: $animateProvider.register,
				filter: $filterProvider.register,
				controller: $controllerProvider.register,
				directive: $compileProvider.directive
			};
		}]);

		return moduleInstance;
	};
})(angular);
