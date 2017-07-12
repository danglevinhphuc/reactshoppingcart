let express = require("express");
let index =require("./src/index");
let drashboard = require("./src/drashboard");
let router = express.Router();

//GET PRODUCT CLIENT
router.get("/",index.index);
router.get("/api/productssave",index.productsSave);
router.get("/api/productsnew",index.productsNew);
router.get("/api/productssale",index.productsSale);
router.get("/api/check",index.getCheckCart);
router.get("/cart",index.cart);
router.get("/productdetail/:id",index.productDetail);
router.get("/payment",index.payment);
router.get("/search",index.viewSearch);
//GET DRASHBOARD PRODUCT
router.get("/drashboard",drashboard.index);
router.get("/drashboard/addproduct",drashboard.getAdd);
router.get("/drashboard/editproduct/:id",drashboard.getEdit);
//POST DRASHBOARD PRODUCT
router.post("/api/product/delete",drashboard.delete);
router.post("/api/product/add",drashboard.add);
router.post("/api/product/view",drashboard.view);
router.post("/api/product/sendedit",drashboard.sendEdit);
router.post("/api/product/deletemulti",drashboard.deleteMulti);
//POST PRODUCT CLIENT
router.post("/checkcart",index.checkCart);
router.post("/api/addproduct",index.addProduct);
router.post("/api/productscart",index.productscart);
router.post("/api/product/search",index.search);
module.exports= router;