angular.module('app').controller('Post', function($scope, $http, $location, toastr) {


    $scope.minDate = new Date();

    $scope.opened = false;

    $scope.time = new Date();


    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = !$scope.opened;
    };

    $scope.delete = deletePost;


    function getPost() {
        $http.get('/api/post/' + id).then(function(post) {
            $scope.message = post.data.message;
            var datetime = new Date(post.data.datetime);

            $scope.date = datetime;

            $scope.time = datetime;
        });
    }

    var id = $location.search().id;

    if (isEditingPost()) {
        $scope.isEditing = true;
        getPost();
        $scope.save = editPost;
    } else {
        $scope.save = newPost;
    }

    function newPost() {
        var datetime = new Date($scope.date.getFullYear(), $scope.date.getMonth(), $scope.date.getDate(), $scope.time.getHours(), $scope.time.getMinutes());

        $http.post('/api/post/tweet', {
            message: $scope.message,
            datetime: datetime
        }).then(function() {
            toastr.success("New Post created");
        });
    }

    function editPost() {
        var datetime = new Date($scope.date.getFullYear(), $scope.date.getMonth(), $scope.date.getDate(), $scope.time.getHours(), $scope.time.getMinutes());

        $http.post('/api/post/update/' + id, {
            message: $scope.message,
            datetime: datetime
        }).then(function() {
            toastr.success("Post edited");
        });
    }

    function deletePost() {


        $http.post('/api/post/destroy/' + id).then(function() {
            toastr.info("Post deleted");
        });
    }

    function isEditingPost() {
        return id;
    }
});