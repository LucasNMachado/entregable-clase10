const { Router } = require('express');
const ProductManager = require('../managers/productManager.js');

const router = Router();

router.get('/', async (req, res) => {
  const products = await ProductManager.getProducts();
  res.render("home", {
    products,
    style: "home.css"
  })
});

router.get('/realtimeproducts', (req, res) => {
  res.render("realTimeProducts", {
    style: "realTimeProducts.css"
  })
});

module.exports = router;
