import React from "react";
import axios from 'axios';
import Web3 from 'web3';
import Navbar from './components/SiteNavbar';
import Main from './components/Main';
import { Container } from "react-bootstrap";
// import { create } from "ipfs-http-client";
import DopeShop from './contracts/DopeShop.json';
import Cart from './components/Cart';
// Initialize IPFS client

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      account: '',
      dopeshop: null,
      products: [],
      orders: [],
      sales: [],
      cart: [],
      myProducts: [],
      loading: true,
      show: 'products'
    };
    this.handleNav = this.handleNav.bind(this);
    this.captureFile = this.captureFile.bind(this);
    // this.addProduct = this.addProduct.bind(this);
    this.createOrder = this.createOrder.bind(this);
    this.addToCart = this.addToCart.bind(this);
    this.removeFromCart = this.removeFromCart.bind(this);
  }

  async componentDidMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
    await this.fetchProductsFromAPI();
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        console.log('Ethereum enabled');
      } catch (error) {
        console.error('User denied account access');
      }
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
      console.log('Legacy dapp browser detected');
    } else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  }
  
  async loadBlockchainData() {
    const web3 = window.web3;
    try {
      const accounts = await web3.eth.getAccounts();
      this.setState({ account: accounts[0] });
      console.log('Account:', accounts[0]);

      const networkId = await web3.eth.net.getId();
      console.log('Network ID:', networkId);
      const networkData = DopeShop.networks[networkId];
      if (networkData) {
        const dopeshop = new web3.eth.Contract(DopeShop.abi, networkData.address);
        this.setState({ dopeshop });

        const productCount = await dopeshop.methods.productCount().call();
        console.log('Product Count:', productCount);

        const products = [];
        const myProducts = [];
        const orders = [];
        const sales = [];

        for (let i = productCount; i > 0; i--) {
          const product = await dopeshop.methods.products(i).call();
          if (product.seller === this.state.account) {
            myProducts.push(product);
          } else {
            products.push(product);
          }
        }

        const ordersCount = await dopeshop.methods.ordersCount().call();
        for (let i = ordersCount; i > 0; i--) {
          let order = await dopeshop.methods.orders(i).call();
          const product = await dopeshop.methods.products(order.productId).call();
          order = { ...order, imgHash: product.imgHash, name: product.name, price: product.price };
          if (order.seller === this.state.account) {
            sales.push(order);
          } else if (order.buyer === this.state.account) {
            orders.push(order);
          }
        }

        this.setState({ products, myProducts, orders, sales, loading: false });
        console.log('State updated:', this.state);
      } else {
        window.alert('DopeShop contract not deployed to detected network.');
      }
    } catch (error) {
      console.error('Error loading blockchain data:', error);
    }
  }

  async fetchProductsFromAPI() {
    try {
      const response = await axios.get('https://638ee6bc4ddca317d7e8e611.mockapi.io/api/v2/Food');
      this.setState({ products: response.data, loading: false });
      console.log('Products from API:', response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      this.setState({ loading: false });
    }
  }

  handleNav(show) {
    console.log('Navigating to:', show);
    this.setState({ show });
  }

  captureFile(event) {
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);

    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) });
      console.log('File captured:', this.state.buffer);
    }
  }

  // addProduct(title, price) {
  //   this.setState({ loading: true });
  //   ipfs.add(this.state.buffer)
  //     .then(async (res) => {
  //       console.log('IPFS response:', res);
  //       if (res) {
  //         await this.state.dopeshop.methods.addProduct(title, res.path, price)
  //           .send({ from: this.state.account })
  //           .on('transactionHash', (hash) => {
  //             console.log('Transaction hash:', hash);
  //           })
  //           .on('receipt', (receipt) => {
  //             console.log('Transaction receipt:', receipt);
  //             this.setState({ loading: false });
  //           })
  //           .on('error', (error) => {
  //             console.error('Transaction error:', error);
  //             this.setState({ loading: false });
  //           });
  //       } else {
  //         console.error('Error uploading file to IPFS');
  //         this.setState({ loading: false });
  //       }
  //     })
  //     .catch(err => {
  //       console.error('IPFS Error:', err);
  //       this.setState({ loading: false });
  //     });
  // }

  createOrder(productId, price) {
    if (!this.state.dopeshop) {
        console.error('DopeShop contract not initialized.');
        return;
    }
  
    this.setState({ loading: true });
      
    const weiPrice = window.web3.utils.toWei(price.toString(), 'ether');
      
    this.state.dopeshop.methods.createOrder(productId)
        .send({ from: this.state.account, value: weiPrice })
        .on('transactionHash', (hash) => {
            console.log('Transaction hash:', hash);
        })
        .on('receipt', (receipt) => {
            console.log('Transaction receipt:', receipt);
            
            // After creating order, update the orders state to include the new order
            const newOrder = {
                productId: productId,
                price: price,
                buyer: this.state.account,
                // You may need to fetch additional details like name, imgHash, etc.
            };

            this.setState(prevState => ({
                orders: [newOrder, ...prevState.orders], // Add new order to the beginning of the array
                loading: false
            }));
        })
        .on('error', (error) => {
            console.error('Transaction error:', error);
            this.setState({ loading: false });
        });
}
addToCart(productId) {
  // Example implementation: adding product to cart based on productId
  const { products } = this.state;
  const product = products.find(product => product.id === productId);

  if (product) {
    this.setState(prevState => ({
      cart: [...prevState.cart, product]
    }));
    console.log('Product added to cart:', product);
  }
}

removeFromCart(productId) {
  this.setState(prevState => ({
    cart: prevState.cart.filter(item => item.id !== productId)
  }));
  console.log('Product removed from cart:', productId);
}

  render() {
    return (
      <div id="App">
        <Navbar account={this.state.account} handleNav={this.handleNav} />
        <div className="main">
          {this.state.loading
            ? <div id="loader" className="text-center mt-5"><p>Loading...</p></div>
            : <Container>
                <Main
                  show={this.state.show}
                  products={this.state.products}
                  myProducts={this.state.myProducts}
                  orders={this.state.orders}
                  sales={this.state.sales}
                  addToCart={this.addToCart}
                  removeFromCart={this.removeFromCart}
                  captureFile={this.captureFile}
                  addProduct={this.addProduct}
                  createOrder={this.createOrder}        
                  cart={this.state.cart} 
                />
                
                {this.state.show === 'cart' && (
                  <Cart 
                    cart={this.state.cart} 
                    removeFromCart={this.removeFromCart}
                    createOrder={this.createOrder}
                    products={this.state.products}
                    
                  />
                )}             
              </Container>
          }
          
        </div>
        
      </div>
    );
  }
}

export default App;
