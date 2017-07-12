let fs = require("fs");
let path =require("path");
var multer = require("multer");
let PRODUCTSSAVE_FILE = path.join(__dirname,"../../models/products_save.json");
// index url via GET
exports.index = (req,res)=>{
	res.render("drashboard/index");
}
exports.delete = (req,res)=>{
	let id = req.body.data;
	let timViTriXoa = 0;
	// doc file
	fs.readFile(PRODUCTSSAVE_FILE,(err,data) =>{
		// get Data chuyen data thanh mang 
		let dataProduct = JSON.parse(data);
		// ta co vi tri mang va noi dung 
		// dataProduct[id-1];
		// xoa vi tri noi dung trong mang
		for(var i in dataProduct){
			if(dataProduct[i].id == id){
				timViTriXoa =i;
				dataProduct.splice(timViTriXoa,1);
				// ghi lai file
				fs.writeFile(PRODUCTSSAVE_FILE,JSON.stringify(dataProduct), function (err) {
					if (err) 
						return console.log(err);
					console.log('Delete product successful');
				});
				break;
			}
		}
	});
}
exports.getAdd = (req,res)=>{
	res.render("drashboard/add-product");
}
// su dung multer up hinh
var storage = multer.diskStorage({

	destination: function (req, file, cb) {
		cb(null, './public/themes/images/cloth');
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname)
	}

})
var upload = multer({ storage: storage}).single('file');
var newProduct = {};
/* ham upload hinh anh va gan lai bien newProduct 
	3 doi so dau vao gom co req,res, name 
	*/
	function addProductWithImage(req,res,name,data){
		var path = '';
		upload(req, res, function (err) {
			if (err) {
				console.log(err);
				return res.status(422).send("an Error occured")
			}	  
			if(req.file){
				path = req.file.filename;	
			}else{
				path = " ";
			}
			newProduct[name] = path;	
			return res.send("Add "+name+" successful "); 
		});
	}
	exports.add = (req,res) =>{
		fs.readFile(PRODUCTSSAVE_FILE,(err,data) =>{
		// get Data chuyen data thanh mang 
		let dataProduct = JSON.parse(data);
		// ta co vi tri mang va noi dung 
		let positionMaxdataProduct = dataProduct.length-1;
		let postion = dataProduct[positionMaxdataProduct].id;
		// new newProduct co ton tai id
		if(newProduct.id == undefined){
			let dataNew = {
				"id" : parseInt(postion)+1,
				"name" : req.body['data[name]'],
				"description" : req.body['data[description]'],
				"price": req.body["data[price]"],
				"save" : req.body["data[sale]"],
				"image" : "",
				"image2" : "",
				"image3" : "",
				"image4" : "",
				"image5" : "",
			}
			newProduct = dataNew;
		}else if(newProduct.id && newProduct.image == ''){
			addProductWithImage(req,res,"image",newProduct);
		}else if(newProduct.id && newProduct.image2 == ''){
			addProductWithImage(req,res,"image2",newProduct);
		}else if(newProduct.id && newProduct.image3 == ''){
			addProductWithImage(req,res,"image3",newProduct);
		}else if(newProduct.id && newProduct.image4 == ''){
			addProductWithImage(req,res,"image4",newProduct);
		}else if(newProduct.id && newProduct.image5 == ''){
			var path = '';
			upload(req, res, function (err) {
				if (err) {
					console.log(err);
					return res.status(422).send("an Error occured")
				}	  
				if(req.file){
					path = req.file.filename;	
				}else{
					path = " ";
				}
				newProduct["image5"] = path;
				// add newProduct into dataProduct
				dataProduct.push(newProduct);
				// update data to file 
				fs.writeFile(PRODUCTSSAVE_FILE,JSON.stringify(dataProduct), function (err) {
					if (err) 
						return console.log(err);
					//reset lai bien toan cuc
					newProduct = {};
				});
				return res.send("Add image5 successful "); 
			});
		}
	});
	}
	exports.getEdit = (req,res) =>{
		res.render("drashboard/edit-product");
	}
	exports.view = (req,res) =>{
		let id = req.body.data;
		//doc file
		fs.readFile(PRODUCTSSAVE_FILE,(err,data) =>{
		// get Data chuyen data thanh mang 
		let dataProduct = JSON.parse(data);
		// tim noi dung co id tuong tu voi id tu client
		// tao vong lap duyet mang json
		for(var i in dataProduct){
			if(dataProduct[i].id == id){
				res.send(dataProduct[i]);
				break;
			}
		}
	});
	}
	exports.deleteMulti = (req,res) =>{
	// lay gia tri tu client gui den 
	let dataProductsDelete = req.body["data[]"];
	let timViTriXoa = 0;
	// doc file
	fs.readFile(PRODUCTSSAVE_FILE,(err,data) =>{
		// get Data chuyen data thanh mang 
		let dataProduct = JSON.parse(data);
		// kiem tran co phai la mang hay khong
		if(dataProductsDelete instanceof Array){
			// ta co vi tri mang va noi dung 
			// xoa vi tri noi dung trong mang
			for(var i in dataProductsDelete){
				for(var j in dataProduct){
					if(dataProduct[j].id == dataProductsDelete[i]){
						timViTriXoa =j;
						dataProduct.splice(timViTriXoa,1);
						break;
					}
				}
			}	
		}else{
			// duyen mang dataProduct trong csdl
			for(var k in dataProduct){
				// so sanh 
				// neu id cua dataProductsDelete trung vs id cua dataProduct
				// thi them vao mang va thoat ra khoi vogn 
				if(dataProduct[k].id == dataProductsDelete){
					timViTriXoa =k;
					dataProduct.splice(timViTriXoa,1);
					break;
				}
			}
		}
		// ghi lai file
		fs.writeFile(PRODUCTSSAVE_FILE,JSON.stringify(dataProduct), function (err) {
			if (err) 
				return console.log(err);
			console.log('Delete product successful');
		});
	});
}
var editProduct = {
	"id" : -1,
	"name" : "",
	"description": "",
	"price": 0,
	"save" : 0,
	"image" : 0,
	"image2" : 0,
	"image3" : 0,
	"image4" : 0,
	"image5" : 0
};

