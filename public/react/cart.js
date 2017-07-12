var stateCart  = null;
var stateProduct = null;
var arrayCartSl = [];
var arrayPrice = [];
var checkSet = 0;
/*** SHOP CART QUANLITY ****/
var Cart = React.createClass({
	// ham set localStroga cho price
	setPriceLocal(data){
		var CartPrice =localStorage.getItem("CartPrice");
		// dung pivot check 1 lan loadpage set lai CartPrice
		if(!checkSet){
			for(var i in data){
				arrayPrice.push(data[i].price);
				localStorage.setItem("CartPrice", JSON.stringify(arrayPrice));
			}
			checkSet = 1;
		}
	},
	// them gia tri vao arrayCartId va arrayCartSl
	addCartId(product){
		for(var i in product){
			arrayCartSl.push(1);
		}
		localStorage.setItem("CartSl", JSON.stringify(arrayCartSl));
	},
	loadTotal(){
		var result = 0;
		var sl = JSON.parse(localStorage.getItem("CartSl"));
		var price = JSON.parse(localStorage.getItem("CartPrice"));
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
			stateCart.setPriceLocal(data);
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
		this.addCartId(JSON.parse(localStorage.getItem("idValues")));
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
					image:product.image
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
			console.log(timViTriXoa);
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
	newQuantityChange: function(){
		//console.log(parseInt(this.refs.newQuantity.value)*parseInt(this.state.qli));
		//khi du lieu thay doi trong input thi cap nhap lai gia tong
		//cong thuc tinh gia : giaMoi = soluong*giaGoc
		//kiem tra neu rong thi quay lai gia tri ban dau la gia goc
		if(this.refs.newQuantity.value.length !=0){
			var soLuong = parseInt(this.refs.newQuantity.value);
			if(soLuong < 1 || soLuong >=999999999){
				soLuong = 1;
			}
			var giaGoc = parseFloat(this.props.productFields.price);
			var giaMoi = parseFloat(soLuong*giaGoc);
			this.setState({money : giaMoi});
		}else{
			// gia ban dau
			this.setState({money : parseFloat(this.props.productFields.price) });
		}
		// lay gia tri id cua san pham
		// lay tong so id trong this.state.cartLocal
		var _id = this.props.productFields.id;
		var _cartLocal = this.state.cartLocal;
		// duyen mang 
		for(var i in _cartLocal){
			// neu giong thi ngung duyet mang
			if(_cartLocal[i] == _id){
				// neu so luong khac rong
				if(soLuong !== undefined){
					// cap nhat lai so lieu ve so luong 
					arrayCartSl[i] = soLuong;
					// gui du lieu len localStorage
					localStorage.setItem("CartSl", JSON.stringify(arrayCartSl));
				}else{
					arrayCartSl[i] = 1;
					// gui du lieu len localStorage
					localStorage.setItem("CartSl", JSON.stringify(arrayCartSl));
				}
				break;
			}
		}
		stateCart.loadTotal();
	},
	getInitialState: function(){
		stateProduct = this;
		return {
			cartLocal: stateCart.state.dataLocal,
			money : 0
		}
	},
	componentDidMount:function(){
		this.setState({money : parseFloat(this.props.productFields.price)});
	},
	render:function(){
		return (
		<tr>
		   <td><input type="button" value="DELETE" className="btn btn-danger" onClick={this.clickRemove} /></td>
		   <td><a href={"/productdetail/"+this.props.productFields.id}><img src={"/themes/images/cloth/"+this.props.productFields.image} alt={this.props.productFields.name} /></a></td>
		   <td>{this.props.productFields.name}</td>
		   <td><input type="number"  className="input-mini" min="1" max="999999999" placeholder ="1" ref="newQuantity" onChange={this.newQuantityChange} /></td>
		   <td>{this.props.productFields.price} $</td>
		   <td>{this.state.money} $</td>
		</tr>
		)
	}
})
/*** END SHOP CART QUANLITY ****/
ReactDOM.render(<Cart />,document.getElementById("root"));