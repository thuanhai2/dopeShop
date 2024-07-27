import React from 'react';
import { ListGroup, Button } from 'react-bootstrap';
import "../styles/Cart.css";

class Cart extends React.Component {
    handleBuy = () => {
        const { cart, createOrder } = this.props;
        // Call createOrder function passed from props
        cart.forEach(product => {
          createOrder(product.id, parseFloat(product.price));
        });
      };
  render() {
    const { cart, removeFromCart } = this.props;
    const totalPrice = cart.reduce((total, product) => total + parseFloat(product.price), 0);
    
    return (
      <div className="cart">
        <h2>Cart</h2>
        <ListGroup>
          {cart.map((product, index) => (
            <ListGroup.Item key={index}>
              {product.title} - {parseFloat(product.price).toFixed(2)} ETH
              <Button
                variant="danger"
                size="sm"
                style={{ float: 'right' }}
                onClick={() => {
                  removeFromCart(product.id);
                }}
              >
                Remove
              </Button>
              
            </ListGroup.Item>
          ))}
          <div className="total" style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
            <strong>Total Price:</strong> {totalPrice.toFixed(2)} ETH
            <Button
              variant="primary"
              size="lg"
              onClick={this.handleBuy}
              disabled={cart.length === 0}
              style={{ }}
            >
              Buy
            </Button>
          </div>
             
        </ListGroup>
        
      </div>
    );
  }
}

export default Cart;
