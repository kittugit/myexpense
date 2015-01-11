// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

angular.module('starter', ['ionic', 'starter.controllers', 'starter.api', 'ngCordova', 'tc.chartjs'])

.run(function($ionicPlatform, $cordovaSQLite, $rootScope, Categories, Sheet) {
  $ionicPlatform.ready(function() {
   if(navigator && navigator.splashscreen){
   		navigator.splashscreen.hide();
   }
   Categories.init();
	Sheet.init();
   
	
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
	
	
	
	
	});
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html"
	
  })

  
 .state('tab.expense', {
    url: '/expense',
    views: {
      'tab-expense': {
        templateUrl: 'templates/tab-expense.html',
        controller: 'ExpenseCtrl'
      }
    }
  })
  .state('tab.expenselist', {
    url: '/expenselist',
    views: {
      'tab-expenselist': {
		templateUrl: 'templates/tab-expenselist.html',
        controller: 'ExpenseListCtrl'
		}
    }
  })
  .state('tab.expensechart', {
    url: '/expensechart',
    views: {
      'tab-expensechart': {
		templateUrl: 'templates/tab-expensechart.html',
        controller: 'ChartCtrl'
		}
    }
  })
  .state('tab.category', {
    url: '/category',
    views: {
      'tab-category': {
        templateUrl: 'templates/tab-category.html',
        controller: 'CategoryCtrl'
      }
    }
  })
  .state('tab.sheet', {
    url: '/sheet',
    views: {
      'tab-sheet': {
        templateUrl: 'templates/tab-sheet.html',
        controller: 'SheetCtrl'
		}
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/expense');

});
