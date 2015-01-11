angular.module('starter.controllers', [])

.controller('CategoryCtrl', function($scope, Categories) {
	$scope.categories = [];
	$scope.newcategory ={};
	
	var init = function(){
		$scope.placeholder = 'Category';
		Categories.get().then(function(cats){
			if(cats){
				$scope.categories = cats;
			}
		});
	};	
	
	$scope.add = function(category_name) {
		Categories.add(category_name).then(function(){
			init();
			$scope.placeholder = 'Category';
			$scope.newcategory.name = '';
		});
	};
	$scope.remove = function(category_id) {
		Categories.remove(category_id).then(function(){
			init();
		});
	};
    $scope.$on('$ionicView.beforeEnter', init);
	
})

.controller('SheetCtrl', function($scope, Sheet) {
	$scope.sheets = [];
	$scope.newsheet ={};
	
	var init = function(){
		$scope.placeholder = 'Sheet';
		Sheet.get().then(function(sheets){
		   if(sheets) {
				$scope.sheets = sheets;
			}
		});
	};	
	
	$scope.add = function(sheet_name) {
		Sheet.add(sheet_name).then(function(){
			init();
			$scope.placeholder = 'Sheet';
			$scope.newsheet.name = '';
		});
	};
	$scope.remove = function(sheet_id) {
		Sheet.remove(sheet_id).then(function(){
			init();
		});
	};
    
	$scope.$on('$ionicView.beforeEnter', init);
	
})

.controller('ExpenseCtrl', function($scope, $rootScope, Categories, Sheet, Expense) {
    $scope.expense = {};	
	$scope.categories = [];	
	$scope.sheets = [];
	
	var init = function(){
		Sheet.get().then(function(sheets){	
			$scope.sheets = sheets;
		});
		Categories.get().then(function(categories){	
			$scope.categories = categories;
		});
		var default_cat = Categories.getDefaultCategory();
		if(default_cat && default_cat.id) {
			$scope.expense.category_id = default_cat.id;
		}
		
		Expense.getWorkingSheet().then(function(sheet_id){	
			if(sheet_id) {
				$scope.expense.sheet_id = sheet_id;
			}			
		});
		$scope.expense.date = new Date();
	};
    $scope.$on('$ionicView.beforeEnter', init);

	
	 $scope.add = function(expense){
	    Expense.add(expense).then(function(){
		   console.log('Expense is added');
		   $rootScope.$broadcast('addExpense');
		   $scope.expense = {};
		   $scope.expense.sheet_id = expense.sheet_id;
		   $scope.expense.date = new Date();
		   $scope.expense.category_id = Categories.getDefaultCategory().id;		   
		});
	 };
})
.controller('ChartCtrl', function($scope, Sheet, Expense){// Chart.js Data
$scope.sheets = [];
$scope.expense_group = [];

var init = function(){
	Sheet.get().then(function(sheets){
		$scope.sheets = sheets;
	});
	Expense.groupByCategory().then(function(expense_grp){
	var charData = [];
	var colors = ['#F7464A', '#46BFBD','#FDB45C'];
	var  highlights = ['#FF5A5E', '#5AD3D1', '#FFC870'];
	
	Expense.getWorkingSheet().then(function(sheet_id){	
		     if(sheet_id) {
				$scope.exp = {sheet_id : sheet_id };
			}			
		});
	  if(expense_grp){
	     var i = 0;
		 var charOptions = { responsive: true, segmentShowStroke : false, segmentStrokeColor : '#fff', segmentStrokeWidth : 2, percentageInnerCutout : 0, animationSteps : 100, animationEasing : 'easeOutBounce',
								animateRotate : true, animateScale : false, legendTemplate : '<ul class="tc-chart-js-legend"><% for (var i=0; i<segments.length; i++){%><li><span style="background-color:<%=segments[i].fillColor%>"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>'
							};
	     for(var cat in expense_grp){
		    charData.push({ value: expense_grp[cat], color: colors[i%colors.length], highlight: highlights[i%highlights.length], label: cat });
			i++;
	     }
		 
		 $scope.data = charData;
		 $scope.options =  charOptions;
		}
	});
};

    $scope.$on('$ionicView.beforeEnter', init);
	$scope.showChart = function(sheet_id){
		init();
	};
})
.controller('ExpenseListCtrl', function($scope, $rootScope, Expense, Sheet){
	$scope.expenses_rpt = [];		
	var init = function(){
		Expense.get().then(function(expenses_result){
			$scope.expenses_rpt = expenses_result;
		});
		Sheet.get().then(function(sheets){	
			$scope.sheets = sheets;
		});
		Expense.getWorkingSheet().then(function(sheet_id){	
		     if(sheet_id) {
				$scope.data = {sheet_id : sheet_id };
			}			
		});
	 };
	 
	 $scope.remove = function(expense_id){
	    Expense.remove(expense_id).then(function(){
		     init();
		});	 
	 };
	 
	 $scope.get = init;
     $scope.$on('$ionicView.beforeEnter', init);
	 
	 
});
