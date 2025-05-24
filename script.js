//finds the <ul> (unordered list) and stores it in itemList so you can add <li> elemnts to it later
//document.getElementById find HTML element by its id attribute. Used to access button,  input, change value, etc.
const itemList = document.getElementById("itemList");
//find add item button
const addButton = document.getElementById("addButton");
//find text input where user types item name
const itemNameInput = document.getElementById("itemName");

//loads all items from the server
async function loadItems() {
  //sends GET request to /items route
  //await for response from the server before continuing
  const res = await fetch("/items");
  //converts responce from the server into a useable js array
  const items = await res.json();

  //clears out old list of items so we dont show duplicates when reloading list
  itemList.innerHTML = "";
  //loops through each item in the items array
  items.forEach((item) => {
    //creates new li (list) and sets ots text to show items ID and name
    const li = document.createElement("li");
    li.textContent = `${item.id}: ${item.name}`;

    //creates delete button
    const deleteBtn = document.createElement("button");
    //css and html like writing in scipt bc button is not const visable
    deleteBtn.textContent = "Delete";
    deleteBtn.style.marginLeft = "10px";
    //connects delete button to the logic that actaully remove the item when you clikc it
    //deletBtn refers to earier code of creating button
    //onclick assigns a click handler to button
    //() => deleteItem(item.id) says when button is click run function deleteItem
    deleteBtn.onclick = () => deleteItem(item.id);
    //adds delete button to the list item
    //adds the list item to the unordered list on the page
    li.appendChild(deleteBtn);
    itemList.appendChild(li);
  });
}
//declares a function to add a new item to the server
//async pausses and wait for opertions
async function addItem() {
  //gets value typed into the input field and trims any extra spaces
  const name = itemNameInput.value.trim();
  //if the input is emptry, show an alert and stop the function from runing
  if (!name) return alert("Please enter a name.");

  //sends a POST request to /items with the item name as json data, creates new item on server
  const res = await fetch("/items", {
    //telles the server what kind of action your taking, POST means want to send data to create somethin on server
    method: "POST",
    //tells server the format is JSON
    headers: { "Content-Type": "application/json" },
    //converts JS object to a JSON string
    body: JSON.stringify({ name }),
  });
  //waits for sever to send back the result
  const result = await res.json();
  //if reuest is successful , clear input box and reload the itme list
  if (res.ok) {
    itemNameInput.value = "";
    loadItems();
  } else {
    //show error
    alert(result.error);
  }
}
//delete an item by its ID
async function deleteItem(id) {
  //sends DELETE request to sever and convers repsonce to JSON
  const res = await fetch(`/items/${id}`, { method: "DELETE" });
  const result = await res.json();

  //if reuest is successful , clear input box and reload the itme list
  if (res.ok) {
    loadItems();
  } else {
    alert(result.message);
  }
}
//sets up the "add item" button to call addItem() when clicked
addButton.addEventListener("click", () => {
  console.log("Add button clicked!");
  addItem();
});
