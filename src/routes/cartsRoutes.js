const { Router } = require('express')
const CartManager = require('../managers/cartManager');
const ProductManager = require('../managers/productManager');

const router = Router();

router.get('/', async (req, res) => {
  try {
    const allCarts = await CartManager.getAllCarts();
    res.json(allCarts)
  } catch (error) {
    console.log(error)
  }
});

router.post("/", async (req, res) => {
  try {
    const newCart = await CartManager.addCart()
    res.json(newCart)
  } catch (error) {
    console.error(error)
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const idCart = parseInt(req.params.cid);
    const cart = await CartManager.getCart(idCart);
    if(!cart) {
      return res.status(404).json({ status: "failed", error: "Cart not exist" })
    };
    res.json(cart)
  } catch (error) {
    console.error(error)
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const idCart = parseInt(req.params.cid);
    const cart = await CartManager.getCart(idCart);
    if(!cart) {
      return res.status(404).json({ status: "failed", payload: "Cart not exist" })
    };
    const idProduct = parseInt(req.params.pid);
    const product = await ProductManager.getProductById(idProduct);
    if(!product) {
      return res.status(404).json({ status: "failed", payload: "Product not exist" })
    };

    const addProductToCart = await CartManager.addProductToCart(idCart, idProduct);
    res.json(addProductToCart)
  } catch (error) {
    console.error(error)
  }
});


module.exports = router