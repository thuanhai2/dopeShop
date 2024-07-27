import React from 'react';
// import OrderList from './OrderList';
import SaleList from './SaleList';
import ProductList from './ProductList';
// import Cart from './Cart';
class Main extends React.Component {
    render() {
        const { show, createOrder, addToCart, products, sales, myProducts } = this.props;

        if (show === 'products') {
            return (
                <div id="products">
                    <ProductList products={products} createOrder={createOrder} addToCart={addToCart} />
                </div>
            );
        } else if (show === 'sales') {
            return (
                <div id="sales">
                    <h2>My Sales</h2>
                    <SaleList products={myProducts} sales={sales} />
              </div> 
            );
        } 
        else if (show === 'cart') {
            return (
                <div id = "cart">
                    <h2>My Cart</h2>
                </div>
            )
        }
    }
}

export default Main;
