const express = require("express")
const app = express()
const fs = require("fs")
const multer  = require('multer')
const session = require("express-session")
app.use(express.json())
app.use(express.urlencoded({extended:true})) // form data get krne k liye
app.use(express.static("public"))
app.use(session({
  secret: 'keyboard cat', // key for encrypt decrypt
    resave: false,
    saveUninitialized: true,
    cookie: {}
}))

const upload = multer({ dest: 'uploads' }) // server me data yha store hga, form se file ki info ayegi.
  //for ejs
  app.set("view engine","ejs"); // for using ejs
  app.set("views","./views");

  app.get("/uploads/:id",(req,res)=>{
    res.sendFile(__dirname+"/uploads/"+req.params.id)
  })

const db = require('./database/init')
db() //db connected

const usersModel = require("./database/models/users")
const productsModel = require("./database/models/products")
const cartModel = require("./database/models/cart")
const mail = require('./services/sendMail')

  app.route("/home").get((req,res)=>{
    if(req.session.username===undefined)
    {
      res.render("home",{username:"new user"});
    }
    else{
      res.render("home", {
        username: req.session.username,
        });
    }
   
})
app.route("/login").get(login).post(loginUser)
app.route("/signup").get(signup).post(signupUser)
app.get("/logout",(req,res)=>{
    req.session.destroy()
    res.redirect("/login")
})
app.get("/allProducts",allProds)
app.route("/load-more").get(loadMore)

app.route("/validateEmail/:userId").get(verifyUser)

app.route("/changePass").post(changePass).get((req,res)=>{
  res.render("passChange")
})
app.route("/forgotPass").get((req,res)=>{
  res.render("forgotPass")
}).post(forgotPass)

app.route("/resetPass/:id").get((req,res)=>{
  req.session.userid = req.params.id
  res.render("resetPass")
}).post(resetPass)

app.route("/cart").get((req,res)=>{
   if (req.session.isLoggedIn)
    {
      res.render("cart")
    }
    else
    {
        res.render("login",{err:"login first to enter cart"})
    }
})
app.route("/addToCart/:id").get(addToCart)
app.get("/deleteCart/:id",deleteCart)
app.get("/sendCart",sendCart)
app.route("/updateProds/:id").get((req,res)=>{
  req.session.prodId = req.params.id
  // console.log(req.params.id)
  res.render("updateProds",{text:""})
}).post(updateProds)

app.get("/deleteProduct/:id",deleteProds)
app.get("/admin",(req,res)=>{
  if( req.session.admin)
  {
    res.render("admin")
  }
  else{
    res.render("login",{err:"admin not logged in"})
  }
})
app.route("/addProds").post(addProds).get((req,res)=>{
  res.render("addProds",{text:""})
})
app.listen(3000,()=>{
    console.log("server running")
})
async function deleteProds(req,res)
{
  id = req.params.id
  await productsModel.deleteOne({_id:id})
  res.redirect("/admin")
}
async function updateProds(req,res)
{
  prod = req.body 
  await productsModel.updateOne({_id:req.session.prodId},{name:prod.name,price:prod.price,qty:prod.qty,image:prod.image,description:prod.description})
  res.render("updateProds",{text:"product updated"})
}
async function addProds(req,res)
{
  prod = req.body 
  await productsModel.create(prod)
  res.render("addProds",{text:"product added"})
}
async function allProds(req,res)
{
  prods = await productsModel.find({})
  res.json(prods)
}
async function deleteCart(req,res)
{
  id = req.params.id
  await cartModel.deleteOne({_id:id})
  res.redirect("/cart")
}

