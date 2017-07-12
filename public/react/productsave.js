var stateProductSave = null;
var stateProductNew = null;

// component product save 
var ProductsSave = React.createClass({
	
	// load san pham giam gia 
	// thong qua ajax
	// kieu xuat json
	loadProductsSaveData:function(){
		$.ajax({
			url: this.state.urlproductsale,
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
			checkProductData : [],
			products_save : [],
			urlproductsale: "/api/productssale"
		}
	},
	componentDidMount:function(){
		// load san pham giam gia 
		this.loadProductsSaveData();
	},
	render :function(){
		return (
			<ProductsList productData={this.state.products_save}  />
		);
	}
})
var ProductsList = React.createClass({
	render : function(){
	var productNodes = this.props.productData.map(
		function(product, i){
			if(i <4){
				
					var productFields= {
						id: product.id,
						name: product.name,
						description:product.description,
						price: product.price,
						image:product.image
					}
					
					return (
						<Product productFields={productFields} /> 
					)
				
			}
		});
	var productNodes2 = this.props.productData.map(
		function(product,i){
			if(i>= 4 && i <8){
					var productFields= {
						id: product.id,
						name: product.name,
						description:product.description,
						price: product.price,
						image:product.image
					}
					return (
						<Product productFields={productFields} /> 
					)
			}
		});
		return (
			<div className="carousel-inner">
			<div className="active item">
				<ul className="thumbnails listing-products">
					{productNodes}
				</ul>
			</div>
			<div className="item">
				<ul className="thumbnails">
					{productNodes2}
				</ul>
			</div>
			</div>
		);
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
		<li className="span3">
			<div className="product-box">
				<span className="sale_tag"></span>
				<p><a href={"/productdetail/"+this.props.productFields.id}><img src={"/themes/images/cloth/"+this.props.productFields.image} alt="" /></a></p>
				<a href="#" className="title">{this.props.productFields.name}</a><br/>
				<a href="#" className="category">{this.props.productFields.description}</a>
				<p className="price">{this.props.productFields.price} $</p>
				<p><a onClick={this.clickBuy} ><i className="fa fa-shopping-cart" aria-hidden="true"></i></a>  <a href={"/productdetail/"+this.props.productFields.id}><i className="fa fa-eye" aria-hidden="true"></i></a></p>
			</div>
		</li>
		)
	}
})

ReactDOM.render(<div><ProductsSave /></div>,document.getElementById("root2"));

