(function (angular) {
	'use strict';
	var moduleOrig = angular.module;

	angular.module = function () {
		var moduleInstance = moduleOrig.apply(this, arguments);

		if (!moduleInstance.lazy) {
			moduleInstance.lazy = {};

			moduleInstance.config(['$provide', '$animateProvider', '$filterProvider', '$controllerProvider', '$compileProvider', '$injector', function ($provide, $animateProvider, $filterProvider, $controllerProvider, $compileProvider, $injector) {
				angular.extend(moduleInstance.lazy, {
					provider: $provide.provider,
					factory: $provide.factory,
					service: $provide.service,
					value: $provide.value,
					constant: $provide.constant,
					decorator: $provide.decorator,
					animation: $animateProvider.register,
					filter: $filterProvider.register,
					controller: $controllerProvider.register,
					directive: $compileProvider.directive,
					config: function (fn) {
						$injector.invoke(fn || angular.noop);
						return this;
					}
				});
			}]);

			moduleInstance.run(['$injector', function ($injector) {
				angular.extend(moduleInstance.lazy, {
					run: function (fn) {
						$injector.invoke(fn || angular.noop);
						return this;
					}
				});
			}]);
		}

		return moduleInstance;
	};
})(angular);
