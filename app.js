//jshint esversion 6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

//require monoose 

const mongoose = require("mongoose");
// console.log(date)
const app = express();


app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


// create a new database inside MongoDB
mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true});

const itemSchema = {
    name : {
        type: String,
        required: [true, 'Please enter a task you would like to do'] 
    }
}


app.get("/", function (req, res) {
    const day = date.getDate();
    res.render("list", {
        ListTitle: day, newListItems: items
    });
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
