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

    var calculateTotal = function (type) {
        var sum = 0;
        data.allItems[type].forEach(function (current) {
            sum = sum + current.value;
        });
        data.totals[type] = sum;
    };

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
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
            //console.log('data', data)
            return newItem;
        },

        deleteItem: function (type, id) {
            var ids, index;

            ids = data.allItems[type].map(function (current, index, array) {
                return current.id;
            });

            index = ids.indexOf(id);


            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
        },

        calculateBudget: function () {

            // calculate all income and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            // calculate the budget
            data.budget = data.totals.inc - data.totals.exp;

            // calculate the percentage
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
        },

        getBudget: function () {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
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
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container'
    }; // classes stored as variables to be edited

    // this is public -- accesible from outside
    // we return an object which contains methods they are public
    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription)
                    .value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },

        addListItem: function (obj, type) {
            var html, newHtml, element, fieldsArr;
            // Create HTML string with placeholder text

            if (type === 'inc') {
                element = DOMstrings.incomeContainer
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }

            // Replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            // Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        },

        deleteListItem: function (selectorID) {
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },

        clearFields: function () {
            var fields, fieldsArr;
            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

            // what we get is an Array and we have to convert it in something editable in the DOM
            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function (current, index, array) {
                current.value = '';
            })

            fieldsArr[0].focus();
        },

        displayBudget: function (obj) {

            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;

            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }

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

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem)

    };

    var updateBudget = function () {

        //1. Calculate the budget
        budgetCtrl.calculateBudget();

        //2. Return the budget
        var budget = budgetCtrl.getBudget();

        //3. Display the budget on the UI
        UICtrl.displayBudget(budget);

    };

    var ctrlAddItem = function () {

        // 1. Get the field input data
        var input = UICtrl.getInput();

        if (input.description !== '' && !isNaN(input.value) && input.value > 0) {

            // 2. Add the item to the budget controller
            var newItem = budgetCtrl.addItem(input.type, input.description, input.value)

            // 3. Add the item to the UI
            UICtrl.addListItem(newItem, input.type);

            // 4. Clear the fields
            UICtrl.clearFields();

            // 5. Calculate and update budget
            updateBudget();
        }

    };


    var ctrlDeleteItem = function (event) {
        var itemID, splitID, type, ID;
        itemID = event.target.parentNode.parentNode.parentNode.id;

        if (itemID) {
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            // 1. Detele item from the data structure
            budgetCtrl.deleteItem(type, ID);

            // 2. Delete item from de UI
            UICtrl.deleteListItem(itemID);

            // 3. Update and show the new budget
            updateBudget();
        }
    };

    // ---------- public scope ------------//
    return {
        init: function () {
            console.log('application is started');
            UICtrl.displayBudget({ budget: 0, totalInc: 0, totalExp: 0, percentage: -1 });
            setupEventListeners(); // this activate all event listeners
        }
    };
})(budgetControler, UIController);

controller.init(); // this function inicializes the whole application
