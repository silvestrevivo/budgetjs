// ----------------------------------------------------------------------//
// This project is an example of plain JavaScript application
// The compilation in development and production is done with ParcelJS
// Just start npm init to add the configuration modules and that's all
// For this case are imported : node-sass and babel-preset-env
// ----------------------------------------------------------------------//

// import scss to bundle it with ParcelJS
import './style.scss';

// MODULES
// we create an scope with internal and no accesible data from each other
// and as well with publics methods which could be called from outside
// this is possible thanks to closures in JavaScript
// First module => store data
// Second module => store UIactions
// Third module => store general actions / event listeners
// On this way we avoid possible conflicts between data structures

// ----------------------------------------------------------------------//
// module1 - BUDGET CONTROLLER
var budgetControler = (function () {
    // this is private
    // these variables are not accesible from outside
    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
    };

    // this is public
    // we return an object which contains methods they are public
    return {
        addItem: function (type, des, val) {
            var newItem, ID;

            ID = data.allItems[type].length > 0 ?
                data.allItems[type][data.allItems[type].length - 1].id + 1 : 0

            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }
            data.allItems[type].push(newItem);
            console.log('data', data)
            return newItem;
        }
    };
})();

// ----------------------------------------------------------------------//
// module 2 - UI CONTROLLER
var UIController = (function () {
    // this is private - internal scope
    // these variables are not accesible from outside
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list'
    }; // classes stored as variables to be edited

    // this is public -- accesible from outside
    // we return an object which contains methods they are public
    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription)
                    .value,
                value: document.querySelector(DOMstrings.inputValue).value
            };
        },

        addListItem: function (obj, type) {
            var html, newHtml, element;
            // Create HTML string with placeholder text

            if (type === 'inc') {
                element = DOMstrings.incomeContainer
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            } else if (type === 'inc') {
                element = DOMstrings.expensesContainer
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }

            // Replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id)
            newHtml = newHtml.replace('%description%', obj.description)
            newHtml = newHtml.replace('%value%', obj.value)

            // Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml)

        },
        getDOMstring: function (params) {
            return DOMstrings;
        }
    };
})();

// ----------------------------------------------------------------------//
// module 3 - GLOBAL APP CONTROLLER
var controller = (function (budgetCtrl, UICtrl) {
    // ---------- private scope ------------//
    // everything here is private, thus they are not able to be expose
    // to other external functions

    // this function collects all eventListeners that exist in the app
    var setupEventListeners = function () {
        // we get de values from other scopes
        var DOM = UIController.getDOMstring();

        // these are the events listeners
        document
            .querySelector(DOM.inputBtn)
            .addEventListener('click', ctrlAddItem);
        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13 || event.which === 13) {
                //which => for old browsers
                ctrlAddItem();
            }
        });
    };

    var ctrlAddItem = function () {
        // 1. Get the field input data
        var input = UICtrl.getInput();
        // 2. Add the item to the budget controller
        var newItem = budgetCtrl.addItem(input.type, input.description, input.value)
        console.log('input', input);
        console.log('newItem', newItem);
        // 3. Add the item to the UI
        UICtrl.addListItem(newItem, input.type)

    };

    // ---------- public scope ------------//
    return {
        init: function () {
            console.log('application is started');
            setupEventListeners(); // this activate all event listeners
        }
    };
})(budgetControler, UIController);

controller.init(); // this function inicializes the whole application
