const express = require("express");
const path = require("path");
const hbs = require("hbs");
const app = express();
const { pool } = require("./dbConfig");
const bcrypt = require("bcrypt");
const async = require("hbs/lib/async");
const session = require("express-session");
const flash = require("express-flash");
const http = require("http");
const passport = require("passport");



const port = process.env.PORT ||3000 ;

//Public Static path
const static_path = (path.join(__dirname, "../public"));
const template_path = (path.join(__dirname, "../templates/views"));
const partials_path = (path.join(__dirname, "../templates/partials"));
const initializePassport = require("./passportConfig");
const { use } = require("passport");


app.set('view engine', 'hbs')
app.set('views', template_path);
hbs.registerPartials(partials_path);
initializePassport(passport);

app.use(express.static(static_path));
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
      secret: "secret",
      resave: false,
      saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


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
app.get("/login", checkAuthenticated,(req, res) => {
    res.render("login.hbs")
});
app.get("/register", checkAuthenticated,(req, res) => {
    res.render("register.hbs")
});
app.get("/dashboard", checkNotAuthenticated,(req,res)=>{
  console.log("I am inside dashboard");
  res.render("dashboard", {user:req.user.name})
});
app.get("/logout", (req, res) => {
  req.logOut();
  req.flash("success_msg", "You have logged out successfully");
  res.redirect("/login");
});

app.get("*", (req, res) => {
    res.render("404error.hbs", {
        errorMsg: "Oops! Page Not Found"
    });

});
app.post("/register", async (req, res) => {
    let { name, email, password, password2 } = req.body;
  
    console.log({
      name,
      email,
      password,  
      password2
});

let errors = [];
const format=/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/; 
    const number=/\d/;
    const lowercase=/[a-z]/;
    const uppercase=/[A-Z]/;

if (!name || !email || !password || !password2) {
    errors.push({ message: "Please enter all fields" });
  }

  if (password.length < 8) {
    errors.push({ message: "Password must be a least 8 characters long" });
  }

  if (password !== password2) {
    errors.push({ message: "Passwords do not match" });
  }
  if(!(format.test(password))){
    errors.push({message: "Password must contain at least one special character"})
  }
  if(!(lowercase.test(password))){
    errors.push({message: "Password must contain at least one lowercase character"})
  }
  if(!(uppercase.test(password))){
    errors.push({message: "Password must contain at least one uppercase character"})
  }
  if(!(number.test(password))){
      errors.push({message:"password must contain at least one number"})
  }
  if (errors.length > 0) {
    res.render("register", { errors, name, email, password, password2 });
  } else{

hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
    pool.query(
        `SELECT * FROM users
          WHERE email = $1`,
        [email],
        (err, results) => {
          if (err) {
            console.log(err);
          }
          console.log(results.rows);
         
        if (results.rows.length > 0) {
           errors.push({ message: "Email already registered" });
           res.render("register", { errors });
          } 
          
          else {
            pool.query(
              `INSERT INTO users (name, email, password)
                  VALUES ($1, $2, $3)
                  RETURNING id, password`,
              [name, email, hashedPassword],
              (err, results) => {
                if (err) {
                  throw err;
                }
                console.log(results.rows);
                req.flash("success_msg", "You are now registered. Please log in");
            
                res.redirect("/login");
                
              }
            )
             
        }
    })
  }        
})


app.post("/login",passport.authenticate("local",{
  successRedirect: "/dashboard",
  failureRedirect:"/login",
  failureFlash: true
}))
function checkAuthenticated(req,res,next){
  if(req.isAuthenticated()){
      return res.redirect("/dashboard");
  }
  next();
} 
function checkNotAuthenticated(req,res,next){
  if(req.isAuthenticated()){
      console.log("iam in checknotauthenticated")
   return next();
  }
  res.redirect("/login");
  
}

app.listen(port , () => {
    console.log(`listening to the port at ${port}`);
});