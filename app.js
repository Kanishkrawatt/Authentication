//jshint esversion:6
require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const ejs = require("ejs")
const bodyParser = require("body-parser")
const encrypt = require("mongoose-encryption")


const app = express()
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended:true}))
app.set("view engine","ejs")


mongoose.connect("mongodb://localhost:27017/newuserDB",{useNewUrlParser:true});

const userSchema= new mongoose.Schema({
    email : String,
    password : String
})

userSchema.plugin(encrypt,{secret:process.env.secret,encryptedFields :["password"]})


const  User = new mongoose.model("User",userSchema);

app.get("/",(req,res)=>{
    res.render("home");
})

app.get("/login",(req,res)=>{
    res.render("login");
})

app.get("/register",(req,res)=>{
    res.render("register");
})


app.post("/login",(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email:username} ,(err,foundUser)=>{
        if(err){
            console.log(err);
        }
        else{
            if(foundUser.password === password){
                res.render("secrets")
            }
            else{
                console.log("wrong pass");
            }
        }
    })
})

app.post("/register",(req,res)=>{
    
    const newUser = new User({
        email : req.body.username,
        password :req.body.password
    })

    newUser.save(err=>{
        if (!err){
            res.render("secrets")
        }
        else{
            console.log(err);
        }
    })
})












app.listen(3000,(err)=>{
    if(!err){
        console.log("3000 post ");
    }
})
