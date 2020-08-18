var sqlite3=require("sqlite3")
var express=require("express")
var bodyparser=require("body-parser")
var nodemailer=require("nodemailer")
var jwt=require("jsonwebtoken")
var zomato = require('zomato');
var nodemailer = require('nodemailer');
var dotenv = require('dotenv');
dotenv.config();

var configdata = require('./config');
var app=express();

var client = zomato.createClient({
  userKey: 'ffc845abf406bf2fbb47d9966cdd8495', 
});

// USING NODEMAILER.

app.get("/home",function(req,res){
  res.sendFile(__dirname+"/views/home.html")
})

app.get("/login",function(req,res){
  res.sendFile(__dirname+"/views/login.html")
})

app.post("/login",(req,res)=>{
  var username=req.body.username;
  var password=req.body.Password;
  var db=new sqlite3.Database("userdata",(err)=>{
      if (err) throw err;
      else{
          db.all("select username,password from user",function(err,data){
              // console.log(data)
              for(i of data){
                  if (username==i.username && password==i.password){
                      console.log("login succesfully")
                      // return res.sendFile(__dirname+"/views/search.html")
                      return res.redirect('/search');
                  }   
              }

              return res.sendFile(__dirname+"/views/login.html")
              
          }) 
      }
  })
})


app.get('/signup', (req, res) => {
  res.sendFile(__dirname + '/views/signup.html');
})
app.post("/signup",function(req,res){
  var bdata=req.body;
  num=""
  for (var i =0;i<6;i++){
      num+=Math.floor(Math.random()*10)
  }
  console.log(num)
  bdata["otp"]=num

  console.log(bdata);
  var db=new sqlite3.Database("userdata",(err)=>{
      console.log(req.body.email);
      
      if (err) throw err;
      else{
          db.run("create table if not exists user(id integer primary key AUTOINCREMENT,username text,email_id text,password text);", (err, data) => {
              console.log('table created!');
              db.all("select * from user",(err,data)=>{
                  // console.log(data);
                  if (data.length > 0){
                      for (i of data){
                          if (i.email_id==bdata.email){
                              return res.send("This user already exists...")
                          }
                      }

                      let protocol = nodemailer.createTransport({
                          service: 'Gmail',
                          auth: {
                              user: "amanjha18@navgurukul.org",
                              pass: process.env.password
                          },
                      })
                      let Mail = {
                          from: "amanjha18@navgurukul.org",
                          to: req.body.email.toString(),
                          // to:'prakash18@navgurukul.org',
                          subject: "OTP of Your Gmail",
                          text: "OTP is "+num
                  
                      }
                      protocol.sendMail(Mail, (error, info) =>{
                          if(error){
                               console.log(error);
                               return res.send("Error 404 Not found")
                          } else {
                              console.log('success!');
                          }
                      })
                  }
                  console.log('this is bdata', bdata);
                  var token=jwt.sign(bdata, configdata.secretkey, {expiresIn:"2m"})
                      res.cookie("Token "+token)
                      return res.sendFile(__dirname+"/views/otp.html");
                  })
              })
      }
  })
})

app.post("/otp",(req,res)=>{
  var botp=req.body.otp;
  console.log(botp);
  
  var otp=req.headers.cookie;
  otp=otp.split(" ")
  otp=otp[1].slice(0,-10)
  token=jwt.verify(otp, "aman")
  // res.send(token)

      // console.log(deco);
  //     console.log(botp)
  if (token.otp==botp){
      res.sendFile(__dirname+"/views/login.html");
      var db=new sqlite3.Database("userdata",(err)=>{
          if (err) throw(err);
          else{
              db.run('insert into user(username,email_id,password) values("'+token.user+'","'+token.email+'","'+token.password+'")')
          }
      })
  }else{
      res.sendFile(__dirname+"/views/otp.html")
  }
  // })
});

app.get("/search",function(req,res){
  res.sendFile(__dirname+"/views/search.html")
})

app.post('/search', (req, res) => {
  var searchvalue = req.body.searchvalue;

  client.getLocations({
      query: searchvalue, // suggestion for location name
      // lat:"28.613939", //latitude
      // lon:"77.209021", //longitude
      count:"" // number of maximum result to fetch
      }, function(err, result){
          if(!err){
              let apidata = JSON.parse(result);
              let locate = apidata.location_suggestions;
              let lat = locate[0].latitude;
              let lon = locate[0].longitude;
              // let q = searchvalue;
              console.log(lat, lon);

              client.getGeocode({
                  lat: lat, //latitude
                  lon: lon //longitude
                  // lat: lat,
                  // lon: lon
                  }, function(err, result){
                      if(!err){
                          // let restaurants = JSON.stringify(result);
                          let obj = JSON.parse(result);
                          // let {nearby_restaurants} = obj;
                          let nearby_restaurants = obj.nearby_restaurants;
                          // console.log(nearby_restaurants);
                          // res.send(nearby_restaurants);
                          let mainlist = [];
                          
                          for (let i of nearby_restaurants){
                              // var {restaurant} = i;
                              var restaurant = i.restaurant
                              let mainobj = {}
                              mainobj.name = restaurant.name;
                              mainobj.average_cost_for_two = restaurant.average_cost_for_two;
                              mainobj.price_range = restaurant.price_range;
                              mainobj.has_online_delivery = restaurant.has_online_delivery;
                              mainobj.featured_photo = restaurant.featured_image;
                              mainobj.cuisines = restaurant.cuisines;
                              mainobj.address = i.restaurant.location.address;
                              mainlist.push(mainobj);
                          }
                          // console.log(mainlist)
                          return res.render('zomato.ejs', {data: mainlist})
                      }else {
                        console.log(err);
                        return res.end('something went wrong');
                      }
                  });

              
          }else {
            console.log(err);
          }
      });
})

app.listen(8080);