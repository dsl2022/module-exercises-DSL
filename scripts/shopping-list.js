/* global store, cuid */
/* global Item, cuid, api */

// eslint-disable-next-line no-unused-vars
'use strict';
const shoppingList = (function(){

  function generateItemElement(item) {
    let itemTitle = `<span class="shopping-item shopping-item__checked">${item.name}</span>`;
    if (!item.checked) {
      itemTitle = `
        <form class="js-edit-item">
          <input class="shopping-item type="text" value="${item.name}" />
        </form>
      `;
    }

    return `
      <li class="js-item-element" data-item-id="${item.id}">
        ${itemTitle}
        <div class="shopping-item-controls">
          <button class="shopping-item-toggle js-item-toggle">
            <span class="button-label">check</span>
          </button>
          <button class="shopping-item-delete js-item-delete">
            <span class="button-label">delete</span>
          </button>
        </div>
      </li>`;
  }


  function generateShoppingItemsString(shoppingList) {
    const items = shoppingList.map((item) => generateItemElement(item));
    return items.join('');
  }


  function render() {
    // Filter item list if store prop is true by item.checked === false
    
    let items = store.items;
    if (store.hideCheckedItems) {
      items = store.items.filter(item => !item.checked);
    }

    // Filter item list if store prop `searchTerm` is not empty
    if (store.searchTerm) {
      items = store.items.filter(item => item.name.includes(store.searchTerm));
    }

    // if there is error, print the arror to the page. 
    if (store.error.length>0){
      $('.display-error').html(`Error: ${store.error}`);
    }else{
      // the reason for adding the else cause is because
      // when the Add item button is clicked, store.error is reset
      // to '', then the render() is ran right after, then 
      // here it check store.error.length =0, then it empty it. 
      $('.display-error').empty();
    }

    // render the shopping list in the DOM
    console.log('`render` ran');
    const shoppingListItemsString = generateShoppingItemsString(items);

    // insert that HTML into the DOM
    $('.js-shopping-list').html(shoppingListItemsString);
  }


  // function addItemToShoppingList(itemName) {
  //   // store.items.push({ id: cuid(), name: itemName, checked: false });
  //   try{
  //     Item.validateName(itemName);


  //     store.items.push(Item.create(itemName));
  //     render();
  //   }
  //   catch(error){
  //     console.log(`Cannot add item: ${error.message}`);
  //     alert("can't create");
  //   }
  // }
  function addErrorToStoreAndRender(error){
    console.log('test inside adderrortostore',error);
    store.error = error;
    shoppingList.render();
  }

  function addDataToStoreAndRender(items){
    items.forEach((item) => store.addItem(item));
    console.log('test-index.js inside api.getItems',store.items);
    $('.js-shopping-list').empty();
    shoppingList.render();
  }

  function handleNewItemSubmit() {
    $('#js-shopping-list-form').submit(function (event) {
      event.preventDefault();
      store.error = '';
      render();
      const newItemName = $('.js-shopping-list-entry').val();
      $('.js-shopping-list-entry').val('');
      api.createItem(newItemName)
      // this will need to be deleted, because the listApiFetch() method
      // from api module already called res.json(), it can't be called twice.   
      //.then(res => res.json())
        .then(newItem => store.addItem(newItem))  
        .catch(err => 
          addErrorToStoreAndRender(err.message));  
        
        
          
    });
  }

  // redundant
  // function toggleCheckedForListItem(id) {
  //   const foundItem = store.items.find(item => item.id === id);
  //   foundItem.checked = !foundItem.checked;
  // }


  function getItemIdFromElement(item) {
    return $(item)
      .closest('.js-item-element')
      .data('item-id');
  }

  function handleItemCheckClicked() {
    $('.js-shopping-list').on('click', '.js-item-toggle', event => {
      const id = getItemIdFromElement(event.currentTarget);
      let item = store.items.find(item => item.id===id);
      
      console.log('test item checked',!item.checked);
      api.updateItem(id,{checked:!item.checked})
      // remember here
      // I spent a long time to debug this part earlier. 
      // it turns out that I did not pass an object into
      // findAndUpdate(), so the Ojbect.assign() from the store 
      // module does not work properly. The purpose of the Object.assign()
      // is to replace the part of the item from the local store. 
      // check the usage of Object.assign() function guide. 
        .then(()=>store.findAndUpdate(id,{checked:!item.checked}));
        
      
      
    });
  }

  // redundant
  // function deleteListItem(id) {
  //   const index = store.items.findIndex(item => item.id === id);
  //   store.items.splice(index, 1);
  // }

  // function editListItemName(id, itemName) {
  //   const item = store.items.find(item => item.id === id);
  //   item.name = itemName;
  // }

  // function toggleCheckedItemsFilter() {
  //   store.hideCheckedItems = !store.hideCheckedItems;
  // }

  // function setSearchTerm(val) {
  //   store.searchTerm = val;
  // }


  function handleDeleteItemClicked() {
    // like in `handleItemCheckClicked`, we use event delegation
    $('.js-shopping-list').on('click', '.js-item-delete', event => {
      // get the index of the item in store.items
      const id = getItemIdFromElement(event.currentTarget);
      api.deleteItem(id)
        .then(()=>store.findAndDelete(id));
      // delete the item
      
      // render the updated shopping list
      render();
    });
  }


  function handleEditShoppingItemSubmit() {
    $('.js-shopping-list').on('submit', '.js-edit-item', event => {
      event.preventDefault();
      store.error = '';
      const id = getItemIdFromElement(event.currentTarget);
      const itemName = $(event.currentTarget).find('.shopping-item').val();
      console.log('test id itemName',id,itemName);
      api.updateItem(id,{name:itemName})
        .then(()=>store.findAndUpdate(id, {name:itemName}))
        .catch(err => 
        { console.log('testing inside findandupdate catch',err.message);
          addErrorToStoreAndRender(err.message);
        }); 
        



      
      
    });
  }

  function handleToggleFilterClick() {
    $('.js-filter-checked').click(() => {
      store.toggleCheckFilter();
      render();
    });
  }

  function handleShoppingListSearch() {
    $('.js-shopping-list-search-entry').on('keyup', event => {
      const val = $(event.currentTarget).val();
      store.setSearchTerm(val);
      render();
    });
  }

  function bindEventListeners() {
    
    handleNewItemSubmit();
    handleItemCheckClicked();
    handleDeleteItemClicked();
    handleEditShoppingItemSubmit();
    handleToggleFilterClick();
    handleShoppingListSearch();
  }

  // This object contains the only exposed methods from this module:
  return {
    render: render,
    addErrorToStoreAndRender:addErrorToStoreAndRender,
    addDataToStoreAndRender:addDataToStoreAndRender,
    bindEventListeners: bindEventListeners,
  };
}());
