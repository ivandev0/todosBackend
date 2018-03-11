var TodoMain = require('./components/TodoMain');
var AddTodos = require('./components/AddTodos');
var TodoList = require('./components/TodoList');
var TodoActionsBar = require('./components/TodoActionsBar');

function init() {
    var todoMain = new TodoMain();
    var addTodos = new AddTodos();
    var todoList = new TodoList();
    var todoActionsBar = new TodoActionsBar();

    addTodos
        .on('newTodo',
            function (todoData) { todoList.createItem(todoData); }
        )
        .on('markAsReadyAll',
            function () { todoList.markAsReadyAll();}
        )
        .on('focus', function() {todoActionsBar.hideTemporally()})
        .on('blur', function() {todoActionsBar.showTemporally()});

    function itemsCountWatcher () {
        var itemsCount = todoList.getActiveItemsCount();

        if (itemsCount !== 0) {
            todoMain.showFullInterface();
        } else if (todoList.getAllItemsCount() === 0){
            todoMain.hideFullInterface();
        } else {
            todoMain.showFullInterface();
        }

        todoActionsBar.setItemsCount(itemsCount);
    }

    todoList.on('itemAdd', itemsCountWatcher)
        .on('itemDelete', itemsCountWatcher)
        .on('itemChange', itemsCountWatcher);

    todoActionsBar.on(
        'clearCompleted',
        function () { todoList.removeCompletedItems(); });

    todoActionsBar.on('filterSelected', function (filterId) {
        todoList.setFilter(filterId);
    });

    //get db data
    function addItems(todosItemInfo){
        if(todosItemInfo !== "[]"){
            for(var i = 0; i < JSON.parse(todosItemInfo).length; i++){
                todoList.createItem({
                    id: JSON.parse(todosItemInfo)[i].id,
                    text: JSON.parse(todosItemInfo)[i].text,
                    isReady: JSON.parse(todosItemInfo)[i].isReady
                });
            }
            //alert(JSON.stringify(JSON.parse(todosItemInfo)[0].text));
        }
    }
    //get request
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", "http://localhost:8080/api/all", true); // true for asynchronous request
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200)
            addItems(xmlHttp.responseText);
    };
    xmlHttp.send(null);

    //save data
    window.onunload = function(){
        var arr = [];
        todoList.getItems().forEach(function (todoItem) {
            arr.push(todoItem.model);
        });

        var url = 'http://localhost:8080/api/add';
        xmlHttp = new XMLHttpRequest();
        xmlHttp.open("POST", url, false);
        xmlHttp.setRequestHeader('Content-type', 'application/json');
        xmlHttp.send(JSON.stringify(arr));
    }

}

document.addEventListener('DOMContentLoaded', init);