var Search = React.createClass({
  getInitialState: function(){
    return {
      isCheck : false,
      urlproductsearch: "/api/product/search"
    }
  },
  loadDataChange : function(e){
    $.post(this.state.urlproductsearch,{data: this.refs.valueKey.value},function(data){
      if(data.length !=0){
        localStorage.setItem("ViewSearch", JSON.stringify(data));
        window.location.href="/search";
      }else{
        alert("Product not found ");
      }
    });
    e.preventDefault();
  },
  render :function(){
    return (
      <div>
        <form onSubmit={this.loadDataChange}>
        <input type="text"  ref='valueKey'  className="input-block-level search-query" placeholder="eg. T-sirt" />
        </form>
        </div>
    );
  }
})

ReactDOM.render(<div><Search /></div>,document.getElementById("search"));


