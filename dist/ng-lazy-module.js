(function(__root, __factory) { if (typeof define === "function" && define.amd) { define("ng-lazy-module", ["angular"], __factory);} else if (typeof exports === "object") {module.exports = __factory(require("angular"));} else {__root["ng-lazy-module"] = __factory(angular);}})(this, (function(__small$_mod_0) {
var exports = {};
'use strict';

var angular = __small$_mod_0;

var moduleOrig = angular.module;

angular.module = function () {
	var moduleInstance = moduleOrig.apply(this, arguments);

	if (!moduleInstance.lazy) {
		moduleInstance.lazy = {};

		moduleInstance.config(['$provide', '$animateProvider', '$filterProvider', '$controllerProvider', '$compileProvider', '$injector', function ($provide, $animateProvider, $filterProvider, $controllerProvider, $compileProvider, $injector) {
			angular.extend(moduleInstance.lazy, {
				provider: invoker($provide, 'provider'),
				factory: invoker($provide, 'factory'),
				service: invoker($provide, 'service'),
				value: invoker($provide, 'value'),
				constant: invoker($provide, 'constant'),
				decorator: invoker($provide, 'decorator'),
				animation: invoker($animateProvider, 'register'),
				filter: invoker($filterProvider, 'register'),
				controller: invoker($controllerProvider, 'register'),
				directive: invoker($compileProvider, 'directive'),
				component: invoker($compileProvider, 'component'),
				config: invoker($injector, 'invoke', angular.noop)
			});
		}]);

		moduleInstance.run(['$injector', function ($injector) {
			moduleInstance.lazy.run = invoker($injector, 'invoke', angular.noop);
		}]);
	}

	return moduleInstance;
};

function invoker(self, methodName) {
	var defaultArgs = Array.prototype.slice.call(arguments, 2);

	return function () {
		self[methodName].apply(self, arguments.length ? arguments : defaultArgs);
		return this;
	};
}

return exports;
}))