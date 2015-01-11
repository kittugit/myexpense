angular.module('starter.api', [])


.factory('Categories', function($q) {
   var categories = [];  
   var init = function(){
        categories = [{id: 0, name: 'Gas'}, {id: 1, name: 'Entertaintment'}, {id: 2, name: 'Rent'}, {id: 3, name: 'Shopping'}, {id: 4, name: 'Groceries'}];
   };
  
   var addCategory = function(category){
	var deferred = $q.defer();
	categories.push( {id: categories[categories.length -1].id + 1, name: category});
	 console.log('after add' + categories);
	 deferred.resolve(true);
	 return deferred.promise; 
   };
   
   var removeCategory = function(id){
	var deferred = $q.defer();
	for(idx in categories){
	   if(categories[idx].id == id){
	      console.log('matched id' + id);
	      categories.splice(idx,1);		
		  break;	   
	    }
	}	 
	 return deferred.promise; 
   };
   
   
   var getCategoryByName = function(name){
	for(var i in categories){
		if(categories[i].name == name){
			return categories[i];
		}
	}		
   };
   
   var getDefaultCategory = function(){
       return getCategoryByName('Groceries');
   };
      
   var getCategories = function(){
	var deferred = $q.defer();
	 deferred.resolve(categories);	 
	 return deferred.promise; 
   };
   
   var getCategoryName = function(id){
	for(i in categories){
		if(categories[i].id == id){
			return categories[i].name;
		}
	}		
   };
   

  return {
    add: addCategory,
    remove: removeCategory,
    get: getCategories,
	init: init,
	getCategoryName: getCategoryName,
	getDefaultCategory: getDefaultCategory	
	
  }
})

.factory('Expense', function($q, Categories) {
   var expenses = [];
   var addExpense = function(expense){
     if(expenses.length == 0){
		expense.id = 0;
	 }else{
	    expense.id = expenses[expenses.length -1].id + 1
	 }
     
     var deferred = $q.defer();
     expenses.push(expense);
	 deferred.resolve(true);
	 console.log('after add' + expenses);
	 return deferred.promise;
   };
   
   var getWorkingSheet = function(){
		var deferred = $q.defer();
		if(expenses.length == 0){
		    deferred.resolve(undefined);
		}else{
		   deferred.resolve(expenses[expenses.length - 1].sheet_id);
		}
	return deferred.promise;
   
   };
   
   var getExpenses = function(){
     var deferred = $q.defer();
	 var newExpenses = [];
	 for(var i in expenses){
	    var newExpense = expenses[i];
		console.log('expense id' + newExpense.category_id);
		newExpense.category_name =  Categories.getCategoryName(newExpense.category_id);
		console.log("Category name "  + Categories.getCategoryName(newExpense.category_id));
		console.log(newExpense.category_name);
		console.log('after category_name' + JSON.stringify(newExpense));
		newExpenses.push(newExpense);
	 }
	 deferred.resolve(newExpenses);
	 console.log('after get' + newExpenses);
	 return deferred.promise;
   };
      
   var groupByCategory = function(sheet_id){
		var deferred = $q.defer();
		var byCategory = {};
		var totalExpense = 0;
		for(var i in expenses){
		  if(expenses[i].category_id){
		      var cat_name = Categories.getCategoryName(expenses[i].category_id);
			if(byCategory[cat_name]){
			  byCategory[cat_name] += expenses[i].amount;
			}else{
			  byCategory[cat_name] = expenses[i].amount;
			}   
						
			}
		}
		deferred.resolve(byCategory);
     return deferred.promise;
   };
   
   var removeExpense = function(id){
	var deferred = $q.defer();
	for(idx in expenses){
	   if(expenses[idx].id == id){
	      console.log('matched id' + id);
	      expenses.splice(idx,1);		
		  break;	   
	    }
	}	 
	 return deferred.promise; 
   };
   
   return {
    add: addExpense,
    get: getExpenses,
	remove: removeExpense,
	getWorkingSheet: getWorkingSheet,
	groupByCategory: groupByCategory
  }

})
.factory('Sheet', function($q) {
   var sheets = [];
  
   var init = function(){
		sheets = [{id: 0, name: 'Nov 2014'}, {id: 1, name: 'Dec 2014'}, {id: 2, name: 'Jan 2015'}, {id: 3, name: 'Feb 2015'}];
   };
  
   var addSheet = function(sheet){
	var deferred = $q.defer();
	sheets.push( {id: sheets[sheets.length -1].id + 1, name: sheet});
	 console.log('after add' + sheets);
	 deferred.resolve(true);
	 return deferred.promise; 
   };
   
   var removeSheet = function(id){
	var deferred = $q.defer();
	for(idx in sheets){
	   if(sheets[idx].id == id){
	      console.log('matched id' + id);
	      sheets.splice(idx,1);		
		  break;	   
	    }
	}	 
	 return deferred.promise; 
   };
   
   var getSheets = function(){
	var deferred = $q.defer();
	 deferred.resolve(sheets);	 
	 return deferred.promise; 
   };

  return {
    add: addSheet,
    remove: removeSheet,
    get: getSheets,
	init: init
  }
});
