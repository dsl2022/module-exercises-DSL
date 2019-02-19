'use strict';
/* global Item, cuid */

const store = (function(){
 
    const items= [
      { id: cuid(), name: 'apples', checked: false },
      { id: cuid(), name: 'oranges', checked: false },
      { id: cuid(), name: 'milk', checked: true },
      { id: cuid(), name: 'bread', checked: false }
    ];
    const hideCheckedItems = false;
    const searchTerm= '';
  
    function findById(id){
      
      return store.items.find( item => item.id===id);
    }

    function addItem(name){
      try{
        Item.validateName(name);
        console.log('this is a test',items);
        this.items.push(Item.create(name));
      }
      catch(error){
        console.log(error);
      }}
      
   function findAndToggleChecked(id){
      const foundItem =  this.findById(id);
      foundItem.checked  = !foundItem.checked;    
   }
     
   function findAndUpdateName (id,newName){
     try{
      Item.validateName(newName);
      this.findById(id).name = newName;       
     }catch(error){
      console.log('Cannot update name: {error.message}');
     }
   }


  function findAndDelete(id){
    const index = store.items.findIndex(item => item.id === id);
    store.items.splice(index, 1);
  } 

  return {
    
    items: items,
    hideCheckedItems:hideCheckedItems,
    searchTerm:searchTerm,
    findById:findById,
    findAndToggleChecked:findAndToggleChecked,
    findAndUpdateName:findAndUpdateName,
    addItem:addItem,
    findAndDelete:findAndDelete
  };
}());

console.log(store);
