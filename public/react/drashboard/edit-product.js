var stateProduct ;
var idUrl = 0;
var dataProductImage = {};
var sync = 0;
var ProductsAdd = React.createClass({
  addDataForm : function(){
    stateProduct.refs.name.value =stateProduct.state.dataProduct.name;
    stateProduct.refs.description.value =stateProduct.state.dataProduct.description;
    stateProduct.refs.price.value =stateProduct.state.dataProduct.price;
    if(parseInt(stateProduct.state.dataProduct.save) == 1){
      stateProduct.setState({isCheckSale : true});
    }else{
      stateProduct.setState({isCheckSale : false});
    }
  },
  getParam : function(){
    var url =window.location.href;
    var urlLength = url.length;
    var editLength = url.indexOf("editproduct/");
    var start = editLength+("editproduct/").length;
    var id= url.slice(start, urlLength);
    
    return id;
  },
  loadProductEdit: function(){
    $.post(this.state.urlproduct,{data: this.getParam()},function(data){
      stateProduct.setState({dataProduct: data});
      stateProduct.addDataForm();      
      // them data vao mang de cho viec su ly add image
      if(dataProductImage == null){
        // load lan 2 de lay du lieu
        window.location.href = window.location.href;
      }
      localStorage.setItem("ViewProduct", JSON.stringify(data));
    });
  },
	getInitialState: function(){
    stateProduct = this;
		return {
      dataProduct : [],
      isCheckSale: false,
      isCheck : false,
			urlproductedit: "/api/product/sendedit",
      urlproduct: "/api/product/view"
		}
	},
  componentDidMount:function(){
    // load san pham giam gia voi param url
    this.loadProductEdit();
  },
  clickUpload:function(event){
    event.preventDefault();
    var check = parseInt(this.refs.sale.value);
    var sale = 0;
    if(check){
      sale = 1;
    }else{
      sale = 0;
    }
    //get data gui de server
    var value = {
      "id" : this.getParam(),
      'name' : this.refs.name.value,
      'description' : this.refs.description.value,
      'price' : this.refs.price.value,
      'sale' : sale
    }
    $.post(this.state.urlproductedit,{data: value},function(err){
      console.log(err);
    });
    // khoa click khong cho upload
    this.setState({isCheck : true});
  }
  ,
	render :function(){
		return (
      <div>
      <div>
			  <label >Name (<span className="mandatory">*</span>)</label>
          <input type="text" placeholder="Add name..." required="true" className="form-control" ref="name"  />
          <label >Description (<span className="mandatory">*</span>)</label>
          <textarea className="resizable_textarea form-control" ref="description" placeholder="Add description..."></textarea>
          <label >Price (<span className="mandatory">*</span>)</label>
          <input type="number" min="0" max="9999999999" ref="price" placeholder="Add name..." required className="form-control" />
          <div>
            <label>Sale: </label>
          <input type="checkbox" value="1" ref="sale" className="flat iradio_flat-green checked hover" checked={this.state.isCheckSale} /> 
          </div>
        </div>
        <div >
          <button type="submit" className="btn btn-success" onClick={this.clickUpload} disabled = {this.state.isCheck}>Add Product</button>          
        </div>
        </div>

		);
	}
})
/* CSS **/
var styles = {
  block: {
    display: 'none'
  }
};


var ProductsAddImage = React.createClass({
    getInitialState: function(){
    return {
      file: '',
      'imagePreviewUrl': '',
      isCheck : true,
      urlproductEditImage: "/api/product/sendedit"
    }
  },
   _handleImageChange(e) {
    e.preventDefault();
    this.setState({isCheck: false});
    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        file: file,
        imagePreviewUrl: reader.result
      });
    }
    reader.readAsDataURL(file)
  },
  uploadFile: function (e) {
        var fd = new FormData();    
        fd.append('file', this.refs.file.files[0]);
        $.ajax({
            url: this.state.urlproductEditImage,
            data: fd,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function(data){
                alert(data);
            } 
        });
        e.preventDefault();
        this.setState({isCheck: true});
    }
    ,
  componentDidMount:function(){
    // load san pham giam gia voi param url
    dataProductImage = JSON.parse(localStorage.getItem("ViewProduct"));
    
    if(dataProductImage != null){
      sync = 1;
    }
    if(sync){
      if(this.props.name == "1"){
        this.refs.picture.src = "/themes/images/cloth/"+dataProductImage.image;    
      }else if(this.props.name == "2"){
        this.refs.picture.src = "/themes/images/cloth/"+dataProductImage.image2;    
      }else if(this.props.name == "3"){
        this.refs.picture.src = "/themes/images/cloth/"+dataProductImage.image3;    
      }else if(this.props.name == "4"){
        this.refs.picture.src = "/themes/images/cloth/"+dataProductImage.image4;    
      }else{
        this.refs.picture.src = "/themes/images/cloth/"+dataProductImage.image5;    
      }
    }
  },
    render: function() {
    let {imagePreviewUrl} = this.state;
    let $imagePreview = null;
    if (imagePreviewUrl) {
      $imagePreview = (<img src={imagePreviewUrl} />);
    } else {
      $imagePreview = (<div className="previewText">Current image</div>);
    }
    const changePicture =  this.state.isCheck;
      return (
            <div>                
               <form ref="uploadForm" className="uploader" encType="multipart/form-data" >
                   <input ref="file" type="file" name="file"  className="form-control" accept="image/*" onChange={(e)=>this._handleImageChange(e)} />
                  <div >
                    {$imagePreview}
                  </div>  
                  <div>{changePicture ?(<img src ref="picture" />) : (<div>Just Change</div>) }</div>
                   <button type="submit" className="btn btn-success"  onClick={this.uploadFile} disabled = {this.state.isCheck}>Add Image</button>          
               </form>  
            </div>
        );
    }
})
ReactDOM.render(<div><ProductsAddImage name="1" /></div>,document.getElementById("form-add-image-1"));
ReactDOM.render(<div><ProductsAddImage name="2" /></div>,document.getElementById("form-add-image-2"));
ReactDOM.render(<div><ProductsAddImage name="3" /></div>,document.getElementById("form-add-image-3"));
ReactDOM.render(<div><ProductsAddImage name="4" /></div>,document.getElementById("form-add-image-4"));
ReactDOM.render(<div><ProductsAddImage name="5" /></div>,document.getElementById("form-add-image-5"));
ReactDOM.render(<div><ProductsAdd /></div>,document.getElementById("form-add-data"));