function editProductWithImage(req,res,name){
	let path = '';
	upload(req, res, function (err) {
		if (err) {
			console.log(err);
			return res.status(422).send("an Error occured")
		}	  
		if(req.file){
			path = req.file.filename;	
		}else{
			path = " ";
		}
		editProduct[name] = path;
		console.log(editProduct);
		return res.send("Add  successful "); 
	});
}
var postion = 0;
exports.sendEdit = (req,res) =>{
	fs.readFile(PRODUCTSSAVE_FILE,(err,data) =>{
		
		// get Data chuyen data thanh mang 
		let dataProduct = JSON.parse(data);
		let id = parseInt(req.body['data[id]']);
		// lay vi tri cua dataProduct theo Id
		for(var i in dataProduct){
			// duyet mang tim id trong dataProduct
			if(dataProduct[i].id == id){
				postion = i ;
			}
		}
		/*dataProduct[postion]['name'] = req.body['data[name]'];
		dataProduct[postion]['description'] = req.body['data[description]'];
		dataProduct[postion]['price'] = req.body['data[price]'];
		dataProduct[postion]['save'] = req.body['data[sale]'];*/
		// kiem tra neu ton tai id gui tu client 
		// tu la gia tri khong phai hinh
		if(id){
			editProduct['id'] = id;
			editProduct['name'] = req.body['data[name]'];
			editProduct['description'] = req.body['data[description]'];
			editProduct['price'] = req.body['data[price]'];
			editProduct['save'] = req.body['data[sale]'];
		}
		// tao dieu kien de check upload hinh
		// tao image , image2,image3,image4,image5 rong
		// neu truyen vao thi gan gia tri ton tai roi thi k them nua
		if(dataProduct[postion].id && !editProduct.image && req.body['data[id]'] == undefined){
			editProductWithImage(req,res,"image");
		}else if(dataProduct[postion].id && !editProduct.image2 && req.body['data[id]'] == undefined){
			editProductWithImage(req,res,"image2");
		}else if(dataProduct[postion].id && !editProduct.image3 && req.body['data[id]'] == undefined){
			editProductWithImage(req,res,"image3");
		}else  if(dataProduct[postion].id && !editProduct.image4 && req.body['data[id]'] == undefined){
			editProductWithImage(req,res,"image4");
		}else if(dataProduct[postion].id && !editProduct.image5 && req.body['data[id]'] == undefined){
			var path = '';
			upload(req, res, function (err) {
				if (err) {
					console.log(err);
					return res.status(422).send("an Error occured")
				}	  
				if(req.file){
					path = req.file.filename;	
				}else{
					path = " ";
				}
				editProduct["image5"] = path;
				/* Gan vao gia tri dataProduct voi vi tri la postion */
				/* gom co name, description, price,save, image,image2,image3,image4,image5 */
				dataProduct[postion]['name'] = editProduct['name'];
				dataProduct[postion]['description'] = editProduct['description'];
				dataProduct[postion]['price'] = editProduct['price'];
				dataProduct[postion]['save'] = editProduct['save'];
				dataProduct[postion]['image'] = editProduct['image'];	
				dataProduct[postion]['image2'] = editProduct['image2'];
				dataProduct[postion]['image3'] = editProduct['image3'];
				dataProduct[postion]['image4'] = editProduct['image4'];
				dataProduct[postion]['image5'] = editProduct['image5'];
			// update data to file 
			fs.writeFile(PRODUCTSSAVE_FILE,JSON.stringify(dataProduct), function (err) {
				if (err) 
					return console.log(err);
				//reset lai bien toan cuc
				postion = 0;
				editProduct = {
					"id" : -1,
					"name" : "",
					"description": "",
					"price": 0,
					"save" : 0,
					"image" : 0,
					"image2" : 0,
					"image3" : 0,
					"image4" : 0,
					"image5" : 0
				};
			});
			return res.send("Add  successful "); 
		});
		}

	});
}