/**** PRODUCT DEATAIL ****/
var stateProductSave = null;
var stateProductNew = null;
// component product save 
var ProductsSave = React.createClass({
	// load san pham giam gia 
	// thong qua ajax
	// kieu xuat json
	getIdProduct(){
		var url = window.location.href ;
		var lenghProductAndId = url.indexOf("productdetail/");
		var lengthId= url.length - (lenghProductAndId+14);
		var id =  url.slice(url.length-lengthId, url.length);
		this.setState({idProduct : id});
	},
	loadProductsSaveData:function(){
		$.ajax({
			url: this.state.urlproductsave,
			dataType:"json",
			cache: false,
			success: function(data){
				this.setState({products_save: data});
			}.bind(this),
			error: function(xhr,status,err){
				console.log(err);
			}.bind(this)
		});
	},
	getInitialState: function(){
		stateProductSave = this;
		return {
			idProduct: 0,
			checkProductData : [],
			products_save : [],
			urlproductsave: "/api/productssave"
		}
	},
	componentDidMount:function(){
		// load san pham giam gia 
		this.loadProductsSaveData();
		this.getIdProduct();
	},
	render :function(){
		return (
			<ProductsList productData={this.state.products_save} >{this.state.idProduct}</ProductsList>
		);
	}
})
var ProductsList = React.createClass({
	render : function(){
	var id = this.props.children;
	var productNodes = this.props.productData.map(
		function(product, i){
			if(product.id == id){
				var productFields= {
					id: product.id,
					name: product.name,
					description:product.description,
					price: product.price,
					image:product.image,
					image2:product.image2,
					image3:product.image3,
					image4:product.image4,
					image5:product.image5,
				}
				return (
					<Product productFields={productFields} /> 
				)
			}
		});
		return (
			<div>{productNodes}</div>
		)
	}
})

var valueBuy = [];
function kiemTraTrung(valueLocal,idValue){
	for(var i in valueLocal){
		if(valueLocal[i] == idValue){
			return 1;
			break;
		}
		
	}
}

var Product = React.createClass({
	clickBuy:function(e){
		var value_id = this.props.productFields.id;
		// them id vao localStorage de check form them san pham cart
		var value_local =JSON.parse(localStorage.getItem("idValues"));
		// kiem tra neu trong gio co hang thi k cho them vao
		if(kiemTraTrung(value_local,value_id) != 1){
			if(value_local && valueBuy.length == 0){
			// tao vong lap khi du lieu con trong localStorage
			// nguoi dung F5
			for(var i = 0 ;i < value_local.length ; i++){
				valueBuy.push(value_local[i]);
			}
			valueBuy.push(value_id);
			localStorage.setItem("idValues", JSON.stringify(valueBuy));
			alert("Buy successful product: " + this.props.productFields.name);
			}else{
				valueBuy.push(value_id);
				localStorage.setItem("idValues", JSON.stringify(valueBuy));
				alert("Buy successful product: " + this.props.productFields.name);
			}
		}else{
			alert("Already in product cart: "  + this.props.productFields.name);
		}
	},	
	render:function(){
		return (
		<div>
			<div className="span4">
				<a href= {"/themes/images/cloth/"+this.props.productFields.image} className="thumbnail" data-fancybox-group="group1" title="Picture 1"><img alt="" src={"/themes/images/cloth/"+this.props.productFields.image} alt={this.props.productFields.name+this.props.productFields.image} /></a>												
				<ul className="thumbnails small">								
				<li className="span1">
				<a href={"/themes/images/cloth/"+this.props.productFields.image2} className="thumbnail" data-fancybox-group="group1" title="Picture 2"><img src={"/themes/images/cloth/"+this.props.productFields.image2}  alt={this.props.productFields.name+this.props.productFields.image2} /></a>
				</li>								
				<li className="span1">
  					<a href={"/themes/images/cloth/"+this.props.productFields.image3} className="thumbnail" data-fancybox-group="group1" title="Picture 3"><img src={"/themes/images/cloth/"+this.props.productFields.image3}  alt={this.props.productFields.name+this.props.productFields.image3} /></a>
				</li>													
				<li className="span1">
  					<a href={"/themes/images/cloth/"+this.props.productFields.image4} className="thumbnail" data-fancybox-group="group1" title="Picture 4"><img src={"/themes/images/cloth/"+this.props.productFields.image4}  alt={this.props.productFields.name+this.props.productFields.image4} /></a>
				</li>
				<li className="span1">
  					<a href={"/themes/images/cloth/"+this.props.productFields.image5} className="thumbnail" data-fancybox-group="group1" title="Picture 5"><img src={"/themes/images/cloth/"+this.props.productFields.image5}  alt={this.props.productFields.name+this.props.productFields.image5} /></a>
				</li>
				</ul>
				</div>
				<div className="span5">
					<address>
					<strong>Name:</strong> <span>{this.props.productFields.name}</span><br />				
					<strong>Description:</strong> <span>{this.props.productFields.description}</span><br />				
					</address>	
					<h4><strong>Price: ${this.props.productFields.price}</strong></h4>
				</div>
				<div className="span5">
					
					<button className="btn btn-inverse" onClick={this.clickBuy}>Add to cart</button>
					||<a href="/cart" className="btn btn-danger">Go to cart</a>
				</div>	
			</div>
		)
	}
})
/**** END PRODUCT DEATAIL ****/
ReactDOM.render(<div><ProductsSave /></div>,document.getElementById("root"));


