import React from "react";
import { Card } from "react-bootstrap";

class OrderList extends React.Component {
    render() {
        const { orders } = this.props;

        return (
            <div id="orderList">
                {orders && orders.length > 0 ? (
                    orders.map((order) => (
                        <div key={order.productId} className="mt-5 mb-5">
                            <Card>
                                <Card.Img
                                    variant="top"
                                    src={`${process.env.REACT_APP_INFURA_DEDICATED_GATEWAY}/ipfs/${order.imgHash}`}
                                />
                                <Card.Body>
                                    <Card.Text as="div">
                                        <div>
                                            <p className="productName">{order.name}</p>
                                            <p className="productPrice">Price: {order.price} ETH</p>
                                            <p className="productBuyer">Buyer: {order.buyer}</p>
                                        </div>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </div>
                    ))
                ) : (
                    <div className="mt-5 mb-5">
                        <p>No orders available</p>
                    </div>
                )}
            </div>
        );
    }
}

export default OrderList;
