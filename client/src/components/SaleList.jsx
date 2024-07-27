import React from "react";
import { Card } from "react-bootstrap";
import ProductForm from './ProductForm';
import axios from 'axios';

class SaleList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      buffer: null,
      loading: false,
      dopeshop: {},  // Initialize dopeshop if it's part of the state
      account: ''  // Initialize account if it's part of the state
    };
    this.captureFile = this.captureFile.bind(this);
    this.addProduct = this.addProduct.bind(this);
  }

  captureFile(event) {
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsDataURL(file);  // Changed to readAsDataURL to get base64 string

    reader.onloadend = () => {
      this.setState({ buffer: reader.result });  // Directly store base64 string
      console.log('File captured:', this.state.buffer);
    }
  }

  async addProduct(title, price, imagePath) {
    this.setState({ loading: true });

    try {
      // Replace the below URL with your mock API endpoint
      const apiUrl = 'https://638ee6bc4ddca317d7e8e611.mockapi.io/api/v2/Food';

      const productData = {
        title: title,
        price: price,
        image01: imagePath // Convert buffer to base64 string if available
      };

      const response = await axios.post(apiUrl, productData);
      console.log('API response:', response.data);

      this.setState({ loading: false });
    } catch (err) {
      console.error('API Error:', err);
      this.setState({ loading: false });
    }
  }

  render() {
    return (
      <div id="salesList">
      <h2>Add Product</h2>
        <ProductForm addProduct={this.addProduct} captureFile={this.captureFile} />
        {this.props.sales?.map((sale, key) => (
          <div key={key} className="mt-5 mb-5">
            <Card>
            <Card.Img variant="top" src={sale.image ? `/images/${sale.image}` : "default.jpg"} />
              <Card.Text as="div">
                <div>
                  <p className="productName">{sale.name}</p>
                  <p className="productPrice">{sale.price}</p>
                </div>
              </Card.Text>
            </Card>
          </div>
        ))}
      </div>
    );
  }
}

export default SaleList;
