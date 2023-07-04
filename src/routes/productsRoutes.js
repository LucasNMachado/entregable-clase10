const { Router } = require('express');
const ProductManager = require('../managers/productManager');

const router = Router();

router.get("/", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit);
    let allProducts = await ProductManager.getProducts();

    if (req.query.limit && !limit){
      return res.status(400).send({ status: "failed", error: "Query not valid" });
    } else if(limit){
      allProducts = allProducts.slice(0, limit)
    };

    res.json(allProducts);
  } catch (error) {
    console.error(error)
  }
});

router.get("/:pid", async (req, res) => {
    try {
    const id = parseInt(req.params.pid);
    const productFind = await ProductManager.getProductById(id);
    if (!productFind){
      return res.status(404).send({ status: "failed", error: `Product not found` });
    };
    res.json(productFind)
  } catch (error) {
    console.error(error)
  }
});

router.post("/", async (req, res) => {
    try {
      let { title, description, code, price, stock, category } = req.body
      if(!title || !description || !code || !price || !stock || !category) {
        return res.status(400).send({ status: "failed", error: `Missing fields` });
      };
      const newProduct = {
        title,
        description,
        code,
        price,
        stock,
        category,
        status: true,
        thumbnails: []
      }
      const addProduct = await ProductManager.addProduct(newProduct);
      res.json(addProduct)
  } catch (error) {
    console.error(error)
  }
});

router.put("/:pid", async (req, res) => {
  const fields = ["title", "description", "code", "price", "status", "stock", "category"]
    try {
      const idProduct = parseInt(req.params.pid);
      let keys = Object.keys(req.body)
      const hasValidFields = keys.every(key => fields.includes(key));
      if(!hasValidFields) {
        return res.status(400).send({ status: "failed", error: `Invalid fields` });
      };
      const productUpdated = await ProductManager.updateProduct(idProduct, req.body);
      if(!productUpdated) {
        return res.json({ status: "failed", error: `Product not found` })
      }
      res.json(productUpdated)
  } catch (error) {
    console.error(error)
  }
});

router.delete("/:pid", async (req, res) => {
    try {
      const idProduct = parseInt(req.params.pid);
      const productDeleted = await ProductManager.deleteProduct(idProduct);
      if(!productDeleted) {
        return res.status(404).json({ status: "failed", payload: "Product not found" })
      }
      res.status(200).json({ status: "success", payload: productDeleted })
  } catch (error) {
    console.error(error)
  }
});



module.exports = router