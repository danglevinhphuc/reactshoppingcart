let express = require("express");
let bodyParser = require("body-parser");
let logger = require("morgan");
let cors = require("cors");
let path =require("path");
let xFrameOptions = require('x-frame-options');

//Router index 
let index = require("./routes/index");
// creat app via express
const app = express();
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
// LOCALHOST:3000
var port = 3000;

//CORS Middleware
app.use(cors());
//X-Frame-option
app.use(xFrameOptions());
//MORGAN middleware


//Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));
app.use("/",index);

app.listen(process.env.PORT || port,function(req,res){
  console.log("connect");
});