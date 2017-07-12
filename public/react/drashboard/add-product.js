var ProductsAdd = React.createClass({
	getInitialState: function(){
		return {
      isCheck : false,
			urlproductadd: "/api/product/add"
		}
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
      'name' : this.refs.name.value,
      'description' : this.refs.description.value,
      'price' : this.refs.price.value,
      'sale' : sale
    }
    $.post(this.state.urlproductadd,{data: value},function(err){
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
          <input type="text" placeholder="Add name..." required="true" className="form-control" ref="name" />
          <label >Description (<span className="mandatory">*</span>)</label>
          <textarea className="resizable_textarea form-control" ref="description" placeholder="Add description..."></textarea>
          <label >Price (<span className="mandatory">*</span>)</label>
          <input type="number" min="0" max="9999999999" ref="price" placeholder="Add name..." required className="form-control" />
          <div>
            <label>Sale: </label>
          <input type="checkbox" value="1" ref="sale" className="flat iradio_flat-green checked hover" /> 
          </div>
        </div>
        <div >
          <button type="submit" className="btn btn-success" onClick={this.clickUpload} disabled = {this.state.isCheck}>Add Product</button>          
        </div>
        </div>
		);
	}
})

var ProductsAddImage = React.createClass({
    getInitialState: function(){
    return {
      file: '',
      'imagePreviewUrl': '',
      isCheck : true,
      urlproductImage: "/api/product/add"
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
            url: '/api/product/add',
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
    },
    render: function() {
      let {imagePreviewUrl} = this.state;
    let $imagePreview = null;
    if (imagePreviewUrl) {
      $imagePreview = (<img src={imagePreviewUrl} />);
    } else {
      $imagePreview = (<div className="previewText">Please select an Image for Preview</div>);
    }
      return (
            <div>                
               <form ref="uploadForm" className="uploader" encType="multipart/form-data" >
                   <input ref="file" type="file" name="file" className="form-control" accept="image/*" onChange={(e)=>this._handleImageChange(e)} />
                   <div className="imgPreview">
          {$imagePreview}
        </div>          
                   <button type="submit" className="btn btn-success"  onClick={this.uploadFile} disabled = {this.state.isCheck}>Add Image</button>          
               </form>  
            </div>
        );
    }
})
ReactDOM.render(<div><ProductsAddImage /></div>,document.getElementById("form-add-image-1"));
ReactDOM.render(<div><ProductsAddImage /></div>,document.getElementById("form-add-image-2"));
ReactDOM.render(<div><ProductsAddImage /></div>,document.getElementById("form-add-image-3"));
ReactDOM.render(<div><ProductsAddImage /></div>,document.getElementById("form-add-image-4"));
ReactDOM.render(<div><ProductsAddImage /></div>,document.getElementById("form-add-image-5"));
ReactDOM.render(<div><ProductsAdd /></div>,document.getElementById("form-add-data"));

