// This project is an example of plain JavaScript application
// The compilation in development and production is done with ParcelJS
// Just start npm init to add the configuration modules and that's all
// For this case are imported : node-sass and babel-preset-env

// import scss to bundle it with parcel
import './style.scss';

// import modules
// we create an scope with internal and no accesible data from each other
// and as well with publics methods which could be called from outside
// this is possible thanks to closures in JavaScript

// module1 - BUDGET CONTROLLER
var budgetControler = (function() {
    // this is private
    // this is public
})();

// module 2 - UI CONTROLLER
var UIController = (function() {
    //..
})();

// module 3 - GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl) {
    //internal scope
    document.querySelector('.add__btn').addEventListener('click', function() {
        console.log('Buttom was click');
    });

    // accesible public
})(budgetControler, UIController);

console.log(controller.anotherPublic());
