angular.module('starter.api', [])

.factory('Categories', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var categories = [{id: 0, name: 'Gas'}, {id: 1, name: 'Entertaintment'}, {id: 2, name: 'Rent'}, {id: 3, name: 'Shopping'}];
  
   var addCategory = function(category){
	var deferred = $q.defer();
	 categories.push( {id: categories[categories.length -1].id + 1, name: category});
	 deferred.resolve(true);
	 return deferred.promise; 
   };
   
   var removeCategory = function(id){
	var deferred = $q.defer();
	var i =0;
	for(category in categories){
	   i++;
	   if(category.id == id){
	      categories.splice(i,1);		
		  break;	   
	    }
	}	 
	 return deferred.promise; 
   };
   
   var getCategories = function(){
	var deferred = $q.defer();
	 deferred.resolve(categories);	 
	 return deferred.promise; 
   };

  return {
    add: addCategory,
    remove: removeCategory,
    get: getCategories
  }
});
