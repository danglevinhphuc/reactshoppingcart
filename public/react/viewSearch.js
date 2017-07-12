var View = React.createClass({
	loadProduct: function(){
		var dataView =localStorage.getItem("ViewSearch");
		if(dataView.length == 2){
			window.location.href="/";
		}else{
			//add dataview vao dataProduct
			this.setState({dataProduct: JSON.parse(dataView)});
			console.log(JSON.parse(dataView));
		}
	},
	getInitialState: function(){
		return {
      		dataProduct : [],
		}
	},
	componentDidMount:function(){
		// load san pham giam gia 
		this.loadProduct();
	},
	render :function(){
		return (
			
      		<ListSearch productData= {this.state.dataProduct} />
      		
		);
	}
})

var ListSearch = React.createClass({
    render : function(){
	var productNodes = this.props.productData.map(
		function(product, i){
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
		});
		return (
				<div >
					{productNodes}
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
ReactDOM.render(<div><View /></div>,document.getElementById("root"));
