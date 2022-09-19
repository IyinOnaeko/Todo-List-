//jshint esversion 6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
// console.log(date)
const app = express();

let items = ["wake up", "pray", "brush teeth and shower"];
let workItems = [];

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

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
