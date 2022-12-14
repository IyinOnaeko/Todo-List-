//jshint esversion 6

const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
// const date = require(__dirname + "/date.js");

//require monoose 

const mongoose = require("mongoose");
const { request } = require("https");
const { lowerFirst } = require("lodash");
// console.log(date)
const app = express();


app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


// create a new database inside MongoDB
mongoose.connect("mongodb+srv://admin-john:Test123@cluster0.wlkc1q4.mongodb.net/todolistDB", { useNewUrlParser: true });

//create itemSchema

const itemSchema = {
    name: {
        type: String,
    }
}

// create a mongoose model
const Item = mongoose.model("Item", itemSchema);


//create new documents in mongoose model

const item1 = new Item({
    name: "This is a demo addition, Delete this to add your first list"
})

const item2 = new Item({
    name: "Hit the + button to add a new item."
})

const item3 = new Item({
    name: "Hit the checkbox to delete an item"
})

// add documents to array
const defaultItems = [item1, item2, item3];


//create new list schema

const listSchema = {
    name: String,
    items: [itemSchema]
};

// console.log(listSchema);

//create list from mogoose model
const List = mongoose.model("List", listSchema);


//get request 
app.get("/", function (req, res) {
    // const day = date.getDate();

    //find items from the Item Model
    Item.find({}, function (err, foundItems) { //this is to find all items 
        // console.log(foundItems);

        if (foundItems.length === 0) {
            // // use insetMany() to insert into DB
           Item.insertMany(defaultItems, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("successfully added items to DB");
                }
            });
            res.redirect("/");
        } else {
            // const list = new List({
            //     name: "Today",
            //     items: foundItems,
            // });
            // list.save();
            res.render("list", {
                ListTitle: "Today", newListItems: foundItems
            });
        }

    })

});


app.get("/:customListName", function (req, res) {
    const customListName = _.capitalize(req.params.customListName);

    //check using the list model customListName has been created
    List.findOne({ name: customListName }, function (err, foundList) {
        if (!err) {
            if (!foundList) {
                //console.log("doesn't Exist"); ? hence create a new list
                const list = new List({
                    name: customListName,
                    items: defaultItems
                });
                list.save();
                res.redirect("/" + customListName);

            } else {
                // console.log("exists"); ? show an existing list

                res.render("list", { ListTitle: foundList.name, newListItems: foundList.items })
            }
        }
    });


});



//    res.redirect("/:customListName")


//post data from the form to the server

app.post("/", function (req, res) {
    // console.log(req.body);
    const itemName = req.body.newItem;  //store data recieved in const => itemName
    const listName = req.body.list;
    //create itemName document 
    const item = new Item({
        name: itemName
    });

    if (listName === "Today") {
        item.save();
        res.redirect("/");
    } else {
        List.findOne({ name: listName }, function (err, foundList) {
            if (!err) {
                foundList.items.push(item);
                console.log(foundList);
                foundList.save();
                res.redirect("/" + listName);
    
            };

        });
    }

});



//delete data using the checkbox 
app.post("/delete", function (req, res) {
    const checkedItemId = req.body.checkbox; //save value submission when checkbox is clicked
    console.log(checkedItemId);

    //check value of listName
    const listName = req.body.listName;
    if (listName === "Today") {
        //delete items when checked is clicked
        Item.findByIdAndRemove(checkedItemId, function (err) {
            if (!err) {
                console.log("successfully deleted item");
                //redirect to home, make get request to undate to-do list
                res.redirect("/");
            }
        });
    } else {
        // you can use a filter method or you can use mongoDB's pull function $pull
        List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: checkedItemId } } }, function (err, foundList) {
            if (!err) {
                res.redirect("/" + listName);
            }
        })
    };


});


app.get("/about", function (req, res) {
    res.render("about");
})


app.listen(3000, function () {
    console.log("Server started on port 3000");
});
