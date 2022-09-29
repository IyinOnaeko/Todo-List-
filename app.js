//jshint esversion 6

const express = require("express");
const bodyParser = require("body-parser");
// const date = require(__dirname + "/date.js");

//require monoose 

const mongoose = require("mongoose");
// console.log(date)
const app = express();


app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


// create a new database inside MongoDB
mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true});

//create itemSchema

const itemSchema = {
    name : {
        type: String,
        required: [true, 'Please enter a task you would like to do'] 
    }
}

// create a mongoose model
const Item =  mongoose.model("Item", itemSchema);


//create new documents in mongoose model

const item1 = new Item ({
    name : "This is a demo addition, Delete this to add your first list"
})

const item2 = new Item ({
    name : "Hit the + button to add a new item."
})

const item3 = new Item ({
    name : "Hit the checkbox to delete an item"
})

// add documents to array
const defaultItems = [item1, item2, item3];

// use insetMany() to insert into DB
Item.insertMany(defaultItems, function(err){
    if(err){
        console.log(err) 
    } else {
        console.log("successfully added items to DB");
    }
})





//get request 
app.get("/", function (req, res) {
    // const day = date.getDate();

    //find items from the Item Model
Item.find({}, function(err, foundItems){ //this is to find all items 
    console.log(foundItems);
    res.render("list", {
        ListTitle: "Today", newListItems: foundItems
    });
})
   
});

app.post("/", function (req, res) {
    // console.log(req.body);
    const item = req.body.newItem;

    if (req.body.list === "Work List") {

        workItems.push(item);
        res.redirect("/work");

    } else {

        items.push(item);
        res.redirect("/");
    }

});


app.get("/work", function (req, res) {
    res.render("list", { ListTitle: "Work List", newListItems: workItems });
});

app.post("/work", function (req, res) {
    let item = req.body.newItem;
    workItems.push(item);
    res.redirect("/work");

})

app.get("/about", function (req, res) {
    res.render("about");
})


app.listen(3000, function () {
    console.log("Server started on port 3000");
});
