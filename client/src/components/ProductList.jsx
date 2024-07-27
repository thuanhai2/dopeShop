import React from "react";
import { Button, Card } from "react-bootstrap";

class ProductList extends React.Component {
  render() {
    const { products, createOrder, addToCart } = this.props;

    return (
      <div id="productList" className="container">
        <div className="row">
          {products.map((product, key) => (
            <div key={key} className="col-md-4 mt-5 mb-5">
              <Card>
                <Card.Img
                variant="top"
                src={product.image ? `/images/${product.image}` : "/images/default.jpg"}  // Adjust path as needed
            
              />
                <Card.Body>
                  <Card.Title>{product.title}</Card.Title>
                  <Card.Text>
                    <p className="productPrice">Price: {product.price} ETH</p>
                  </Card.Text>
                  <Button variant="primary"
                    onClick={() => {
                      createOrder(product.id, product.price);
                    }} >
                    Buy Now
                  </Button>
                  <Button variant="success"
                  style={{ float: 'right' }}
                   onClick={() => {addToCart(product.id);}} >
                    Add to Cart
                  </Button>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default ProductList;
