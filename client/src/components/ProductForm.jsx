import React from "react";
import { Button, Form } from "react-bootstrap";

class ProductForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imagePreviewUrl: '',
            imagePath: ''
        };
    }

    captureFile = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            this.setState({ imagePreviewUrl: reader.result });
        };
        reader.readAsDataURL(file);
        this.setState({ imagePath: file.name });  // Simulating the image path
    };
    render() {
        const { addProduct } = this.props;
        const { imagePreviewUrl, imagePath } = this.state;

        return (
            <Form onSubmit={(event) => {
                event.preventDefault();
                let title = this.productTitle.value;
                let price = this.productPrice.value;
                addProduct(title, price, imagePath);
            }}>
                <Form.Group className="mb-3" controlId="productFormFile">
                    <Form.Control type="file" accept=".jpg, .jpeg, .png, .bmp, .gif" onChange={this.captureFile} />
                </Form.Group>
                {imagePreviewUrl && <img src={imagePreviewUrl} alt="Product Preview" style={{ width: "100%", marginBottom: "10px" }} />}
                <Form.Group className="mb-3" controlId="productFormTitle">
                    <Form.Control type="text" ref={(input) => { this.productTitle = input }} placeholder="Enter Title of the Product" required />
                </Form.Group>
                <Form.Group className="mb-3" controlId="productFormPrice">
                    <Form.Control type="number" ref={(input) => { this.productPrice = input }} placeholder="Enter Price in ETH" required />
                </Form.Group>
                <Button style={{ width: "100%" }} variant="primary" type="submit">
                    Upload!
                </Button>
            </Form>
        );
    }
}

export default ProductForm;
