# ng-lazy-module

Does the same things you would normally do with `angular.module('...')`  but in a leisurely manner.

## Description

This tiny zero-overhead Angular patch provides a set of `lazy.…` methods for each Angular module that reflects [module's own methods](https://docs.angularjs.org/api/ng/type/angular.Module) but can be used *after* the modules have been bootstrapped.

E.g. a new directive `angular.module('...').lazy.directive(...)` can be defined within existing app components and compiled then.

The exceptions are `config` and `run` which cannot be used to define new config/run blocks when the respective phases are over.

## Install

### NPM

    npm install --save ng-lazy-module

### Bower

    bower install --save ng-lazy-module

## Usage

`ng-lazy-module.js` is loaded after `angular.js` and before Angular modules. 

Let the example [speak for itself](http://plnkr.co/edit/yyl5KwVrgKYmsszHNP4I?p=preview).

```javascript
angular.module('lazy', []);

var app = angular.module('app', ['lazy']);

app.controller('AppController', function ($scope, $element, $compile, $q, lazyLoader, appService) {
  appService.value = appService.value.replace('%s', 'early controller');

	lazyLoader.then(function (lazyState) {
		// so long, recursive compilation compilation compilation!
		return lazyState.defined ? $q.reject(lazyState) : lazyState;
	})
	.then(function (lazyState) {
		lazyState.defined = true;
		$compile($element)($scope);
	});
});

app.value('appService', {
  value: '%s gets the worm'
});

app.factory('lazyLoader', function ($q, $compile, $timeout) {
	var lazyModuleChunk = $timeout(function () {
		var lazyModule = angular.module('lazy');

		// it is hard to steal the worm from early bird when you're lazy
		lazyModule.lazy.decorator('appService', function ($delegate) {
			return { 
			  value: $delegate.value.replace('%s', 'lazy decorator')
			};
		});		

		lazyModule.lazy.provider('lazyService', function () {
			this.value = 'lazy service';

			this.$get = function () {
				return this.value;
			};
		});		

		lazyModule.lazy.constant('lazyConstant', 'lazy constant');
	}, 2000);

	var lazierModuleChunk = $timeout(function () {
		var lazyModule = angular.module('lazy');

		lazyModule.lazy.directive('lazyDirective', function (lazyService) {
			return {
				template: 'lazy directive<br>{{appService.value}}',
				controller: 'LazyController',
			};
		});

		lazyModule.lazy.controller('LazyController', function ($scope, lazyConstant, appService) {
			$scope.appService = appService;
		});
	}, 3000);

	var lazyState = {};

	return $q.all([lazyModuleChunk, lazierModuleChunk]).then(function () {
		return lazyState;
	});
});
```

## Pitfalls

### Precedence

The things can become too messy and complicated when there are several lazy modules that depend on each other. Although solid promise chains may minimize the possibility of having missing dependencies and maintain app design in a good shape.

### Decoration

`lazy.decorator` was introduced as well, but its usage could be justified rarely. It won't have an effect on the services which were injected into advance module components and thus, instantiated (as the example shows).

### Chaining

`lazy.…` methods return another `lazy` object, not `module`. The proper chaining syntax for lazy components is

```javascript
angular.module('...').lazy
	.directive(...)
	.controller(...);
```