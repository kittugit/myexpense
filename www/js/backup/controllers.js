angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('FriendsCtrl', function($scope, Friends) {
  $scope.friends = Friends.all();
})

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
})

.controller('CateggoryCtrl', function($scope, $cordovaSQLite) {
   
  $scope.save = function(category_name){
  
  var db = $cordovaSQLite.openDB({ name: "myexpense.db" });
  var query = "INSERT INTO category (name) VALUES (?)";
    $cordovaSQLite.execute(db, query, [category_name]).then(function(res) {
      alert('inserted');
    }, function (err) {
      alert('error' + err);
    });
	
  
  };
  
   $scope.get = function(){
  
  var db = $cordovaSQLite.openDB({ name: "myexpense.db" });
  var query = "SELECT name From category";
    $cordovaSQLite.execute(db, query, []).then(function(res) {
                   
	  }, function (err) {
      alert('error' + err);
    });
  
  };
})

.controller('ExpenseCtrl', function($scope, $rootScope) {
    $scope.data = $rootScope.data;
  }
)

.controller('SheetCtrl', function($scope, $cordovaSQLite, loadData) {
   loadData.fn();
  $scope.save = function(sheet_name){
  
  var db = $cordovaSQLite.openDB({ name: "myexpense.db" });
  var query = "INSERT INTO sheet (name) VALUES (?)";
    $cordovaSQLite.execute(db, query, [sheet_name]).then(function(res) {
      alert('inserted' + res);
    }, function (err) {
      alert('error' + err);
    });
  
  };
});
