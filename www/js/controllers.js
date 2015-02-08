angular.module('starter.controllers', [])

.controller('CategoryCtrl', function($scope, Categories, $ionicPopup) {
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
  	 	var confirmPopup = $ionicPopup.confirm({
   		  title: 'Remove Category',
     		template: 'Are you sure you want to remove the category?'
   		});
   		confirmPopup.then(function(res) {
     		if(res) {
     			Categories.remove(category_id).then(function(){
					init();
				});
       				console.log('You are sure');
     		} else {
       console.log('You are not sure');
     }
   });
 };


    $scope.$on('$ionicView.beforeEnter', init);
	
})

.controller('SheetCtrl', function($scope, Sheet, $ionicPopup) {
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
  	 	var confirmPopup = $ionicPopup.confirm({
   		  title: 'Remove Sheet',
     		template: 'Are you sure you want to remove the sheet?'
   		});
   		confirmPopup.then(function(res) {
     		if(res) {
     			Sheet.remove(sheet_id).then(function(){
					init();
				});
       				console.log('You are sure');
     		} else {
       console.log('You are not sure');
     }
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
		Categories.getDefaultCategory().then(function(default_cat){	
			if(default_cat && default_cat.id) {
				$scope.expense.category_id = default_cat.id;				
			}			
		});

		Expense.getWorkingSheet().then(function(sheet_id){	
			if(sheet_id) {
				$scope.expense.sheet_id = sheet_id;
			}			
		});
		$scope.expense.date = new Date();
	};
    $scope.$on('$ionicView.beforeEnter', init);

	
	 $scope.add = function(expenseForm, expense){
	 	 if(!expenseForm.$invalid) {
	    	Expense.add(expense).then(function(){
		   		console.log('Expense is added');
		   		$rootScope.$broadcast('addExpense');
		   		$scope.expense = {};
		   		$scope.expense.sheet_id = expense.sheet_id;
		   		$scope.expense.date = new Date();
		   		$scope.expense.category_id = Categories.getDefaultCategory().id;	
		   		expenseForm.$submitted = false;
		 	});
		 }
	 };
})
.controller('ChartCtrl', function($scope, Sheet, Expense){// Chart.js Data
$scope.sheets = [];
$scope.expense_group = [];

var init = function(){
	Sheet.get().then(function(sheets){
		$scope.sheets = sheets;
	});

	Expense.getWorkingSheet().then(function(sheet_id){	
			 if(sheet_id) {
			   	$scope.exp = {sheet_id : sheet_id };
				showChart(sheet_id);
					
			}			
		});
	};
  var showChart = function(sheet_id_sel){

  		Expense.groupByCategory(sheet_id_sel).then(function(expense_grp){
	var charData = [];
	var charOptions = [];
	var legend_template = "";
	var colors = ['#F7464A', '#46BFBD','#FDB45C', '#4747A5', '#297A29', '#B26B00', '#6C1943', '#297A29', '#2952A3'];
	var  highlights = ['#FF5A5E', '#5AD3D1', '#FFC870', '#6C6CB7', '#65A065', '#C18933', '#A16C87', '#549554', '#5475B5'];
	
	  
	  if(expense_grp && Object.getOwnPropertyNames(expense_grp).length > 0){
	     var i = 0;
	     //var legend_template = '<% for (var i=0; i<segments.length; i++){%><div class=\"row\"><div class=\"col col-75\" style=\"background-color:<%=segments[i].fillColor%>\"><%if(segments[i].label){%><%=segments[i].label%><%}%></div></div><%}%>';

	     for(var cat in expense_grp){
		    charData.push({ value: expense_grp[cat], color: colors[i%colors.length], highlight: highlights[i%highlights.length], label: cat });
			i++;
	     }
	     legend_template = '<% for (var i=0; i<segments.length; i++){%><div class=\"row\"><div class=\"col col-75\" style=\"background-color:<%=segments[i].fillColor%>\"><%if(segments[i].label){%><%=segments[i].label%><%}%></div>  <div class=\"col\" style=\"background-color:<%=segments[i].fillColor%>\"><%if(segments[i].value){%><%=segments[i].value%><%}%></div></div>  <%}%>';
		 
		  
		 
		}
		charOptions = { responsive: true, segmentShowStroke : true, segmentStrokeColor : '#fff', segmentStrokeWidth : 2, percentageInnerCutout : 0, animationSteps : 100, animationEasing : 'easeOut',
								animateRotate : true, animateScale : false, legendTemplate : legend_template
							};
		$scope.chart = { data: charData, options: charOptions}
	});


  };
  $scope.showChart = showChart;

    $scope.$on('$ionicView.beforeEnter', init);
	
})
.controller('ExpenseListCtrl', function($scope, $rootScope, Expense, Sheet, $ionicPopup){
	$scope.expenses_rpt = [];		
	var init = function(){
		
		Sheet.get().then(function(sheets){	
			$scope.sheets = sheets;
		});
		$scope.expenses_rpt = [];
		Expense.getWorkingSheet().then(function(sheet_id){	
			 if(sheet_id) {
			   	$scope.list = {sheet_id : sheet_id };
				getBySheetId(sheet_id);
					
			}			
		});
	 };

	  var getBySheetId = function(sheet_id_sel) {
	 	Expense.getBySheetId(sheet_id_sel).then(function(expenses_result){
			$scope.expenses_rpt = expenses_result;
		});

		Expense.getTotalBySheetId(sheet_id_sel).then(function(sheet_total){
  			$scope.data = { total: sheet_total};
  		});
	 };

	 $scope.getBySheetId = getBySheetId;

	 $scope.remove = function(expense_id) {
  	 	var confirmPopup = $ionicPopup.confirm({
   		  title: 'Remove Expense',
     		template: 'Are you sure you want to remove the expense?'
   		});
   		confirmPopup.then(function(res) {
     		if(res) {
     			Expense.remove(expense_id).then(function(){
					init();
				});
       				console.log('You are sure');
     		} else {
       console.log('You are not sure');
     }
   });
 };

	  
	 $scope.get = init;
     $scope.$on('$ionicView.beforeEnter', init);
	 
	 
});
