let fs = require("fs");
let path =require("path");
let PRODUCTSSAVE_FILE = path.join(__dirname,"../../models/products_save.json");
let PRODUCTSNEW_FILE = path.join(__dirname,"../../models/products_new.json");
// tao bien luu gio hang
var Cart = [];
// index url via GET
exports.index = (req,res)=>{
	res.render("index");
}
exports.productsSave = (req,res) =>{
	fs.readFile(PRODUCTSSAVE_FILE,function(err,data){
		res.setHeader("Cache-Control","no-cache");
		res.send(JSON.parse(data));
	});
}
exports.productsNew = (req,res)=>{
	fs.readFile(PRODUCTSNEW_FILE,(err,data) =>{
		res.setHeader("Cache-Control","no-cache");
		res.send(JSON.parse(data));
	});
}
exports.addProduct =(req,res) =>{
	fs.readFile(PRODUCTS_FILE,(err,data) =>{
		var products = JSON.parse(data);
		// id luu gia tri cua form truyen ve 
		var id = req.body.id;
		var check = 0;
		//tao vong lap kiem tra 
		//neu gap trung thi thong bao vao bien check

		for (var i in products) {
 		    id_Body = products[i].id;
  			if(id_Body == id){
  				check = 1;
  				break;
  			}else{
  				check = 0;
  			}
		}
		// kiem tra trk khi them vao mang  thong qua ID 
		if(!check) {
			products.push(req.body);
			fs.writeFile(PRODUCTS_FILE,JSON.stringify(products,null, 3),(err,data) =>{	
			res.setHeader("Cache-Control","no-cache");
			res.json(JSON.parse(data));
			});
		}
	});
}

exports.checkCart = (req,res) =>{
	id_cart = req.body.note;
	Cart.push(id_cart);
	console.log(Cart);
	res.send("Them thanh cong");
}
exports.getCheckCart = (req,res) =>{
	if(Cart.length){
		res.send(Cart);
	}
}
exports.cart = (req,res) =>{
	res.render("cart");
}
exports.productscart= (req,res) =>{
	let DataCart = [];
	let dataID = req.body["data[]"];
	let productsWillSend = [];
	// lay du lieu tu productsave dem ra so sanh tim thay thi them vao mang
	fs.readFile(PRODUCTSSAVE_FILE,(err,data) =>{
		res.setHeader("Cache-Control","no-cache");
		productData = JSON.parse(data);
		// check neu du lieu nhan tu client la mang
		if(dataID instanceof Array){
			// duyet mang dataId duoc gui tu client den
			for(id in dataID){
			let idFind = dataID[id];
			// duyen mang productData trong csdl
			for(i in productData){
					// so sanh 
					// neu id cua dataID trung vs id cua productData
					// thi them vao mang va thoat ra khoi vogn 
					if(productData[i].id == idFind){
						productsWillSend.push(productData[i]);	
						break;
					}
				}
			}
		}else{
			// duyen mang productData trong csdl
			for(i in productData){
				// so sanh 
				// neu id cua dataID trung vs id cua productData
				// thi them vao mang va thoat ra khoi vogn 
				if(productData[i].id == dataID){
					productsWillSend.push(productData[i]);	
					break;
				}
			}
		}
		// gui du lieu den client
		res.send(productsWillSend);
	});
}
exports.productDetail = (req,res) =>{
	res.render("product_detail");
}
exports.payment= (req,res )=>{
	res.render("payment");
}
exports.productsSale = (req,res) =>{
	var dataChangeProductSale = [];
	var dataSend = [];
	fs.readFile(PRODUCTSSAVE_FILE,function(err,data){
		var dataProductSale = JSON.parse(data);
		// dao nguoc vi tri lai
		for(var i = dataProductSale.length-1 ; i >= 0 ; i--){
			// kiem tra neu co gia tri giam gia thi them vao
			dataChangeProductSale.push(dataProductSale[i]);
		}
		// duyet lai mang lay noi dung co save giam gia
		// duyet dua tren mang dataProductSale
		// noi dung cua dataChangeProductSale
		for(var j in dataProductSale){
			if(parseInt(dataChangeProductSale[j].save) == 1){
				// lay toi dat 8 noi dung
				dataSend.push(dataChangeProductSale[j]);
			}
		}
		res.send(dataSend);
	});
}
exports.search = (req,res) =>{
	let dataSendSearch = [];
	let keyword = req.body.data;
	fs.readFile(PRODUCTSSAVE_FILE,function(err,data){
		let dataProductSearch = JSON.parse(data);
		for(let i in dataProductSearch){
			//console.log(dataProductSearch[i].name.indexOf(keyword));
			if(dataProductSearch[i].name.search(keyword) != -1){
				dataSendSearch.push(dataProductSearch[i]);
			}
		}
		res.send(dataSendSearch);
	});
}
exports.viewSearch = (req,res) =>{
	res.render('search');
}