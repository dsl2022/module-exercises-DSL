/* global shoppingList, cuid */
/* global store, cuid */
/* global Item, cuid */
// eslint-disable-next-line no-unused-vars
'use strict';
const itemNames = [ '', 'apples', 'pears' ];
itemNames.forEach(name => {
try {
  Item.validateName(name);
  store.items.push(Item.create(name));
} catch(error) {
console.log('Cannot add item: ' + error.message);
}
});
$(document).ready(function() {

  shoppingList.render();
  shoppingList.bindEventListeners();
  shoppingList.render();
});
