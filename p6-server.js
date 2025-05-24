//p6-server.js
//middleware
//in-memory data

//store item objects
let items = [];

//load in the express to create web server
const express = require("express");
//Support serving static files from a public subfolder
const path = require("path");
//helps with defining routes
const app = express();
//http://localhost: ${port} with port = 3000
const port = 3000;
// break down and read JSON data in reuest body and make it available via req.body
//if request contaisn json data, store in req.body
app.use(express.json());
//Support serving static files from a public subfolder
//express.static tells if folder is there or not, without it, express wont work with html or css
//__dirname = variable that returns full path to the directory fo current file ex:  C:\Users\Sasha\Documents\p6-server
//"public" = my subfolder were html and css is located
//path.join joins directory path with public
app.use(express.static(path.join(__dirname, "public")));

//GET - return all items #####
app.get("/items", (req, res) => {
  res.json(items);
});

//POST - add new item #####
//define POST route
app.post("/items", (req, res) => {
  //grabs JSON data sent by client and stores into receivedData
  const receivedData = req.body;
  //checks if client sent name, if not error appears
  //! = not || = or
  if (!receivedData || !receivedData.name) {
    console.error("POST error: Missing name");
    return res.status(400).json({ error: "Item name is required" });
  }
  //creates new item object with unquie ID and name
  const newItem = {
    //gives how many items are currently in array + 1
    id: items.length + 1,
    //pulls name value from JSON data from client
    name: receivedData.name,
  };
  //adds new item object to items[]
  items.push(newItem);
  console.log("Item added:", newItem);
  //sends JSOn repsonce back to client with HTTP status, success message and new item object
  res.status(201).json({
    message: "Item added successfully",
    data: newItem,
  });
});

//PUT - update item by id #####

app.put("/items/:id", (req, res) => {
  //req.params.id gets id from URL wheil parseInt converts it to a number
  const itemsId = parseInt(req.params.id);
  //looks for items array for object, id matches resourceId
  //findIndex returns index of the matching item, or -1 if not found
  const itemsIndex = items.findIndex((item) => item.id === itemsId);
  //if resource not found, 404 message will print
  if (itemsIndex === -1) {
    return res.status(404).json({ message: "Resource not found" });
  }
  //creates object and coplies all properties from orginal resource using ...resources
  //then overwrites or adds any fields from req.body
  const updatedResource = {
    ...items[itemsIndex],
    ...req.body,
  };
  //replaces old objects with new
  items[itemsIndex] = updatedResource;
  //200 = ok
  res.status(200).json(updatedResource);
});

//DELETE - delete item by id #####

app.delete("/items/:id", (req, res) => {
  //req.params.id gets id from URL wheil parseInt converts it to a number
  const itemId = parseInt(req.params.id);
  //looks for items array for object, id matches resourceId
  //findIndex returns index of the matching item, or -1 if not found
  const itemIndex = items.findIndex((item) => item.id === itemId);
  //404 error print
  if (itemIndex === -1) {
    return res.status(404).json({ message: "Item not found" });
  }
  //.spirce removes 1 item at the found index from the array
  //returns array with the deleted item, and stored here
  const deletedItem = items.splice(itemIndex, 1);
  res.json({ message: "Item deleted", data: deletedItem[0] });
});
//404 handler ####
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

//start server ####
app.listen(port, () => {
  console.log(`Server runnning on http://localhost: ${port}`);
});