async function sendCart(req,res)
{
  uid = req.session.uId
  items = await cartModel.find({uId:uid})
  res.json(items)
}
async function addToCart(req,res)
{
  if (req.session.isLoggedIn)
    {
      let item = await productsModel.find({_id:req.params.id})
      uid = req.session.uId
      item = item[0]
      
      cart = {uId:uid,name:item.name,price:item.price,image:item.image,description:item.description}
      // console.log(cart)
      await cartModel.create(cart)
      res.redirect("/home")
    }
    else{
      res.render("login",{err:"login first to use cart"})
    }
  
}
async function resetPass(req,res)
{
  newpass = req.body.newPassword
  // console.log(newpass,req.session.userid)
  await usersModel.updateOne({_id:req.session.userid},{password:newpass})
  res.render("login",{err:"password has been reset"})
}


async function changePass(req,res)
{
  let newPass = req.body.newPassword
  newUser = await usersModel.updateOne({email:req.session.userData.email},{password:newPass})
  body = "<h2>Hi, your password has been changed successfully</h2>"
  subject = "Password changed"
  mail(req.session.username,req.session.userData.email,body,subject)
  req.session.destroy()
  res.render("login",{err:"password changed successfuly!"})
}

async function forgotPass(req,res)
{
  let email = req.body.email
  try{
    let id = await usersModel.findOne({email:email})
  subject="reset password"
  body =`
        <h2> Click below link to reset password</h2>
        <a href=http://localhost:3000/resetPass/${id._id}>link to reset</a>
        ` 
  mail(id.name,email,body,subject)
  res.render("login",{err:"password reset link sent to your email"})    
  }
  catch (err){
    // console.log(err)
    res.render("login",{err:"Email is not registered"})  
  }
    
}

async function loadMore(req,res)
{
  const c = await productsModel.count({})

  getProductsDb(req,(err,data)=>{
    data={
      d:data,
      count:c
    }
    res.json(data)
  })
}

function login(req,res)
{
  res.render("login",{err:""})
}

function loginUser(req,res)
{
    getUser((err,data)=>{
        const user = data.filter(function(user)
        {
            if( user.email === req.body.email && user.password === req.body.password )
            {
              req.session.username=user.name
              req.session.uId = user._id
              req.session.admin  = user.admin
              
                return true
            }
        })
        if(user.length)
        {
          // console.log(user[0].isVerified)
            req.session.userData = req.body
            req.session.isLoggedIn = true
            if(user[0].isVerified)
            {
              res.redirect("/home") //redirect to home if login success
              return
            }
            else
            {
              res.render("login",{err:"verify your email first"})
            }   
        }
        else
        {
          res.render("login",{err:"invalid username or password"}); //redirect to login if login fails
        }
    })
}

function signup(req,res)
{
  res.render("signup",{err:""})
}

function signupUser(req,res)
{
    saveUser(req.body,(err,data)=>{
        if(err)
        {
          res.render("signup",{err:"user already exists"})
        }
        else
        {
          body="Verify your shopholic password"+
          `<h1>verify yourself sir / mam</h1>
            <a href=http://localhost:3000/validateEmail/${data._id}>Click here</a>
          `
          mail(req.body.name,req.body.email,body,"Email verification")
          res.redirect("/login")
        }
    })
}
async function saveUser(user,callback)//write
{ 
  let check = await usersModel.findOne({email:user.email})
  if(check===null)
  {
    let createdUser = await usersModel.create(user)
    callback(false,createdUser)
  }
  else
  {
    callback(true)
  }  
}

function getUser(callback)//read
{
  usersModel.find({}).then((users)=>{
    callback(null,users)
  })
  .catch((err)=>{
    callback(err,null)
  })
}

function getProductsDb(req,callback)
{
  const {limit=5,skip=0} = req.query
  productsModel.find({}).limit(limit).skip(skip)
  .then((prods)=>{
    callback(null,prods)
  })
  .catch((err)=>{
    callback("error",null)
  })
}

async function verifyUser(req,res)
{
  const id = req.params.userId
 user =  await usersModel.findOne({_id:id})
    if(user)
    {
     await usersModel.updateOne({ _id:id }, { isVerified: true })
      res.redirect("/login")
    }

}