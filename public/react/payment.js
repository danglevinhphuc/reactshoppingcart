var stateCart  = null;
var stateProduct = null;
var arrayCartSl = [];
var arrayPrice = [];
/*** SHOP CART QUANLITY ****/
var Cart = React.createClass({
	loadTotal(){
		var result = 0;
		var sl = JSON.parse(localStorage.getItem("CartSl"));
		var price = JSON.parse(localStorage.getItem("CartPrice"));
		// gan mang gom so luong
		arrayCartSl  = sl;
		arrayPrice = price
		// lay gia tri duyet mang
		// va gan ve totalPrice
		for(var i in price){
			result = result + parseFloat((parseFloat(price[i])*parseInt(sl[i])));
		}
		this.setState({totalPrice : result});
	},
	loadDataProductCart : function(){
		// get du lieu trong localStorage 
		// du vao mang gui den server
		// load san pham giam gia 
		var value_local = [];
		var arrayJsonTest = [];
		value_local = JSON.parse(localStorage.getItem("idValues"));
		// ajax gui du lieu den server va nhan du lieu cho clinet
		$.post(this.state.urlproductcart,{data :value_local},function(data){
			// gan lai cho state product_cart
			stateCart.loadTotal();
			stateCart.setState({product_cart : data});
		});
	},
	getInitialState: function(){
		stateCart = this;
		return {
			totalPrice: 0,
			dataLocal :JSON.parse(localStorage.getItem("idValues")) ,
			product_cart: [],
			urlproductcart: "/api/productscart"
		}
	},
	componentDidMount:function(){
		this.loadDataProductCart();
		this.loadTotal();
	},
	render :function(){
		return (
			<div>
				<CartList cartProduct= {this.state.product_cart} >{this.state.totalPrice}</CartList>
			</div>
		);
	}
})

var CartList = React.createClass({
	render :function(){
		var cartNotes = this.props.cartProduct.map(
			function(product, i){
				var productFields= {
					id: product.id,
					name: product.name,
					description:product.description,
					price: product.price,
					image:product.image,
					"sl" :arrayCartSl[i],
				}
				// them phan tu vao trong mang arrayPrice
				// luu lai LocalStoray
				
				return (
					<Product productFields={productFields} /> 
				);
			});
		return (
			<div id="table">
				<table className="table table-hover" >
							<thead>
								<tr>
									<th>Remove</th>
									<th>Image</th>
									<th>Product Name</th>
									<th>Quantity</th>
									<th>Unit Price</th>
									<th>Total</th>
								</tr>
							</thead>
							<tbody>
							  	{cartNotes}
							</tbody>
						</table>
						<hr />
						<p className="cart-total right">
							<strong>Total</strong>: $ {this.props.children}
						</p>
			</div>
		);
	}
});

var Product = React.createClass({
	clickRemove : function(){
		// hoi truoc khi xoa
		// xoa thong qua id cua sp
		// cap nhat lai localStorage
		if(confirm("Do you want to delete product: " + this.props.productFields.name + " in your cart??? ") ){
			var value_local = JSON.parse(localStorage.getItem("idValues"));
			var value_sl = JSON.parse(localStorage.getItem("CartSl"));
			var value_price = JSON.parse(localStorage.getItem("CartPrice"));
			// tim phan tu can xoa trong mang value_local
			var timViTriXoa = value_local.indexOf(this.props.productFields.id);
			//neu khac khong tim thay thi xoa
			if (timViTriXoa!= -1) {
				// xoa phan tu trong mang value_local
 			   value_local.splice(timViTriXoa,1);
 			   value_sl.splice(timViTriXoa,1);
 			   value_price.splice(timViTriXoa,1); 
 			   console.log(value_local);
 			   console.log(value_sl);
 			   console.log(value_price);
			}
			// cap nhat lai localStorage va load lai du lieu
			localStorage.setItem("idValues", JSON.stringify(value_local));
			localStorage.setItem("CartSl", JSON.stringify(value_sl));
			localStorage.setItem("CartPrice", JSON.stringify(value_price));
			stateCart.loadTotal();
			stateCart.loadDataProductCart();
		}
	},
	getInitialState: function(){
		stateProduct = this;
		return {
			cartLocal: stateCart.state.dataLocal,
			money : 0
		}
	},
	componentDidMount:function(){
		var money = parseFloat(this.props.productFields.price)*parseInt(this.props.productFields.sl);
		this.setState({money : money});
	},
	render:function(){
		return (
		<tr>
		   <td><input type="button" value="DELETE" className="btn btn-danger" onClick={this.clickRemove} /></td>
		   <td><a href={"/productdetail/"+this.props.productFields.id}><img src={"/themes/images/cloth/"+this.props.productFields.image} alt={this.props.productFields.name} /></a></td>
		   <td>{this.props.productFields.name}</td>
		   <td><input type="number"  className="input-mini"  value={this.props.productFields.sl} min="1" placeholder ="1" disabled/></td>
		   <td>{this.props.productFields.price} $</td>
		   <td>{this.state.money} $</td>
		</tr>
		)
	}
})
/*** END SHOP CART QUANLITY ****/
ReactDOM.render(<Cart />,document.getElementById("root"));