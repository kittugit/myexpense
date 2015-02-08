var apiModule = angular.module('starter.api', []);
var db;

if (window.sqlitePlugin !== undefined) {
    db = window.sqlitePlugin.openDatabase("myexpensedbtest");
 } else {
 	 db =  openDatabase('myexpensedbtest', '1.0', 'myexpensedbtest', 2 * 1024 * 1024);
 }



apiModule.factory('Categories', function($q) {

   var init = function(){
		 db.transaction(function (tx) {
	 			tx.executeSql('CREATE TABLE IF NOT EXISTS category(id integer primary key autoincrement, name text not null, created_on int not null)');
	 			console.log("after create");
	 		    
	 	})
	};
  
   var addCategory = function(category){
   	var deferred = $q.defer();

	db.transaction(function (tx) {
    		var now = (new Date()).getTime();
    		var insertSQL = 'INSERT INTO category (name, created_on) VALUES (?, ?)';
     		tx.executeSql(insertSQL, [category, now ]);
 			console.log('after insert categories');
			deferred.resolve(true);
			
	});
	 return deferred.promise; 
   };
   
   var removeCategory = function(id){
	
	var deferred = $q.defer();
	db.transaction(function (tx) {
    		var deleteSQL = 'DELETE FROM category where id = ?';
     		tx.executeSql(deleteSQL, [id]);
 			console.log('after delte category');
			deferred.resolve(true);
			
	});
	 return deferred.promise; 
   };
   
    var getCategoryName = function(id){
   		var deferred = $q.defer();
   		
       	getCategoryById(id).then(function(cat) {
       		
		   	deferred.resolve(cat.name);	
		 });
        return deferred.promise; 		
    };
   
  var getCategoryByName = function(cat_name){
		var deferred = $q.defer();
		
		db.transaction(function (tx) {
	    tx.executeSql("select id, name from category where name = ? order by id desc", [cat_name], function(tx, res) {
	 	   	var category = {id: res.rows.item(0).id, name: res.rows.item(0).name};
		   	
		   	deferred.resolve(category);	
		 });
	 });
	 return deferred.promise; 		
   };
   
   var getDefaultCategory = function(){
   		var deferred = $q.defer();   		
       	getCategoryByName('Groceries').then(function(cat) {
       		deferred.resolve(cat);	
		 });
        return deferred.promise; 		
    };
 
      
   var getCategories = function(){
	var deferred = $q.defer();
	
	db.transaction(function (tx) {
	    tx.executeSql("select id, name from category order by id desc", [], function(tx, res) {
	 	var categories = [];  
		   for (var i = 0; i < res.rows.length; i++) {
		   	categories.push({id: res.rows.item(i).id, name: res.rows.item(i).name});
		   	};
		   	console.log("after category select" + categories);
		   	
		   	deferred.resolve(categories);	
		 });
	 });
	 return deferred.promise; 
   };

   
   var getCategoryById = function(id){
		var deferred = $q.defer();
		
		db.transaction(function (tx) {
	    tx.executeSql("select id, name from category where id = ?", [id], function(tx, res) {
	 	   	var category = {id: res.rows.item(0).id, name: res.rows.item(0).name};
		   	
		   	deferred.resolve(category);	
		 });
	 });
	 return deferred.promise; 		
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

	var init = function(){
		 db.transaction(function (tx) {
	 			tx.executeSql('CREATE TABLE IF NOT EXISTS expense(id integer primary key autoincrement, sheet_id integer not null,  category_id integer not null, amount real not null, date int not null, description text, created_on int not null)');
	 			console.log("after expense create");
	 		    
	 	})
	};

var addExpense = function(expense){
   	
	var deferred = $q.defer();

	db.transaction(function (tx) {
    		var now = (new Date()).getTime();
    		var insertSQL = 'INSERT INTO expense (sheet_id, category_id, amount, date, description, created_on) VALUES (?, ?, ?, ?, ?, ?)';
     		tx.executeSql(insertSQL, [expense.sheet_id, expense.category_id, expense.amount, expense.date.getTime(), expense.description,  now ], function(res) { console.log("expense is addeed");}, function(transaction, err) { console.log("SQL Erroor while addeing expense" + err.message);});
 			console.log('after insert expense');
			deferred.resolve(true);
			
	});
	 return deferred.promise; 
   };

   var expenses = [];
   
   var getWorkingSheet = function(){
   	var deferred = $q.defer();
	db.transaction(function (tx) {
    tx.executeSql("select e.sheet_id from expense as e where e.id = (select ifnull(max(ie.id),0) from expense as ie)", [], function(tx, res) {
	 	   	if(res && res.rows && res.rows.length > 0 ){
	 	   		deferred.resolve(res.rows.item(0).sheet_id);
	 	   	}		
	 	});
	});
	 return deferred.promise;
   };

   var getExpenses = function(){
		var deferred = $q.defer();
		
		db.transaction(function (tx) {
	    tx.executeSql("select e.id,  c.name, e.amount, e.date, e.description from expense as e,  category as c where e.category_id = c.id order by e.id desc", [], function(tx, res) {
	 	   	var newExpenses = [];
		   for (var i = 0; i < res.rows.length; i++) {
		   	newExpenses.push({id: res.rows.item(i).id, category_name: res.rows.item(i).name, amount: res.rows.item(i).amount, date: res.rows.item(i).date, description: res.rows.item(i).description});
		   	};
		   	console.log("after newExpenses select" + newExpenses);
		   	
		   	deferred.resolve(newExpenses);		
		 });
	 });
	 return deferred.promise; 		
   };

   var getExpensesBySheetId = function(sheet_id){
		var deferred = $q.defer();
		
		db.transaction(function (tx) {
	    tx.executeSql("select e.id,  c.name, e.amount, e.date, e.description from expense as e,  category as c where e.category_id = c.id and e.sheet_id = ?", [sheet_id], function(tx, res) {
	 	   	var newExpenses = [];
		   for (var i = 0; i < res.rows.length; i++) {
		   	newExpenses.push({id: res.rows.item(i).id, category_name: res.rows.item(i).name, amount: res.rows.item(i).amount, date: res.rows.item(i).date, description: res.rows.item(i).description});
		   	};
		   	console.log("after newExpenses select" + newExpenses);
		   	
		   	deferred.resolve(newExpenses);		
		 });
	 });
	 return deferred.promise; 		
   };


   var groupByCategory = function(sheet_id){
		var deferred = $q.defer();
		db.transaction(function (tx) {
	    tx.executeSql("select c.name, sum(e.amount) as amount from expense as e,  category as c where e.category_id = c.id and e.sheet_id = ? group by c.name", [sheet_id], function(tx, res) {
	 	   	var byCategory = {};
	 	   	for (var i = 0; i < res.rows.length; i++) {
		   		byCategory[res.rows.item(i).name] = res.rows.item(i).amount;
		   	};		   	
		   	deferred.resolve(byCategory);		
		 }, function(transaction, err) { console.log("SQL Erroor while addeing expense" + err.message);});
	 });
	 return deferred.promise; 		
   };


   var getTotalBySheetId = function(sheet_id){
		var deferred = $q.defer();
			
		db.transaction(function (tx) {
	    tx.executeSql("select sum(e.amount) as amount from expense as e where e.sheet_id = ?", [sheet_id], function(tx, res) {
	 	   	deferred.resolve(res.rows.item(0).amount);		
		 }, function(transaction, err) { console.log("SQL Erroor while addeing expense" + err.message);});
	 });
	 return deferred.promise; 		
   }   

     
   
   var removeExpense = function(id){
	
	var deferred = $q.defer();
	db.transaction(function (tx) {
    		var deleteSQL = 'DELETE FROM expense where id = ?';
     		tx.executeSql(deleteSQL, [id]);
 			console.log('after delte expense');
			deferred.resolve(true);
			
	});
	 return deferred.promise; 
   };
   
  
   return {
    init: init,
    add: addExpense,
    get: getExpenses,
    getBySheetId: getExpensesBySheetId,
	remove: removeExpense,
	getWorkingSheet: getWorkingSheet,
	groupByCategory: groupByCategory,
	getTotalBySheetId : getTotalBySheetId
  }

})
.factory('Sheet', function($q) {
   
  
   var init = function(){
   		db.transaction(function (tx) {
	 		tx.executeSql('CREATE TABLE IF NOT EXISTS sheet(id integer primary key autoincrement, name text not null, created_on int not null)');
	 		console.log("after create");
	 		    
	 	})
		//sheets = [{id: 0, name: 'Nov 2014'}, {id: 1, name: 'Dec 2014'}, {id: 2, name: 'Jan 2015'}, {id: 3, name: 'Feb 2015'}];
   };
    var addSheet = function(sheet){
   	
   	
	var deferred = $q.defer();

	db.transaction(function (tx) {
    		var now = (new Date()).getTime();
    		var insertSQL = 'INSERT INTO sheet (name, created_on) VALUES (?, ?)';
     		tx.executeSql(insertSQL, [sheet, now ]);
 			console.log('after insert sheet');
			deferred.resolve(true);
			
	});
	 return deferred.promise; 
   };
   
   var removeSheet = function(id){
	
	var deferred = $q.defer();
	db.transaction(function (tx) {
    		var deleteSQL = 'DELETE FROM sheet where id = ?';
     		tx.executeSql(deleteSQL, [id]);
 			console.log('after delte sheet');
			deferred.resolve(true);
			
	});
	 return deferred.promise; 
   };

   
   var getSheets = function(){
	var deferred = $q.defer();
	
	db.transaction(function (tx) {
	    tx.executeSql("select id, name from sheet order by id desc", [], function(tx, res) {
	 	var sheets = [];  
		   for (var i = 0; i < res.rows.length; i++) {
		   	sheets.push({id: res.rows.item(i).id, name: res.rows.item(i).name});
		   	};
		   	console.log("after sheet select" + sheets);
		   	
		   	deferred.resolve(sheets);	
		 });
	 });
	 return deferred.promise; 
   };


  return {
    add: addSheet,
    remove: removeSheet,
    get: getSheets,
	init: init
  }
});
