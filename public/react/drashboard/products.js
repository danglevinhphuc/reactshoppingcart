var stateProductSave = null;
var stateProduct = null;
var arrayDelete = [];
// component product save 
var ProductsSave = React.createClass({
	
	// load san pham giam gia 
	// thong qua ajax
	// kieu xuat json
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
	onSearchSubmit:function(e){
		$.post(this.state.urlproductsearch,{data: this.refs.valueKey.value},function(data){
      		if(data.length !=0){
      		  	stateProductSave.setState({products_save: data});
     		}else{
        	 	alert("Product not found ");
      		}
    	});
    	e.preventDefault();
	},
	getInitialState: function(){
		stateProductSave = this;
		return {
			checkProductData : [],
			products_save : [],
			urlproductsave: "/api/productssave",
			urlproductsearch: "/api/product/search"
		}
	},
	componentDidMount:function(){
		// load san pham giam gia 
		this.loadProductsSaveData();
		 //delete localstoge ve edit sp
    	localStorage.removeItem("ViewProduct");
	},

	render :function(){
		return (
			<div >
			<form onSubmit={this.onSearchSubmit}>
				<input type="text" ref="valueKey" className="form-control" id="search" placeholder="Search ..."/>
			</form>
				<ProductsList productData={this.state.products_save}  />
			</div>
		);
	}
})
var ProductsList = React.createClass({
	clickDeleteMutil:function(){
		if(arrayDelete.length == 0){
			alert("You haven't selected a product yet");
		}else{
			$.post("/api/product/deletemulti",{data : arrayDelete},function(data){
				console.log(data);
			});
			window.location.href="/drashboard";
		}
	},
	render : function(){
	var lengthProduct = this.props.productData.length;
	var productNodes = this.props.productData.map(
		function(product, i){
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
					"sale" : product.save,
				}	
				return (
					<Product productFields={productFields} /> 
				)
		});
		return (
			<div>
			 <table className="table table-striped jambo_table bulk_action">
                        <thead>
                          <tr className="headings">
                            <th>
                            <button className="btn btn-danger" onClick={this.clickDeleteMutil}>Delete</button>
                            </th>
                            <th className="column-title">ID </th>
                            <th className="column-title">Name </th>
                            <th className="column-title">Description </th>
                            <th className="column-title">Price </th>
                            <th className="column-title">Sale </th>
                            <th className="column-title">image1 </th>
                            <th className="column-title no-link last"><span className="nobr">Action</span>
                            </th>
                            <th className="bulk-actions" colSpan="7">
                              <a className="antoo" >Bulk Actions ( <span className="action-cnt"> </span> ) <i className="fa fa-chevron-down"></i></a>
                            </th>
                          </tr>
                        </thead>

			<tbody>{productNodes}</tbody>
			</table>
			</div>
		);
	}
})
var Product = React.createClass({
	getInitialState: function() {
		stateProduct = this;
   		return {
      		isChecked: parseInt(this.props.productFields.sale),
      		urlproductdelte: "/api/product/delete"
    	};
  	},
  	loadProductDelete: function(){
  		$.post(this.state.urlproductdelte,{data :this.props.productFields.id},function(data){			
		});
  	},
  	clickDelete: function(){
  		var tim = arrayDelete.indexOf(this.refs.delete.value);
  		if(tim < 0){
  			arrayDelete.push(this.refs.delete.value);
  		}else{
  			arrayDelete.splice(tim,1);
  		}
  	},
  	clickRemove : function(){
		// hoi truoc khi xoa
		// xoa thong qua id cua sp
		// cap nhat lai localStorage
		if(confirm("Do you want to delete product: " + this.props.productFields.name + " in your cart??? ") ){
			this.loadProductDelete();
			window.location.href="/drashboard";
		}
	},
	render:function(){
		return (
			<tr className="even pointer">
                            <td className="a-center ">
                              <input type="checkbox" ref="delete" value={this.props.productFields.id} onClick={this.clickDelete} className="flat iradio_flat-green checked hover" name="table_records" />
                            </td>
                            <td className=" ">{this.props.productFields.id}</td>
                            <td className=" ">{this.props.productFields.name}</td>
                            <td className=" ">{this.props.productFields.description}</td>
                            <td className=" ">{this.props.productFields.price}</td>
                            <td className=" "><input type="checkbox" name={this.props.productFields.id} className="flat iradio_flat-green checked hover" checked={this.state.isChecked}  /></td>
                            <td className="a-right a-right "><img src={"/themes/images/cloth/"+this.props.productFields.image} /></td>
                            <td className=" last">
                            <a href={"/productdetail/"+this.props.productFields.id}><i className="fa fa-eye" aria-hidden="true"></i></a><br/><a href={"/drashboard/editproduct/"+this.props.productFields.id}><i className="fa fa-pencil-square-o" aria-hidden="true"></i></a><br />
                            <a onClick={this.clickRemove}><i className="fa fa-trash-o" aria-hidden="true"></i></a>
                            </td>
                          </tr>
		)
	}
})

ReactDOM.render(<div><ProductsSave /></div>,document.getElementById("root"));

