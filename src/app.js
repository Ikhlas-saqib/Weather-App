const express = require("express");
const path = require("path");
const hbs = require("hbs");
const app = express();
const { pool } = require("./dbConfig");
// require("dotenv").config();
const port = process.env.PORT ||3000 ;

//Public Static path
const static_path = (path.join(__dirname, "../public"));
const template_path = (path.join(__dirname, "../templates/views"));
const partials_path = (path.join(__dirname, "../templates/partials"));

app.set('view engine', 'hbs')
app.set('views', template_path);
hbs.registerPartials(partials_path);

app.use(express.static(static_path));
app.use(express.urlencoded({ extended: false }));


//Routing
app.get("", (req, res) => {
    res.render("index.hbs")
});
app.get("/about", (req, res) => {
    res.render("about.hbs")
});
app.get("/weather", (req, res) => {
    res.render("weather.hbs")
});
app.get("/login", (req, res) => {
    res.render("login.hbs")
});
app.get("/register", (req, res) => {
    res.render("register.hbs")
});
app.get("*", (req, res) => {
    res.render("404error.hbs", {
        errorMsg: "Oops! Page Not Found"
    });
});

app.post("/register",(req, res) => {
    let { name, email, password, password2 } = req.body;
  
    console.log({
      name,
      email,
      password,
      password2
});
});

app.listen(port , () => {
    console.log(`listening to the port at ${port}`);
});